
import React, { useRef, useState } from 'react';
import { UploadCloud, X, Check, ShieldAlert } from 'lucide-react';

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

    if (file.size > 10 * 1024 * 1024) {
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
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Upload your Selfie</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          For best results, use a photo with good lighting where your face is clearly visible. Avoid group photos or sunglasses.
        </p>
      </div>

      {!preview ? (
        <div
          className="w-full max-w-md aspect-[3/4] rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-amber-50/40 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
          <div className="p-4 rounded-full bg-stone-100 group-hover:bg-amber-100 transition-all mb-4">
            <UploadCloud className="w-8 h-8 text-stone-400 group-hover:text-amber-600" />
          </div>
          <p className="text-stone-600 font-medium group-hover:text-stone-900">Click to upload</p>
          <p className="text-stone-400 text-sm mt-2">JPG or PNG up to 10MB</p>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4">
           <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 shadow-lg">
             <img src={preview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             <button
                onClick={clearSelection}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-red-50 text-stone-700 hover:text-red-600 rounded-full backdrop-blur transition-colors border border-stone-200"
             >
                <X className="w-5 h-5" />
             </button>
           </div>

           {/* Content Policy Checkbox */}
           <div
             className={`flex items-start gap-3 p-4 bg-stone-50 border rounded-xl transition-all cursor-pointer group select-none ${agreedToPolicy ? 'border-amber-400 bg-amber-50/50' : 'border-stone-200 hover:border-stone-300'}`}
             onClick={() => setAgreedToPolicy(!agreedToPolicy)}
           >
             <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${agreedToPolicy ? 'bg-amber-600 border-amber-600' : 'border-stone-300 group-hover:border-stone-400'}`}>
                {agreedToPolicy && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
             </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-stone-800">
                  I agree to the Content Policy
                </p>
                <p className="text-xs text-stone-500 leading-tight">
                  No NSFW, hate speech, or gore. My image follows these guidelines.
                </p>
             </div>
           </div>

           <button
            onClick={handleConfirm}
            disabled={!agreedToPolicy}
            className={`w-full py-4 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2
              ${agreedToPolicy
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-100'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none border border-stone-200'
              }`}
           >
             {agreedToPolicy ? 'Looks Good, Continue' : 'Please Agree to Policy'} &rarr;
           </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            {error}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
