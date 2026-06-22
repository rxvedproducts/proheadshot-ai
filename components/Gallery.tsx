import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface GalleryProps {
  imageUrl: string;
  onRestart: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ imageUrl, onRestart }) => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `proheadshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Your New Headshot</h2>
        <p className="text-stone-500">Professional, crisp, and ready for LinkedIn.</p>
      </div>

      <div className="relative group w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-2 ring-stone-200 bg-stone-100 mb-8">
        <img src={imageUrl} alt="Generated Headshot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
             <button
                onClick={handleDownload}
                className="bg-white text-stone-900 font-bold py-2 px-6 rounded-full flex items-center gap-2 hover:bg-amber-50 transition-colors shadow-md"
             >
                <Download className="w-4 h-4" /> Download High-Res
             </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
        >
            <RefreshCw className="w-4 h-4" />
            Generate Another
        </button>
        <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-md shadow-amber-100"
        >
            <Download className="w-4 h-4" />
            Download Image
        </button>
      </div>

      <div className="mt-8 p-4 bg-stone-50 rounded-lg max-w-lg text-center border border-stone-200">
          <p className="text-xs text-stone-400">
              Disclaimer: AI-generated images may sometimes exhibit artifacts. For critical professional use, review the image closely.
              This app does not store your biometric data.
          </p>
      </div>
    </div>
  );
};

export default Gallery;
