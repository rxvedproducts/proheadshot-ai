import React from 'react';
import { Upload, MousePointerClick, Sparkles, ArrowRight, Download } from 'lucide-react';

interface HowItWorksProps {
  onStart: () => void;
}

const steps = [
  {
    number: '01',
    icon: Upload,
    title: '1. Upload a Selfie',
    description: 'Take a quick photo or upload one from your gallery. No need for professional lighting—we handle that.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    topBar: 'bg-amber-500',
  },
  {
    number: '02',
    icon: MousePointerClick,
    title: '2. Pick a Style',
    description: 'Choose from our curated collection of styles: Corporate, Startup, Creative, Outdoor, Indian and more.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    topBar: 'bg-orange-500',
  },
  {
    number: '03',
    icon: Sparkles,
    title: '3. Get Results',
    description: 'Our AI engine reconstructs your photo into a studio-quality professional headshot in ~60 seconds.',
    color: 'text-stone-700',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    topBar: 'bg-stone-500',
  },
  {
    number: '04',
    icon: Download,
    title: '4. Download',
    description: 'Download your high-res headshots instantly. Ready for LinkedIn, resumes, and your website.',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    topBar: 'bg-green-500',
  },
];

const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border-t border-stone-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-14 max-w-3xl">
        <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
        <h2 className="text-4xl font-bold text-stone-900 mb-4">Professional Headshots in Minutes</h2>
        <p className="text-stone-500 text-lg">
          Stop spending hundreds on photographers. Our AI studio gives you premium quality business photos instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-16">
        {steps.map(step => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`${step.bg} ${step.border} border rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden group`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${step.topBar}`} />
              <div className={`w-14 h-14 ${step.bg} border-2 ${step.border} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className={`text-xs font-bold ${step.color} uppercase tracking-widest mb-2 opacity-60`}>{step.number}</div>
              <h3 className="text-lg font-bold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-stone-900 rounded-2xl p-8 md:p-12 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to upgrade your profile?</h3>
          <p className="text-stone-400">Join professionals using AI headshots.</p>
        </div>
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-700 px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:scale-105 group flex-shrink-0"
        >
          Create Headshot Now
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
