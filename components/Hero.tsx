import React from 'react';
import { ArrowRight, Sparkles, Clock, Star, Globe } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewSamples: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onViewSamples }) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-16 md:py-24">
      {/* Background blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] -right-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-6">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 text-sm font-medium w-fit">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              AI Headshots That<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Mean Business
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
              Upload any selfie — get a studio-quality professional headshot in 60 seconds.
              <span className="text-white font-semibold"> Starting at just $2.99.</span> No photographer, no appointment, no studio.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Ready in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>50+ unique styles</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Indian styles included</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onStart}
                className="inline-flex h-13 items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-500 hover:scale-105 focus-visible:outline-none group"
              >
                Get Your Headshot — $2.99
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onViewSamples}
                className="inline-flex h-13 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-3.5 text-base font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                View Examples
              </button>
            </div>

            {/* Trust signals */}
            <p className="text-slate-600 text-xs">
              ✓ One-time payment &nbsp;·&nbsp; ✓ No subscription &nbsp;·&nbsp; ✓ Privacy protected &nbsp;·&nbsp; ✓ 4K downloads
            </p>
          </div>

          {/* Right — before/after visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Glow behind the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-2xl rounded-3xl" />

              <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl">
                <div className="flex gap-3">
                  {/* Before */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[3/4]">
                    <img
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=533&fit=crop&auto=format"
                      alt="Before — casual selfie"
                      className="w-full h-full object-cover opacity-70"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-white/80 uppercase tracking-widest">
                      Casual Selfie
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-blue-500 flex-shrink-0">
                    <ArrowRight className="w-6 h-6" />
                  </div>

                  {/* After */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[3/4] ring-2 ring-blue-500/60 shadow-[0_0_24px_rgba(59,130,246,0.25)]">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=533&fit=crop&auto=format"
                      alt="After — professional headshot"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-blue-300 uppercase tracking-widest">
                      AI Headshot ✓
                    </span>
                  </div>
                </div>

                {/* Style chips below the images */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Corporate Studio', 'Startup Founder', 'Creative Pro', 'Indian Bridal', 'Outdoor Natural'].map(style => (
                    <span key={style} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700">
                      {style}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-blue-950 text-blue-400 text-xs rounded-full border border-blue-800">
                    +45 more
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
