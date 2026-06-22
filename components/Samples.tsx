import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const TRANSFORMATIONS = [
  {
    before: '/headshots/before-1.jpg',
    after: '/headshots/after-1.png',
    style: 'Startup Founder',
    description: 'Modern tech professional look with a warm, inviting workspace background',
    tag: 'bg-amber-100 text-amber-800',
  },
  {
    before: '/headshots/before-2.jpg',
    after: '/headshots/after-2.png',
    style: 'Outdoor Natural',
    description: 'Golden hour outdoor setting with a relaxed-yet-professional presence',
    tag: 'bg-green-100 text-green-800',
  },
  {
    before: '/headshots/before-3.jpg',
    after: '/headshots/after-3.png',
    style: 'Corporate Studio',
    description: 'Classic grey studio background with sharp, polished business attire',
    tag: 'bg-stone-100 text-stone-700',
  },
];

const TransformationCard: React.FC<{
  before: string;
  after: string;
  style: string;
  description: string;
  tagClass: string;
  index: number;
}> = ({ before, after, style, description, tagClass, index }) => {
  const [revealed, setRevealed] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          // Stagger reveal by index
          const delay = 400 + index * 350;
          setTimeout(() => {
            setRevealed(true);
            setHasPlayed(true);
          }, delay);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasPlayed, index]);

  return (
    <div ref={ref} className="flex flex-col group">
      {/* Style tag */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${tagClass}`}>
          {style}
        </span>
        <span className="text-xs text-stone-400">AI Generated</span>
      </div>

      {/* Comparison window */}
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-stone-200 shadow-sm group-hover:shadow-md transition-shadow duration-300 bg-stone-100">
        {/* Before */}
        <img
          src={before}
          alt={`Before — ${style}`}
          className="absolute inset-0 w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />

        {/* Before label */}
        <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-sm text-white/90 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Before
        </div>

        {/* After reveal */}
        <div
          className="absolute inset-0 transition-all ease-in-out duration-[1100ms]"
          style={{ clipPath: revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        >
          <img
            src={after}
            alt={`After — ${style}`}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          {/* After label */}
          <div className="absolute top-3 left-3 bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            After ✓
          </div>
        </div>

        {/* Moving divider */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)] z-20 pointer-events-none transition-all ease-in-out duration-[1100ms]"
          style={{ left: revealed ? '100%' : '0%' }}
        />
      </div>

      {/* Caption */}
      <p className="mt-3 text-xs text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
};

interface SamplesProps {
  onStart?: () => void;
}

const Samples: React.FC<SamplesProps> = ({ onStart }) => {
  return (
    <div id="samples-section" className="py-20 px-4 bg-white border-t border-stone-200">
      <div className="container mx-auto max-w-5xl">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3">Real Transformations</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            See What AI Can Do
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto text-lg">
            Upload a casual selfie. Get a studio-quality headshot — in 60 seconds.
          </p>
        </div>

        {/* 3-column transformation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {TRANSFORMATIONS.map((t, i) => (
            <TransformationCard
              key={t.style}
              before={t.before}
              after={t.after}
              style={t.style}
              description={t.description}
              tagClass={t.tag}
              index={i}
            />
          ))}
        </div>

        {/* Feature callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 flex gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Professional Attire, Automatically</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Upload a photo in a t-shirt — get a photo in a tailored blazer or business suit. Our AI handles wardrobe styling so you always look the part.
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 flex gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
              🇮🇳
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Exclusive Indian Styles</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                22 regional Indian costume styles, 16 Indian art forms, and 13 creative cultural styles — celebrate your heritage professionally.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-md shadow-amber-100 group"
          >
            Transform Your Photo Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Samples;
