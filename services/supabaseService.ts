
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Memory Storage fallback to handle sandboxed/restricted iframe environments
const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage getItem restricted, using memory store fallback:", e);
    }
    return memoryStorage[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn("localStorage setItem restricted, using memory store fallback:", e);
    }
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn("localStorage removeItem restricted, using memory store fallback:", e);
    }
    delete memoryStorage[key];
  }
};

// Initialize Supabase client directly with fallback custom storage
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// --- HELPER FUNCTIONS ---

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; isPaused: boolean }> => {
  try {
    // Attempt a light query to test if database is online
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.warn("Supabase connection check error:", error);
      // Check if error code or message suggests the project is paused/restoring
      const isPaused = error.message?.includes('paused') || error.message?.includes('503') || error.code === 'PGRST116' === false && (error.code?.startsWith('PGRST') === false);
      return { 
        success: false, 
        message: `Database responded with error: ${error.message} (Code: ${error.code})`,
        isPaused: isPaused || !!error.message?.includes('fetch')
      };
    }
    return { success: true, message: "Connected to Supabase successfully!", isPaused: false };
  } catch (err: any) {
    console.error("Supabase connection check failed entirely:", err);
    return { 
      success: false, 
      message: `Failed to communicate with Supabase: ${err.message || err}`,
      isPaused: true 
    };
  }
};

export const getUserProfile = async (userId: string) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    // If error is code 'PGRST116', it means no rows found (new user)
    if (error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return null;
  }
  return data;
};

// Ensure a profile exists for the user. If not, create one.
export const ensureUserProfileExists = async (user: any) => {
  if (!user || !user.id) return null;

  try {
    // Try to fetch first
    let existingProfile = await getUserProfile(user.id);
    
    if (!existingProfile) {
      // If not found, try to insert
      // Note: If you have a Database Trigger (handle_new_user), it might have already created this.
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            email: user.email, 
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            credits: 3 // Default free credits set to 3
          }
        ])
        .select()
        .single();

      if (error) {
        // If insert fails, it might have been created by a trigger or race condition, try fetching one last time
        console.warn("Insert profile failed (might already exist), retrying fetch...", error.message);
        const retryData = await getUserProfile(user.id);
        if (retryData) return retryData;
        
        // Return a fallback profile so auth doesn't fail
        return { 
          id: user.id, 
          email: user.email, 
          full_name: user.user_metadata?.full_name || 'User',
          credits: 3 // Fallback credit count
        };
      }
      return data;
    }
    
    return existingProfile;
  } catch (e) {
    console.error("ensureUserProfileExists crashed:", e);
    // Return a fallback object to allow login to proceed
    return { 
      id: user.id, 
      email: user.email, 
      full_name: user.user_metadata?.full_name || 'User',
      credits: 3 // Fallback credit count
    };
  }
};

export const uploadImage = async (userId: string, dataUrl: string, folder: 'originals' | 'generated') => {
  try {
    // Use fetch to convert Data URI to Blob efficiently (avoids main thread freeze)
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    // Extract extension from blob type or default to png
    const ext = blob.type.split('/')[1] || 'png';
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${userId}/${folder}/${timestamp}-${randomString}.${ext}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, blob, {
        contentType: blob.type,
        upsert: false
      });

    if (error) {
        console.error("Supabase Storage Upload Error:", error);
        throw error;
    }
    
    return data.path;
  } catch (err) {
      console.error("uploadImage failed:", err);
      throw err;
  }
};

export const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
};

export const saveGeneratedImage = async (
  userId: string, 
  originalPath: string, 
  generatedPath: string, 
  styleId: string
) => {
  const { data, error } = await supabase
    .from('generated_images')
    .insert([
      { 
        user_id: userId, 
        original_image_path: originalPath, 
        generated_image_path: generatedPath,
        style_id: styleId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deductCredit = async (userId: string, currentCredits: number) => {
  if (currentCredits <= 0) throw new Error("Insufficient credits");

  const { error } = await supabase
    .from('profiles')
    .update({ credits: currentCredits - 1 })
    .eq('id', userId);

  if (error) throw error;
  return currentCredits - 1;
};

export const fetchUserHistory = async (userId: string) => {
  // Added limit(50) to optimize performance
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  // Map paths to full URLs
  return (data || []).map(img => ({
    ...img,
    publicUrl: getPublicUrl(img.generated_image_path)
  }));
};

/**
 * Deletes a generated headshot from DB first, then attempts to clean up Storage.
 * Uses count: 'exact' to verify deletion success without needing SELECT permissions.
 */
export const deleteHeadshot = async (userId: string, recordId: string, generatedPath: string, originalPath?: string) => {
  console.log(`Attempting delete for record: ${recordId}`);

  // 1. Delete from DB
  const { error, count } = await supabase
    .from('generated_images')
    .delete({ count: 'exact' })
    .eq('id', recordId);

  if (error) {
    console.error("DB Delete Error:", error);
    throw new Error("Database error: " + error.message);
  }

  // If count is 0, the row wasn't deleted. It either doesn't exist, or RLS hid it.
  if (count === 0) {
      // Check if it exists at all to give a better error message to the dev console
      const { count: existsCount } = await supabase
        .from('generated_images')
        .select('*', { count: 'exact', head: true })
        .eq('id', recordId);

      if (existsCount && existsCount > 0) {
          // Log the solution for the developer
          console.error("RLS PERMISSION DENIED: You need a DELETE policy on 'generated_images'.");
          console.warn("Run this SQL: create policy \"Users can delete their own images\" on generated_images for delete using ( auth.uid() = user_id );");
          
          throw new Error("Permission denied. Unable to delete image.");
      } else {
          // It doesn't exist -> Treat as success (already deleted)
          console.log("Record not found, assuming already deleted.");
      }
  }

  // 2. Storage Cleanup (Best Effort)
  try {
      const paths = [generatedPath];
      if (originalPath) paths.push(originalPath);
      await supabase.storage.from('images').remove(paths);
  } catch (err) {
      console.warn("Storage cleanup warning:", err);
  }

  return true;
};
