import React from 'react';
import { Check, Zap, Users, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
  onContactEnterpriseSales: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onContactEnterpriseSales }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-stone-50 border-t border-stone-200" id="pricing-section">
      <div className="text-center mb-12 max-w-3xl">
        <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
        <h2 className="text-4xl font-bold text-stone-900 mb-4">One-Time Payment. Yours Forever.</h2>
        <p className="text-stone-500 text-lg">
          No subscriptions. No hidden fees. Pay once, download your headshots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

        {/* Individual Plan */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 flex flex-col relative overflow-hidden hover:border-stone-300 hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-stone-300" />
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Individual
              </h3>
              <p className="text-stone-500 text-sm mt-1">Perfect for freelancers &amp; job seekers</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-stone-900">$2.99</span>
              <span className="text-stone-400 text-sm block">one-time</span>
            </div>
          </div>

          <div className="flex-grow space-y-3 mb-8">
            {[
              '20 Professional Headshots',
              '4K High-Resolution Downloads',
              '6 Professional Styles',
              '60-second Turnaround',
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-stone-700">
                <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPlan('individual')}
            className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 font-bold rounded-xl transition-all"
          >
            Choose Individual
          </button>
        </div>

        {/* Team Plan — primary */}
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-md shadow-amber-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

          <div className="flex justify-center mb-5 mt-1">
            <span className="bg-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
              BEST VALUE
            </span>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" /> Team
              </h3>
              <p className="text-stone-500 text-sm mt-1">For startups &amp; small teams</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-stone-900">$5.99</span>
              <span className="text-stone-400 text-sm block">one-time</span>
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
              <div key={f} className="flex items-start gap-3 text-stone-700">
                <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPlan('team')}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-100 hover:scale-[1.02]"
          >
            Choose Team — Best Value
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-stone-500 text-sm">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Satisfaction guaranteed — if you're not happy, contact us within 7 days.</span>
        </div>
        <p className="text-stone-400 text-sm">
          Need more than 50 headshots?{' '}
          <button onClick={onContactEnterpriseSales} className="text-amber-700 hover:text-amber-800 hover:underline transition-colors font-medium">
            Contact Enterprise Sales
          </button>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
