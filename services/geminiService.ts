
import { GoogleGenAI } from "@google/genai";

/**
 * Compresses and resizes an image to ensure it fits within payload limits.
 */
const compressImage = (base64Str: string, maxWidth = 768, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.crossOrigin = "anonymous"; 
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
      }
      
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Remove data URL prefix for processing
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = (err) => {
      console.error("Compression Image Load Error:", err);
      reject(new Error("Failed to load image for compression"));
    };
  });
};

/**
 * Generates a professional headshot using Gemini 2.5 Flash Image.
 */
export const generateHeadshot = async (
  base64Image: string,
  stylePrompt: string,
  isCostume: boolean = false,
  onStageChange?: (stage: string) => void
): Promise<string> => {
  try {
    onStageChange?.("Optimizing your photo...");
    const rawBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const compressedBase64 = await compressImage(`data:image/jpeg;base64,${rawBase64}`);

    onStageChange?.("AI is crafting your portrait...");
    
    // Initialize AI right before use as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a highly detailed prompt for the best headshot results
    let prompt = "";
    if (isCostume) {
      prompt = `
        TRANSFORMATION TASK: Apply a highly detailed regional Indian costume in the style: "${stylePrompt}".
        1. DETECT GENDER: First, analyze the subject's gender and features.
        2. APPLY COSTUME: Dress the person in an authentic, high-quality version of the specified regional attire appropriate for their gender.
        3. IDENTITY PRESERVATION: Maintain the person's EXACT facial features, skin tone, and bone structure. They must remain perfectly recognizable.
        4. STUDIO QUALITY: Use cinematic studio lighting, sharp focus on the face, and a professional 85mm lens aesthetic.
        5. BACKGROUND: Place them in a relevant, slightly blurred professional setting matching the costume's vibe.
      `;
    } else {
      prompt = `
        TRANSFORMATION TASK: Convert this casual photo into a world-class professional business headshot.
        STYLE: ${stylePrompt}
        
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
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: compressedBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("The AI model returned an empty response. Please try a clearer photo.");
    }

    // Extract the image from parts
    let generatedImageBase64 = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!generatedImageBase64) {
      // Check if there's text output explaining why it failed (e.g. safety filters)
      const textError = response.candidates[0].content.parts.find(p => p.text)?.text;
      if (textError) {
        throw new Error(`AI Notice: ${textError}`);
      }
      throw new Error("The AI model was unable to generate an image. Please ensure the photo is a clear portrait.");
    }

    onStageChange?.("Finalizing your headshot...");
    return generatedImageBase64;

  } catch (error: any) {
    console.error("generateHeadshot direct SDK failed:", error);
    throw error;
  }
};
