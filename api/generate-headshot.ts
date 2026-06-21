import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { image, style, isCostume } = req.body as {
    image: string;
    style: string;
    isCostume: boolean;
  };
  if (!image || !style) {
    return res.status(400).json({ error: 'Missing required fields: image, style' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server misconfiguration: missing GEMINI_API_KEY' });

  const ai = new GoogleGenAI({ apiKey });

  let prompt = '';
  if (isCostume) {
    prompt = `
      TRANSFORMATION TASK: Apply a highly detailed regional Indian costume in the style: "${style}".
      1. DETECT GENDER: First, analyze the subject's gender and features.
      2. APPLY COSTUME: Dress the person in an authentic, high-quality version of the specified regional attire appropriate for their gender.
      3. IDENTITY PRESERVATION: Maintain the person's EXACT facial features, skin tone, and bone structure. They must remain perfectly recognizable.
      4. STUDIO QUALITY: Use cinematic studio lighting, sharp focus on the face, and a professional 85mm lens aesthetic.
      5. BACKGROUND: Place them in a relevant, slightly blurred professional setting matching the costume's vibe.
    `;
  } else {
    prompt = `
      TRANSFORMATION TASK: Convert this casual photo into a world-class professional business headshot.
      STYLE: ${style}

      CRITICAL CONSTRAINTS:
      1. IDENTITY: The person must be 100% recognizable. Do not change their facial geometry, eye color, or fundamental features.
      2. ATTIRE: Replace casual clothes with the specified professional attire (suit, blazer, or smart casual).
      3. LIGHTING: Use high-end "clamshell" or "butterfly" studio lighting to flatter the face and create a professional catchlight in the eyes.
      4. BACKGROUND: A clean, blurred corporate office or studio background.
      5. LENS: 85mm f/1.8 aesthetic with beautiful bokeh.
      6. OUTPUT: A single, centered, photorealistic 3:4 portrait.
    `;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: image } },
        { text: prompt },
      ],
    },
    config: { imageConfig: { aspectRatio: '3:4' } },
  });

  if (!response.candidates?.[0]?.content?.parts) {
    return res.status(500).json({ error: 'AI model returned an empty response. Please try a clearer photo.' });
  }

  let generatedImageBase64 = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      generatedImageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!generatedImageBase64) {
    const textError = response.candidates[0].content.parts.find(p => p.text)?.text;
    return res.status(422).json({ error: textError ?? 'AI could not generate an image. Please ensure the photo is a clear portrait.' });
  }

  return res.status(200).json({ image: generatedImageBase64 });
}
