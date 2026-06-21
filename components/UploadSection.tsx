
import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, ShieldAlert } from 'lucide-react';

interface UploadSectionProps {
  onImageSelected: (base64: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size too large. Please upload an image under 10MB.");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Invalid file type. Please upload an image (JPG, PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (preview && agreedToPolicy) {
      onImageSelected(preview);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    setAgreedToPolicy(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Upload your Selfie</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          For best results, use a photo with good lighting where your face is clearly visible. Avoid group photos or sunglasses.
        </p>
      </div>

      {!preview ? (
        <div 
          className="w-full max-w-md aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 transition-colors flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp"
            className="hidden" 
          />
          <div className="p-4 rounded-full bg-slate-800 group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all mb-4">
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
          </div>
          <p className="text-slate-300 font-medium">Click to upload</p>
          <p className="text-slate-500 text-sm mt-2">JPG or PNG up to 10MB</p>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4">
           <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
             <img src={preview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             <button 
                onClick={clearSelection}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600/80 text-white rounded-full backdrop-blur transition-colors"
             >
                <X className="w-5 h-5" />
             </button>
           </div>

           {/* Content Policy Checkbox */}
           <div 
             className={`flex items-start gap-3 p-4 bg-slate-900/50 border rounded-xl transition-all cursor-pointer group select-none ${agreedToPolicy ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}
             onClick={() => setAgreedToPolicy(!agreedToPolicy)}
           >
             <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${agreedToPolicy ? 'bg-blue-600 border-blue-600' : 'border-slate-700 group-hover:border-slate-600'}`}>
                {agreedToPolicy && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
             </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">
                  I agree to the Content Policy
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  No NSFW, hate speech, or gore. My image follows these guidelines.
                </p>
             </div>
           </div>
           
           <button
            onClick={handleConfirm}
            disabled={!agreedToPolicy}
            className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
              ${agreedToPolicy 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
           >
             {agreedToPolicy ? 'Look Good, Continue' : 'Please Agree to Policy'} &rarr;
           </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 text-red-400 border border-red-900/30 rounded-xl text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            {error}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
