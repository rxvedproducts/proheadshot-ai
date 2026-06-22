import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const STYLES_SHOWCASE = [
  {
    label: 'Corporate Studio',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&auto=format',
    color: 'from-stone-900/60',
  },
  {
    label: 'Startup Founder',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&auto=format',
    color: 'from-stone-900/60',
  },
  {
    label: 'Creative Professional',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&auto=format',
    color: 'from-stone-900/60',
  },
  {
    label: 'Executive Luxury',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format',
    color: 'from-stone-900/60',
  },
];

interface SamplesProps {
  onStart?: () => void;
}

const Samples: React.FC<SamplesProps> = ({ onStart }) => {
  return (
    <div id="samples-section" className="py-20 px-4 bg-white border-t border-stone-200">
      <div className="container mx-auto max-w-6xl">

        <div className="text-center mb-14">
          <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3">Style Gallery</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            50+ Styles for Every Professional
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            From corporate boardrooms to creative studios — and unique Indian cultural styles found nowhere else.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STYLES_SHOWCASE.map(style => (
            <div
              key={style.label}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-stone-200 group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={style.img}
                alt={style.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${style.color} to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-white text-xs font-semibold">{style.label}</span>
              </div>
            </div>
          ))}
        </div>

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
            Browse All 50+ Styles
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Samples;
