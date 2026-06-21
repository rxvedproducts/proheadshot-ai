
import React from 'react';
import { Check, Zap, Users } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
  onContactEnterpriseSales: () => void; // New prop for Enterprise Sales modal
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onContactEnterpriseSales }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16 max-w-3xl">
        <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-400 text-lg">
          Get professional studio quality headshots at a fraction of the cost. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Individual Plan */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" /> Individual
              </h3>
              <p className="text-slate-400 text-sm mt-1">Perfect for freelancers & job seekers</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">$2.99</span>
              <span className="text-slate-500 text-sm block">one-time</span>
            </div>
          </div>

          <div className="flex-grow space-y-4 mb-8">
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span><strong>20</strong> Professional Headshots</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>4K High-Resolution Downloads</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>3 Curated Styles</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>60-seconds Turnaround</span>
            </div>
          </div>

          <button 
            onClick={() => onSelectPlan('individual')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            Choose Individual
          </button>
        </div>

        {/* Team Plan */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
           <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
            BEST VALUE
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-600"></div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> Team
              </h3>
              <p className="text-slate-400 text-sm mt-1">For startups and small teams</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">$5.99</span>
              <span className="text-slate-500 text-sm block">one-time</span>
            </div>
          </div>

          <div className="flex-grow space-y-4 mb-8">
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span><strong>50</strong> Professional Headshots</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span>Everything in Individual</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span>All 6 Premium Styles</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span>Priority Processing (30 seconds)</span>
            </div>
          </div>

          <button 
             onClick={() => onSelectPlan('team')}
             className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600"
          >
            Choose Team
          </button>
        </div>

      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm">
            Need more than 50 photos? <button onClick={onContactEnterpriseSales} className="text-blue-400 hover:underline">Contact Enterprise Sales</button>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
