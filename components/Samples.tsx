import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const STYLES_SHOWCASE = [
  {
    label: 'Corporate Studio',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&auto=format',
    color: 'from-blue-600/20 to-blue-900/20',
  },
  {
    label: 'Startup Founder',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&auto=format',
    color: 'from-purple-600/20 to-purple-900/20',
  },
  {
    label: 'Creative Professional',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&auto=format',
    color: 'from-green-600/20 to-green-900/20',
  },
  {
    label: 'Executive Luxury',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format',
    color: 'from-amber-600/20 to-amber-900/20',
  },
];

interface SamplesProps {
  onStart?: () => void;
}

const Samples: React.FC<SamplesProps> = ({ onStart }) => {
  return (
    <div id="samples-section" className="py-20 px-4 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Style Gallery</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            50+ Styles for Every Professional
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From corporate boardrooms to creative studios — and unique Indian cultural styles found nowhere else.
          </p>
        </div>

        {/* Style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STYLES_SHOWCASE.map(style => (
            <div
              key={style.label}
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] border border-slate-800 group cursor-pointer bg-gradient-to-b ${style.color}`}
            >
              <img
                src={style.img}
                alt={style.label}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-white text-xs font-semibold">{style.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* What makes it different */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <div className="w-10 h-10 bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Professional Attire, Automatically</h3>
            <p className="text-slate-400 leading-relaxed">
              Upload a photo in a t-shirt — get a photo in a tailored blazer or business suit. Our AI handles wardrobe styling so you always look the part.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <div className="w-10 h-10 bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">🇮🇳</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Exclusive Indian Styles</h3>
            <p className="text-slate-400 leading-relaxed">
              The only AI headshot service with 22 regional Indian costume styles, 16 Indian art forms, and 13 creative cultural styles. Celebrate your heritage professionally.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 cursor-pointer shadow-lg shadow-blue-900/30 group"
            onClick={onStart}
          >
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            Browse All 50+ Styles
          </div>
        </div>

      </div>
    </div>
  );
};

export default Samples;
