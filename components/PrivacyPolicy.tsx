
import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-10 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Shield className="w-3 h-3" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-3">Privacy Policy</h1>
          <p className="text-stone-500 text-base max-w-xl mx-auto">Your privacy is our priority. We are transparent about what we collect and why.</p>
        </div>

        <div className="space-y-5">
          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-600 flex-shrink-0" /> 1. Information We Collect
            </h3>
            <p className="text-stone-600 leading-relaxed">
              We collect your email address for account authentication and service updates. We also collect the images you upload for the sole purpose of generating your headshots.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <Database className="w-5 h-5 text-amber-600 flex-shrink-0" /> 2. Data Usage
            </h3>
            <p className="text-stone-600 leading-relaxed">
              The images you upload are processed by our AI and stored temporarily to allow you to download them. We do not use your personal photos for AI training or share them with third parties.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" /> 3. Data Security
            </h3>
            <p className="text-stone-600 leading-relaxed">
              We use industry-standard encryption to protect your data during transfer and storage. Your account is secured via authenticated login (Google or Magic Link).
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3">4. Cookie Policy</h3>
            <p className="text-stone-600 leading-relaxed">
              We use cookies to maintain your session and improve site performance. You can manage your preferences through the banner on our homepage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
