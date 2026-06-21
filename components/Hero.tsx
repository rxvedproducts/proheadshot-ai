import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewSamples: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onViewSamples }) => {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-slate-950 text-center py-16">
      
      {/* Background Effects */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="absolute bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="mx-auto max-w-3xl space-y-4">

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Professional Headshots <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Without the Studio
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl">
            Upload a casual selfie and let our AI transform it into a high-quality professional business headshot in minutes. Perfect for LinkedIn, Teams, and Resumes.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center gap-4">
          <button
            onClick={onStart}
            className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto group"
          >
            Create Your Headshots
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button 
            onClick={onViewSamples}
            className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
          >
            View Samples
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 text-slate-400">
            <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-slate-900 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-500"/></div>
                <span className="text-sm">Photorealistic Quality</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-slate-900 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-500"/></div>
                <span className="text-sm">Done in 60 Seconds</span>
            </div>
            {/* Fix: Removed extraneous closing div tag */}
            <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-slate-900 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-500"/></div>
                <span className="text-sm">Privacy Focused</span>
            </div>
            {/* Added a placeholder for the 4th item to match grid-cols-4 if needed, or remove md:grid-cols-4 */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-slate-900 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-500"/></div>
              <span className="text-sm">Secure Data Handling</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;