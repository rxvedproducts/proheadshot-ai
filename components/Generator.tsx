
import React, { useEffect, useState, useRef } from 'react';
import { HeadshotStyle, User } from '../types';
import { compressImage } from '../services/geminiService';
import { uploadImage, saveGeneratedImage, deductCredit, getPublicUrl, supabase } from '../services/supabaseService';
import { Loader2, AlertCircle, RefreshCcw, Coins, Sparkles, Wand2 } from 'lucide-react';

interface GeneratorProps {
  uploadedImage: string;
  selectedStyle: HeadshotStyle;
  onComplete: (imageUrl: string) => void;
  onBack: () => void;
  user: User | null;
  onBuyCredits: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ uploadedImage, selectedStyle, onComplete, onBack, user, onBuyCredits }) => {
  const [status, setStatus] = useState<'init' | 'processing' | 'saving' | 'error'>('init');
  const [stage, setStage] = useState('Initializing studio...');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const hasFetchedRef = useRef(false);

  const tips = [
    "Great headshots are about the eyes. Our AI is precisely matching your facial geometry.",
    "Applying professional color grading for that high-end studio look.",
    "Replacing your background with a professional corporate setting.",
    "Enhancing skin texture while preserving natural details.",
    "Adjusting studio lighting to create flattering highlights and shadows."
  ];
  
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    let patienceTimeout: ReturnType<typeof setTimeout>;

    const startGeneration = async () => {
      if (hasFetchedRef.current) return;
      
      // Credit Check
      if (user && user.credits < 1) {
          setStatus('error');
          setErrorMessage("You have 0 credits remaining. Please buy more credits to generate headshots.");
          return;
      }

      hasFetchedRef.current = true;
      setStatus('processing');
      
      try {
        // Initial Progress simulation (crawls to 90%)
        let currentProg = 0;
        progressInterval = setInterval(() => {
            if (currentProg < 85) {
               const diff = 85 - currentProg;
               currentProg += Math.max(0.05, diff * 0.03);
               setProgress(currentProg);
            }
        }, 150);

        // 1. Compress image client-side, then generate via server-side API
        setStage("Optimizing your photo...");
        const rawBase64 = uploadedImage.includes(',') ? uploadedImage.split(',')[1] : uploadedImage;
        const compressedBase64 = await compressImage(`data:image/jpeg;base64,${rawBase64}`);

        setStage("AI is crafting your portrait...");
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) throw new Error('Not authenticated. Please sign in and try again.');

        const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
        const apiRes = await fetch(`${supabaseUrl}/functions/v1/generate-headshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            image: compressedBase64,
            style: selectedStyle.promptModifier,
            isCostume: !!selectedStyle.isCostume,
          }),
        });
        if (!apiRes.ok) {
          let errMsg = `Generation failed (HTTP ${apiRes.status})`;
          try { const body = await apiRes.json(); errMsg = body.error || errMsg; } catch {}
          throw new Error(errMsg);
        }
        const { image: generatedBase64 } = await apiRes.json();
        setStage("Finalizing your headshot...");
        
        clearInterval(progressInterval);
        setProgress(90);

        // 2. Save to Database
        if (user) {
            setStatus('saving');
            setStage("Saving your new headshot...");
            
            // Note: If Supabase isn't configured, these will fail gracefully or show errors
            try {
              const originalPath = await uploadImage(user.id, uploadedImage, 'originals');
              setProgress(93);
              
              const generatedPath = await uploadImage(user.id, generatedBase64, 'generated');
              setProgress(96);
              
              await saveGeneratedImage(user.id, originalPath, generatedPath, selectedStyle.id);
              await deductCredit(user.id, user.credits);
              
              const publicUrl = getPublicUrl(generatedPath);
              setProgress(100);
              setTimeout(() => onComplete(publicUrl), 500);
            } catch (storageError) {
              console.warn("Storage/DB failed, showing result directly:", storageError);
              setProgress(100);
              setTimeout(() => onComplete(generatedBase64), 500);
            }
        } else {
            setProgress(100);
            setTimeout(() => onComplete(generatedBase64), 500);
        }

      } catch (err: any) {
        clearInterval(progressInterval);
        console.error("Generation Error:", err);
        setStatus('error');
        setErrorMessage(err.message || "Something went wrong. Please try a different photo.");
      }
    };

    startGeneration();

    return () => {
        if (progressInterval) clearInterval(progressInterval);
        if (patienceTimeout) clearTimeout(patienceTimeout);
    };
  }, [uploadedImage, selectedStyle, user]);

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md text-center shadow-2xl">
           <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
             <AlertCircle className="w-8 h-8 text-red-500" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
           <p className="text-slate-400 mb-6 text-sm leading-relaxed">{errorMessage}</p>
           <div className="flex flex-col gap-3">
             <button 
               onClick={() => window.location.reload()} 
               className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold shadow-lg"
             >
               <RefreshCcw className="w-4 h-4" /> Try Again
             </button>
             <button onClick={onBack} className="px-6 py-2 text-slate-400 hover:text-white transition-colors text-sm">
                Go Back
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-700">
      <div className="w-full max-w-lg space-y-10">
        
        {/* Advanced Scanning Animation */}
        <div className="relative mx-auto w-64 h-80 rounded-[2rem] overflow-hidden border-8 border-slate-900 shadow-2xl bg-slate-950">
            <img src={uploadedImage} className="w-full h-full object-cover opacity-30 grayscale blur-[1px]" alt="Original" referrerPolicy="no-referrer" />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            {/* The Scanning Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-20 animate-scan" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-blue-500/5">
                 <div className="relative">
                    <Wand2 className="w-16 h-16 text-blue-500 animate-pulse" />
                    <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-blue-400 animate-bounce" />
                 </div>
                 <div className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">
                    Analyzing Features
                 </div>
            </div>
        </div>

        <div className="text-center space-y-8">
            <div className="space-y-3">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    {stage}
                </h2>
                <p className="text-blue-400 font-medium flex items-center justify-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                   Style: {selectedStyle.name}
                </p>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-4 max-w-sm mx-auto">
                <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-4 p-1 shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                    <span>Rendering Canvas</span>
                    <span className="text-blue-500">{Math.round(progress)}%</span>
                </div>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 backdrop-blur-sm max-w-md mx-auto relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                <p className="text-sm text-slate-300 leading-relaxed italic transition-all duration-1000">
                    "{tips[currentTip]}"
                </p>
                <div className="mt-4 flex gap-1 justify-center">
                  {tips.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentTip ? 'w-4 bg-blue-500' : 'w-1 bg-slate-800'}`} />
                  ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
