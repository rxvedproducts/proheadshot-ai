
export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  previewColor: string;
  thumbnail?: string;
  isCostume?: boolean;
  // Set only for styles that are gender-specific by concept (e.g. bridal wear).
  // Most costume styles are left unset since the AI adapts attire to the
  // detected gender automatically — see generate-headshot Edge Function.
  recommendedFor?: 'male' | 'female';
}

export interface GeneratedImage {
  id: string;
  original_image_path: string;
  generated_image_path: string;
  style_id: string;
  created_at: string;
  publicUrl?: string; // Helper for frontend display
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  credits: number;
}

export type AppStep = 'landing' | 'dashboard' | 'upload' | 'style' | 'processing' | 'gallery' | 'how-it-works' | 'pricing' | 'refund-policy' | 'terms' | 'privacy';
