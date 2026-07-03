
import React from 'react';
import { ArrowLeft, Scale, ShieldCheck, UserCheck, Gavel, AlertCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
            <Scale className="w-3 h-3" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-3">Terms of Service</h1>
          <p className="text-stone-500 text-base">Last Updated: November 2025</p>
        </div>

        <div className="space-y-5">
          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" /> 1. Service Description
            </h3>
            <p className="text-stone-600 leading-relaxed">
              ProHeadshot AI uses Artificial Intelligence to transform user-uploaded photos into professional headshots. By using our service, you acknowledge that AI generation is experimental and results may vary.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" /> 2. Upload Requirements
            </h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              To use our service, your uploaded images must meet the following requirements:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>File Size: Maximum 10 MB per image.</li>
              <li>File Format: JPG or PNG only.</li>
              <li>Content: Must comply with our Content Policy.</li>
            </ul>
            <p className="text-stone-500 mt-4 text-sm italic">
              Images exceeding 10 MB will be rejected. Please resize your image before uploading.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <Gavel className="w-5 h-5 text-amber-600 flex-shrink-0" /> 3. Prohibited Content
            </h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              You agree NOT to upload images containing:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Nudity, sexual content, or gore.</li>
              <li>Images of children without parental consent.</li>
              <li>Hate speech or illegal symbols.</li>
              <li>Copyrighted material you do not own.</li>
            </ul>
            <p className="text-stone-600 mt-4">
              We reserve the right to ban users who violate this policy without refund.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0" /> 4. Ownership
            </h3>
            <p className="text-stone-600 leading-relaxed">
              You retain full commercial ownership of the images you generate. You own the art; we just provide the tool.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3">5. Limitation of Liability</h3>
            <p className="text-stone-600 leading-relaxed">
              ProHeadshot AI is provided "as-is" without warranty. We are not liable for any damages arising from the use of our service, including but not limited to loss of data or business interruption.
            </p>
          </section>

          <section className="bg-white border border-stone-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3">6. Changes to Terms</h3>
            <p className="text-stone-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
