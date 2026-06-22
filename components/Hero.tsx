import React from 'react';
import { ArrowRight, Clock, Star, Globe } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewSamples: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onViewSamples }) => {
  return (
    <div className="relative overflow-hidden bg-stone-50 py-16 md:py-24 border-b border-stone-200">
      {/* Subtle warm blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/60 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] -right-[10%] h-[500px] w-[500px] rounded-full bg-orange-100/40 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight">
              AI Headshots That<br />
              <span className="text-amber-600">
                Mean Business
              </span>
            </h1>

            <p className="text-stone-600 text-lg md:text-xl leading-relaxed max-w-xl">
              Upload any selfie — get a studio-quality professional headshot in 60 seconds.
              <span className="text-stone-900 font-semibold"> Starting at just $2.99.</span> No photographer, no appointment, no studio.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-stone-700">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Ready in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Star className="w-4 h-4 text-amber-500" />
                <span>50+ unique styles</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>Indian styles included</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-amber-100 transition-all hover:bg-amber-700 hover:scale-105 focus-visible:outline-none group"
              >
                Get Your Headshot — $2.99
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onViewSamples}
                className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-8 py-3.5 text-base font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900"
              >
                View Examples
              </button>
            </div>

            {/* Trust signals */}
            <p className="text-stone-400 text-xs">
              ✓ One-time payment &nbsp;·&nbsp; ✓ No subscription &nbsp;·&nbsp; ✓ Privacy protected &nbsp;·&nbsp; ✓ 4K downloads
            </p>
          </div>

          {/* Right — before/after visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Soft shadow glow */}
              <div className="absolute inset-0 bg-amber-100/50 blur-3xl rounded-3xl" />

              <div className="relative bg-white border border-stone-200 rounded-3xl p-4 shadow-xl shadow-stone-200/60">
                <div className="flex gap-3">
                  {/* Before */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[3/4]">
                    <img
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=533&fit=crop&auto=format"
                      alt="Before — casual selfie"
                      className="w-full h-full object-cover opacity-60 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
                    <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-white/90 uppercase tracking-widest">
                      Casual Selfie
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-amber-600 flex-shrink-0">
                    <ArrowRight className="w-6 h-6" />
                  </div>

                  {/* After */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[3/4] ring-2 ring-amber-400/70 shadow-[0_0_24px_rgba(217,119,6,0.15)]">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=533&fit=crop&auto=format"
                      alt="After — professional headshot"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                    <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-amber-300 uppercase tracking-widest">
                      AI Headshot ✓
                    </span>
                  </div>
                </div>

                {/* Style chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Corporate Studio', 'Startup Founder', 'Creative Pro', 'Indian Bridal', 'Outdoor Natural'].map(style => (
                    <span key={style} className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full border border-stone-200">
                      {style}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
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
