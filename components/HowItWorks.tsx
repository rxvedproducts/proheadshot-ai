import React from 'react';
import { Upload, MousePointerClick, Sparkles, ArrowRight, Download } from 'lucide-react';

interface HowItWorksProps {
  onStart: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16 max-w-3xl">
        <h2 className="text-4xl font-bold text-white mb-6">Professional Headshots in Minutes</h2>
        <p className="text-slate-400 text-lg">
          Stop spending hundreds on photographers. Our AI studio gives you premium quality business photos instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full mb-16">
        {/* Step 1 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-900 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-50"></div>
            <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">1. Upload a Selfie</h3>
            <p className="text-slate-400 leading-relaxed">
                Take a quick photo or upload one from your gallery. No need for professional lighting—we handle that.
            </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-900 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-purple-600 opacity-50"></div>
            <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">2. Pick a Style</h3>
            <p className="text-slate-400 leading-relaxed">
                Choose from our curated collection of styles: Corporate, Startup, Creative, Outdoor, and more.
            </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-900 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-600 opacity-50"></div>
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">3. Get Results</h3>
            <p className="text-slate-400 leading-relaxed">
                Our photography engine reconstructs your photo into a 8K professional headshot in ~60 seconds.
            </p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-900 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-orange-600 opacity-50"></div>
            <div className="w-16 h-16 bg-orange-900/30 rounded-full flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
                <Download className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">4. Download</h3>
            <p className="text-slate-400 leading-relaxed">
                Download your high-res headshots instantly. Ready for LinkedIn, resumes, and your website.
            </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 md:p-12 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to upgrade your profile?</h3>
              <p className="text-slate-400">Join thousands of professionals using AI headshots.</p>
          </div>
          <button
            onClick={onStart}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-slate-950 shadow transition-all hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 hover:scale-105"
          >
            Create Headshot Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
      </div>
    </div>
  );
};

export default HowItWorks;