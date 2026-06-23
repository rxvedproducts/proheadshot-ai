import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

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

interface CarouselProps {
  pairs: Pair[];
  pillClass: string;
  cycleOffset?: number;
}

const Carousel: React.FC<CarouselProps> = ({ pairs, pillClass, cycleOffset = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), 1000 + cycleOffset);

    const cycleTimer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setRevealed(false);
        setActiveIndex(prev => (prev + 1) % pairs.length);
        setIsTransitioning(false);
        setTimeout(() => setRevealed(true), 700);
      }, 350);
    }, 4500 + cycleOffset);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(cycleTimer);
    };
  }, [activeIndex, pairs.length, cycleOffset]);

  const goTo = (idx: number) => {
    if (idx === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setRevealed(false);
      setActiveIndex(idx);
      setIsTransitioning(false);
      setTimeout(() => setRevealed(true), 700);
    }, 300);
  };

  const pair = pairs[activeIndex];

  return (
    <div className={`relative bg-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
        {/* Before — grayscale base */}
        <img
          src={pair.before}
          alt="Before selfie"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
          referrerPolicy="no-referrer"
        />

        {/* Selfie pill — fades out as after reveals */}
        <div className={`absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest transition-opacity duration-700 ${revealed ? 'opacity-0' : 'opacity-100'}`}>
          Selfie
        </div>

        {/* After — clip-path wipe */}
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
          {/* Style pill — top right */}
          <div className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${pillClass}`}>
            {pair.style}
          </div>
        </div>

        {/* Moving divider */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.7)] z-20 pointer-events-none transition-all ease-in-out duration-[900ms]"
          style={{ left: revealed ? '100%' : '0%' }}
        />
      </div>

      {/* Dot pagination */}
      <div className="flex items-center justify-center gap-2 mt-3 pb-1">
        {pairs.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

interface IndianShowcaseProps {
  onStart: () => void;
}

const IndianShowcase: React.FC<IndianShowcaseProps> = ({ onStart }) => {
  return (
    <div className="py-20 px-4 bg-stone-900 border-t border-stone-800">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Real Transformations</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See It in Action
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto text-lg">
            Same selfie — completely different look. Watch the AI reveal unfold.
          </p>
        </div>

        {/* Two carousels side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Indian Professional</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <Carousel pairs={INDIAN_STYLE_PAIRS} pillClass="bg-amber-600" cycleOffset={0} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Indian Costume</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <Carousel pairs={INDIAN_COSTUME_PAIRS} pillClass="bg-orange-600" cycleOffset={700} />
          </div>

        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-900/30 group"
          >
            Try It Yourself — $2.99
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default IndianShowcase;
