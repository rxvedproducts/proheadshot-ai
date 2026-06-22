import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Star, Globe } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewSamples: () => void;
}

const PAIRS = [
  {
    before: '/headshots/before-1.jpg',
    after: '/headshots/after-1.png',
    style: 'Startup Founder',
  },
  {
    before: '/headshots/before-2.jpg',
    after: '/headshots/after-2.png',
    style: 'Outdoor Natural',
  },
  {
    before: '/headshots/before-3.jpg',
    after: '/headshots/after-3.png',
    style: 'Corporate Studio',
  },
];

const Hero: React.FC<HeroProps> = ({ onStart, onViewSamples }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Reveal after → after 1.2s
    const revealTimer = setTimeout(() => setRevealed(true), 1200);

    // Cycle to next pair after 4s
    const cycleTimer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setRevealed(false);
        setActiveIndex(prev => (prev + 1) % PAIRS.length);
        setIsTransitioning(false);
        // Re-reveal after a short pause
        setTimeout(() => setRevealed(true), 800);
      }, 400);
    }, 4500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(cycleTimer);
    };
  }, [activeIndex]);

  const goTo = (idx: number) => {
    if (idx === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setRevealed(false);
      setActiveIndex(idx);
      setIsTransitioning(false);
      setTimeout(() => setRevealed(true), 800);
    }, 300);
  };

  const pair = PAIRS[activeIndex];

  return (
    <div className="relative overflow-hidden bg-stone-50 py-16 md:py-24 border-b border-stone-200">
      {/* Warm ambient blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] -right-[10%] h-[500px] w-[500px] rounded-full bg-orange-100/30 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight">
              AI Headshots That<br />
              <span className="text-amber-600">Mean Business</span>
            </h1>

            <p className="text-stone-600 text-lg md:text-xl leading-relaxed max-w-xl">
              Upload any selfie — get a studio-quality professional headshot in 60 seconds.
              <span className="text-stone-900 font-semibold"> Starting at just $2.99.</span> No photographer, no appointment.
            </p>

            {/* Stats */}
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
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-amber-100 transition-all hover:bg-amber-700 hover:scale-105 group"
              >
                Get Your Headshot — $2.99
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onViewSamples}
                className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-8 py-3.5 text-base font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                See Transformations
              </button>
            </div>

            <p className="text-stone-400 text-xs">
              ✓ One-time payment &nbsp;·&nbsp; ✓ No subscription &nbsp;·&nbsp; ✓ Privacy protected &nbsp;·&nbsp; ✓ 4K downloads
            </p>
          </div>

          {/* Right — animated before/after */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Glow */}
              <div className="absolute inset-0 bg-amber-100/60 blur-3xl rounded-3xl" />

              {/* Card */}
              <div
                className={`relative bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl shadow-stone-200/80 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
              >
                {/* Comparison window */}
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                  {/* Before — always visible underneath */}
                  <img
                    src={pair.before}
                    alt="Before selfie"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-70"
                    referrerPolicy="no-referrer"
                  />

                  {/* After — animates in via clip-path */}
                  <div
                    className="absolute inset-0 transition-all ease-in-out duration-[900ms]"
                    style={{ clipPath: revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                  >
                    <img
                      src={pair.after}
                      alt="After — professional headshot"
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Divider line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20 transition-all ease-in-out duration-[900ms] pointer-events-none"
                    style={{ left: revealed ? '100%' : '0%' }}
                  />

                  {/* Bottom gradient + style badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end justify-between">
                    <span
                      className={`text-white text-xs font-semibold tracking-wide transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}
                    >
                      {pair.style}
                    </span>
                  </div>
                </div>

                {/* Dot pagination */}
                <div className="flex items-center justify-center gap-2 mt-3 pb-1">
                  {PAIRS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 h-2 bg-amber-600' : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'}`}
                    />
                  ))}
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
