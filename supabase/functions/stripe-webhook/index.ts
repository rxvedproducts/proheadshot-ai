
// IMPORTANT: To deploy this function, you must bypass JWT verification:
// CLI: supabase functions deploy stripe-webhook --no-verify-jwt
// Dashboard: Go to Edge Functions -> stripe-webhook -> Settings -> Enforce JWT Verification -> Disable

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

declare const Deno: any;

console.log("Stripe Webhook v13 (Robust Plan Lookup) Initialized");

Deno.serve(async (req: Request) => {
  try {
    const signature = req.headers.get('Stripe-Signature')
    if (!signature) {
        console.error("Missing Stripe-Signature header");
        return new Response('Missing Signature', { status: 400 })
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
        console.error("FATAL: STRIPE_SECRET_KEY is missing");
        return new Response('Server Config Error: STRIPE_SECRET_KEY', { status: 500 })
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
        console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY is missing.");
        return new Response('Server Config Error: SERVICE_ROLE_KEY', { status: 500 })
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16', 
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
    if (!webhookSecret) {
        console.error("Missing STRIPE_WEBHOOK_SIGNING_SECRET");
        return new Response('Server Config Error: WEBHOOK_SECRET', { status: 500 })
    }

    let event
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log(`Received Event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.user_id

      console.log(`Processing checkout for User: ${userId} | Session: ${session.id}`);

      if (!userId) {
          console.error("No user_id in session metadata.");
          return new Response('Invalid Metadata: Missing user_id', { status: 200 }) 
      }
      
      // 1. Determine Credits
      let creditsToAdd = 0;
      if (session.metadata?.credits_to_add) {
          creditsToAdd = parseInt(session.metadata.credits_to_add);
      } else if (session.metadata?.plan_id) {
          const pid = session.metadata.plan_id;
          if (pid === 'individual') creditsToAdd = 20;
          if (pid === 'team') creditsToAdd = 50;
      } else {
          // Fallback based on amount
          if (session.amount_total === 299) creditsToAdd = 20;
          if (session.amount_total === 599) creditsToAdd = 50;
      }

      console.log(`Credits Calculation: Adding ${creditsToAdd} credits.`);

      // 1.5 Lookup Plan ID from DB to ensure FK constraint validity
      let dbPlanId = null; 
      const rawPlanId = session.metadata?.plan_id; // e.g. 'individual'

      if (rawPlanId) {
          console.log(`Resolving plan for input: '${rawPlanId}'...`);
          
          // Strategy 1: Check if 'rawPlanId' is literally the PK (id) in the DB.
          // This covers cases where the 'id' column is text and matches 'individual' exactly.
          let foundById = false;
          try {
             // We use .maybeSingle() to prevent error if not found.
             // If column is UUID and value is text, this MIGHT throw an error depending on Postgres strictness.
             const { data: directMatch, error: directError } = await supabaseAdmin
                .from('plans')
                .select('id')
                .eq('id', rawPlanId)
                .maybeSingle();
             
             if (!directError && directMatch) {
                 dbPlanId = directMatch.id;
                 foundById = true;
                 console.log(`Plan match found by ID: ${dbPlanId}`);
             } else if (directError) {
                 // Log but continue (could be uuid syntax error)
                 console.log("Direct ID lookup skipped/failed (likely type mismatch):", directError.message);
             }
          } catch (e) { 
             // Ignore exceptions
          }

          // Strategy 2: If not found by ID, look up by name or slug columns
          if (!foundById) {
              try {
                  const { data: slugMatch, error: slugError } = await supabaseAdmin
                      .from('plans')
                      .select('id')
                      .or(`name.eq.${rawPlanId},slug.eq.${rawPlanId}`)
                      .maybeSingle();
                  
                  if (!slugError && slugMatch) {
                      dbPlanId = slugMatch.id;
                      console.log(`Plan match found by Name/Slug: ${dbPlanId}`);
                  }
              } catch (e) {
                  console.warn("Plan lookup by slug failed:", e);
              }
          }
          
          if (!dbPlanId) {
              console.warn(`Could not resolve Plan ID for '${rawPlanId}'. Purchase will be recorded with plan_id=NULL.`);
          }
      }

      if (creditsToAdd > 0) {
        try {
            // --- STEP 1: Update Wallet (Profile Upsert) ---
            
            // A. Get current credits (safe fetch)
            const { data: profile, error: fetchError } = await supabaseAdmin
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .maybeSingle()

            if (fetchError) {
                 console.warn("Fetch profile warning:", fetchError.message);
            }

            const currentCredits = profile?.credits || 0
            const newCredits = currentCredits + creditsToAdd

            // B. Prepare Upsert Data
            const stripeCustomerId = typeof session.customer === 'string' 
                ? session.customer 
                : (session.customer as any)?.id;
            
            const userEmail = session.customer_details?.email || session.customer_email || '';
            const userName = session.customer_details?.name || '';

            const profileUpdates: any = { 
                id: userId,
                credits: newCredits,
                stripe_customer_id: stripeCustomerId,
            };
            
            if (userEmail) profileUpdates.email = userEmail;
            if (userName) profileUpdates.full_name = userName;

            console.log(`Upserting profile for ${userId}. New Credits: ${newCredits}`);

            const { error: upsertError } = await supabaseAdmin
                .from('profiles')
                .upsert(profileUpdates, { onConflict: 'id' })

            if (upsertError) {
                console.error("FATAL: Profile upsert failed:", upsertError);
                throw new Error(`Profile Upsert Failed: ${upsertError.message} (Code: ${upsertError.code})`);
            }
            
            console.log(`SUCCESS: User credits updated.`);

            // --- STEP 2: Log to Purchases Table ---
            
            const purchaseData = {
                user_id: userId,
                plan_id: dbPlanId, // Use the resolved DB ID (or null)
                stripe_session_id: session.id,
                amount_paid: session.amount_total, 
                credits_added: creditsToAdd
            };

            const { error: purchaseError } = await supabaseAdmin
                .from('purchases')
                .insert(purchaseData)
          
            if (purchaseError) {
                console.error("Purchase Insert Error:", purchaseError);
                
                // Retry without plan_id if FK violation
                if (purchaseData.plan_id !== null) { 
                     console.warn("Retrying purchase log with plan_id=NULL due to error...");
                     const { error: retryError } = await supabaseAdmin
                        .from('purchases')
                        .insert({ ...purchaseData, plan_id: null });
                     
                     if (retryError) {
                        console.error("FATAL: Retry failed too:", retryError);
                     } else {
                         console.log("Retry SUCCESS: Purchase recorded (plan_id was NULL).");
                     }
                }
            } else {
                console.log("Purchase recorded in audit log.");
            }

        } catch (err: any) {
          console.error('Database Operation Failed:', err)
          return new Response(`Database Error: ${err.message}`, { status: 500 })
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
     console.error("Unexpected Webhook Error:", err);
     return new Response(`Server Error: ${err.message}`, { status: 500 });
  }
})
