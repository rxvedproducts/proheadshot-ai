import React from 'react';
import { Check, Zap, Users, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
  onContactEnterpriseSales: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onContactEnterpriseSales }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4" id="pricing-section">
      <div className="text-center mb-12 max-w-3xl">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
        <h2 className="text-4xl font-bold text-white mb-4">One-Time Payment. Yours Forever.</h2>
        <p className="text-slate-400 text-lg">
          No subscriptions. No hidden fees. Pay once, download your headshots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

        {/* Individual Plan */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col relative overflow-hidden hover:border-slate-700 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/50" />

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" /> Individual
              </h3>
              <p className="text-slate-400 text-sm mt-1">Perfect for freelancers &amp; job seekers</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">$2.99</span>
              <span className="text-slate-500 text-sm block">one-time</span>
            </div>
          </div>

          <div className="flex-grow space-y-3 mb-8">
            {[
              '20 Professional Headshots',
              '4K High-Resolution Downloads',
              '6 Professional Styles',
              '60-second Turnaround',
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPlan('individual')}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Choose Individual
          </button>
        </div>

        {/* Team Plan — primary */}
        <div className="bg-slate-900/50 border-2 border-blue-500/60 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> Team
              </h3>
              <p className="text-slate-400 text-sm mt-1">For startups &amp; small teams</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">$5.99</span>
              <span className="text-slate-500 text-sm block">one-time</span>
            </div>
          </div>

          <div className="flex-grow space-y-3 mb-8">
            {[
              '50 Professional Headshots',
              '4K High-Resolution Downloads',
              '30+ Premium Styles',
              'Indian Costume & Art Styles',
              'Priority Processing (30 sec)',
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPlan('team')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/30 hover:scale-[1.02]"
          >
            Choose Team — Best Value
          </button>
        </div>
      </div>

      {/* Guarantee & Enterprise */}
      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Satisfaction guaranteed — if you're not happy, contact us within 7 days.</span>
        </div>
        <p className="text-slate-500 text-sm">
          Need more than 50 headshots?{' '}
          <button onClick={onContactEnterpriseSales} className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Contact Enterprise Sales
          </button>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
