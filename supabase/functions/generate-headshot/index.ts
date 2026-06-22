
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenAI } from 'https://esm.sh/@google/genai'

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // 2. Atomic server-side credit check and deduction (before generation)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.credits < 1) {
      return new Response(JSON.stringify({ error: 'Insufficient credits. Please purchase more to continue.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Optimistic lock: only succeeds if credits haven't changed since we read
    const { data: updated } = await adminClient
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id)
      .eq('credits', profile.credits)
      .select('id');

    if (!updated || updated.length === 0) {
      return new Response(JSON.stringify({ error: 'Insufficient credits. Please purchase more to continue.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. Parse Input
    const { image, style, isCostume } = await req.json();
    if (!image || !style) {
        return new Response(JSON.stringify({ error: 'Missing image or style' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // 3. Initialize Gemini
    const apiKey = Deno.env.get('API_KEY');
    
    if (!apiKey) {
         console.error("Critical Error: API_KEY secret is not set in Supabase Edge Functions.");
         return new Response(JSON.stringify({ error: 'Server configuration error: Service Unavailable.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean base64 string
    const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // SELECT PROMPT STRATEGY
    let prompt = "";
    
    if (isCostume) {
      // ADVANCED GENDER-AWARE WORKFLOW FOR COSTUMES
      prompt = `
        WORKFLOW: 
        1. Analyze the input image to detect the person's gender (male or female). 
        2. Based on the detected gender, apply an authentic Indian costume in the chosen style: ${style}.
        3. Ensure cultural accuracy and natural fit for the detected gender.
        4. Preserve the person's facial features, pose, and proportions perfectly while editing.
        5. The costume should match traditional or regional details appropriate for the gender. 
        6. Ensure the final image looks realistic, cohesive, and visually accurate, with no distortions or mismatches.
        7. Maintain EXACT IDENTITY: Facial structure, eyes, nose, and mouth must remain perfectly recognizable.
      `;
    } else {
      // STANDARD BUSINESS/ARTISTIC WORKFLOW
      prompt = `
        Task: Transform the subject in the provided photo based on these specific style instructions.
        
        Style Instructions: ${style}
        
        MANDATORY CONSTRAINTS:
        1. EXACT IDENTITY: Maintain the subject's facial structure, eyes, nose, and mouth perfectly. Do not change the person's identity or gender.
        2. PHOTOREALISM: Ensure the result looks like a real, high-resolution photograph (unless style is explicitly artistic).
        3. FOCUS: Use a professional camera lens aesthetic (e.g. 85mm f/1.8) for beautiful background bokeh.
        4. COMPOSITION: Center the subject in a head-and-shoulders portrait framing.
        5. QUALITY: Remove any distractions from the original background and replace with the specified style environment.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4'
        }
      }
    });

    // --- ENHANCED ERROR HANDLING ---
    const candidate = response.candidates?.[0];
    if (!candidate) {
       throw new Error("The AI model did not return a response. Please try again.");
    }

    let generatedImage = null;
    let textOutput = "";

    // Iterate parts to find image or refusal text
    if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                generatedImage = `data:${mimeType};base64,${part.inlineData.data}`;
                break; // Stop once we have an image
            } else if (part.text) {
                textOutput += part.text;
            }
        }
    }

    if (!generatedImage) {
        console.warn("Generation failed. Reason:", candidate.finishReason, "Text:", textOutput);
        
        if (candidate.finishReason === 'SAFETY') {
             throw new Error("This style or photo triggered our safety filters. Please try a different photo or style.");
        }
        
        if (textOutput && textOutput.length > 5) {
             throw new Error("The AI model was unable to process this request. Please ensure the photo is a clear portrait of one person.");
        }

        throw new Error("Could not generate your portrait. Please upload a clear, single-person photo.");
    }

    return new Response(JSON.stringify({ image: generatedImage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Generate Headshot Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
