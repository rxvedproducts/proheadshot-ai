
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SERVER-SIDE PRICING MAP (Security Fix)
// Only these Price IDs are accepted. Set via: supabase secrets set STRIPE_PRICE_INDIVIDUAL=price_xxx STRIPE_PRICE_TEAM=price_xxx
const PLANS: Record<string, string> = {
  'individual': Deno.env.get('STRIPE_PRICE_INDIVIDUAL') ?? '',
  'team': Deno.env.get('STRIPE_PRICE_TEAM') ?? ''
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
        return new Response(JSON.stringify({ error: 'Server misconfiguration: Stripe key missing' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const { planId, successUrl, cancelUrl } = await req.json()

    // VALIDATE PLAN SERVER-SIDE
    if (!planId || !PLANS[planId]) {
         return new Response(JSON.stringify({ error: 'Invalid or missing Plan ID' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const priceId = PLANS[planId];
    const creditsAmount = planId === 'individual' ? '20' : '50';

    // Get DB Customer ID
    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .maybeSingle();

    let customerId = profile?.stripe_customer_id;
    if (customerId && (!customerId.startsWith('cus_') || customerId.length < 5)) {
        customerId = null;
    }

    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Uses server-resolved price
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        price_id: priceId,
        credits_to_add: creditsAmount 
      },
    };

    if (customerId) {
        sessionConfig.customer = customerId;
        sessionConfig.customer_update = { address: 'auto' };
    } else {
        sessionConfig.customer_email = user.email;
        sessionConfig.customer_creation = 'always'; 
    }

    try {
        const session = await stripe.checkout.sessions.create(sessionConfig)
        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (stripeError: any) {
        console.warn("Stripe Error:", stripeError.message);
        
        // Retry logic for deleted customers
        const isCustomerError = 
            stripeError.code === 'resource_missing' || 
            (stripeError.message && stripeError.message.toLowerCase().includes('customer'));

        if (sessionConfig.customer && isCustomerError) {
            const retryConfig: any = {
                ...sessionConfig,
                customer: undefined,
                customer_update: undefined,
                customer_email: user.email,
                customer_creation: 'always'
            };
            delete retryConfig.customer;
            delete retryConfig.customer_update;

            try {
                const retrySession = await stripe.checkout.sessions.create(retryConfig);
                return new Response(JSON.stringify({ url: retrySession.url }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            } catch (retryError: any) {
                 return new Response(JSON.stringify({ error: `Stripe Retry Error: ${retryError.message}` }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }
        }

        return new Response(JSON.stringify({ error: `Stripe Error: ${stripeError.message}` }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

  } catch (error: any) {
    console.error("Create-Checkout Error:", error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
