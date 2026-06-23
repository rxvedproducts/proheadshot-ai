import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Star, Globe } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewSamples: () => void;
}

interface Pair {
  before: string;
  after: string;
  style: string;
}

const INDIAN_STYLE_PAIRS: Pair[] = [
  { before: '/headshots/before-10.png', after: '/headshots/after-10.png', style: 'Outdoor Natural' },
  { before: '/headshots/before-11.png', after: '/headshots/after-11.png', style: 'Corporate Studio' },
  { before: '/headshots/before-12.png', after: '/headshots/after-12.png', style: 'Creative Professional' },
  { before: '/headshots/before-13.png', after: '/headshots/after-13.png', style: 'Modern Workspace' },
];

const INDIAN_COSTUME_PAIRS: Pair[] = [
  { before: '/headshots/before-10.png', after: '/indian-costume/after-10.png', style: 'Gujarati' },
  { before: '/headshots/before-11.png', after: '/indian-costume/after-11.png', style: 'Royal Maharaja' },
  { before: '/headshots/before-12.png', after: '/indian-costume/after-12.png', style: 'Maharashtrian' },
  { before: '/headshots/before-13.png', after: '/indian-costume/after-13.png', style: 'Telangana' },
];

interface MiniCarouselProps {
  pairs: Pair[];
  label: string;
  accentClass: string;
  cycleOffset?: number;
}

const MiniCarousel: React.FC<MiniCarouselProps> = ({ pairs, label, accentClass, cycleOffset = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Offset the initial reveal slightly so the two carousels don't animate in sync
    const revealTimer = setTimeout(() => setRevealed(true), 1000 + cycleOffset);

    const cycleTimer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setRevealed(false);
        setActiveIndex(prev => (prev + 1) % pairs.length);
        setIsTransitioning(false);
        setTimeout(() => setRevealed(true), 700);
      }, 350);
    }, 4000 + cycleOffset);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(cycleTimer);
    };
  }, [activeIndex, pairs.length, cycleOffset]);

  const pair = pairs[activeIndex];

  return (
    <div className="flex flex-col gap-2">
      {/* Section label */}
      <p className={`text-[10px] font-bold uppercase tracking-widest ${accentClass}`}>{label}</p>

      {/* Card */}
      <div
        className={`relative bg-white border border-stone-200 rounded-2xl p-2 shadow-xl transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Comparison window */}
        <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
          {/* Before — grayscale base */}
          <img
            src={pair.before}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-70"
            referrerPolicy="no-referrer"
          />

          {/* After — clip-path reveal */}
          <div
            className="absolute inset-0 transition-all ease-in-out duration-[900ms]"
            style={{ clipPath: revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          >
            <img
              src={pair.after}
              alt={pair.style}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            {/* Style pill — top right, appears with the after image */}
            <div className={`absolute top-2 right-2 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${accentClass.includes('orange') ? 'bg-orange-600' : 'bg-amber-600'}`}>
              {pair.style}
            </div>
          </div>

          {/* Moving divider */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.8)] z-20 pointer-events-none transition-all ease-in-out duration-[900ms]"
            style={{ left: revealed ? '100%' : '0%' }}
          />
        </div>

        {/* Dot pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {pairs.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === activeIndex) return;
                setIsTransitioning(true);
                setTimeout(() => {
                  setRevealed(false);
                  setActiveIndex(i);
                  setIsTransitioning(false);
                  setTimeout(() => setRevealed(true), 700);
                }, 300);
              }}
              className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 h-1.5 bg-amber-600' : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ onStart, onViewSamples }) => {
  return (
    <div className="relative overflow-hidden bg-stone-50 py-16 md:py-24 border-b border-stone-200">
      {/* Warm ambient blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] -right-[10%] h-[500px] w-[500px] rounded-full bg-orange-100/30 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8 items-center">

          {/* Left — copy, spans 2 of 4 columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
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

          {/* Right — Indian Style carousel (1 of 4 cols) */}
          <div className="lg:col-span-1">
            <MiniCarousel
              pairs={INDIAN_STYLE_PAIRS}
              label="Indian Style"
              accentClass="text-amber-700"
              cycleOffset={0}
            />
          </div>

          {/* Far right — Indian Costume carousel (1 of 4 cols) */}
          <div className="lg:col-span-1">
            <MiniCarousel
              pairs={INDIAN_COSTUME_PAIRS}
              label="Indian Costume"
              accentClass="text-orange-700"
              cycleOffset={600}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
