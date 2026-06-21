
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const SAMPLE_PAIRS = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop", // Casual male
    after: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop", // Professional male
    label: "Corporate Executive"
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop", // Casual female
    after: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop", // Professional female
    label: "Tech Leader"
  }
];

const Samples: React.FC = () => {
  return (
    <div id="samples-section" className="py-20 px-4 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stunning Results, Every Time
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            See how our AI transforms everyday selfies into studio-grade professional headshots while preserving your unique identity.
          </p>
        </div>

        <div className="grid gap-12 md:gap-16">
          {SAMPLE_PAIRS.map((pair, index) => (
            <div 
              key={pair.id} 
              className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Images Container */}
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
                {/* Before */}
                <div className="relative flex-1 w-full aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 shadow-lg group">
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-xs font-bold text-white px-3 py-1 rounded-full z-10">
                     ORIGINAL
                   </div>
                   <img src={pair.before} alt="Original Selfie" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>

                {/* Arrow Icon for mobile/desktop */}
                <div className="flex-shrink-0 text-slate-600">
                  <ArrowRight className="w-6 h-6 rotate-90 sm:rotate-0" />
                </div>

                {/* After */}
                <div className="relative flex-1 w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] group">
                   <div className="absolute top-4 left-4 bg-blue-600 text-xs font-bold text-white px-3 py-1 rounded-full z-10 flex items-center gap-1">
                     <Check className="w-3 h-3" /> GENERATED
                   </div>
                   <img src={pair.after} alt="Generated Headshot" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-blue-400 text-sm font-medium mb-2">
                  {pair.label}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {index === 0 && "Perfect Lighting & Composition"}
                  {index === 1 && "Professional Attire, Automatically"}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {index === 0 && "Our AI corrects lighting imbalances and shadows, giving you that crisp, soft-box studio look without the expensive equipment."}
                  {index === 1 && "Upload a photo in a t-shirt, get a photo in a tailored blazer. We handle the wardrobe styling so you look the part."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Samples;