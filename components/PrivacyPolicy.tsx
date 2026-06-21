
import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Shield className="w-3 h-3" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-lg">Your privacy is our priority. We are transparent about what we collect and why.</p>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-400" /> 1. Information We Collect
            </h3>
            <p className="text-slate-400 leading-relaxed">
              We collect your email address for account authentication and service updates. We also collect the images you upload for the sole purpose of generating your headshots.
            </p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-400" /> 2. Data Usage
            </h3>
            <p className="text-slate-400 leading-relaxed">
              The images you upload are processed by our AI and stored temporarily to allow you to download them. We do not use your personal photos for AI training or share them with third parties.
            </p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-green-400" /> 3. Data Security
            </h3>
            <p className="text-slate-400 leading-relaxed">
              We use industry-standard encryption to protect your data during transfer and storage. Your account is secured via authenticated login (Google or Magic Link).
            </p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">4. Cookie Policy</h3>
            <p className="text-slate-400 leading-relaxed">
              We use cookies to maintain your session and improve site performance. You can manage your preferences through the banner on our homepage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
