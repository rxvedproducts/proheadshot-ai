
import React from 'react';
import { FileText, ShieldAlert, BadgeCheck, AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { SUPPORT_EMAIL } from '../constants';

interface RefundPolicyProps {
  onBack: () => void;
}

const RefundPolicy: React.FC<RefundPolicyProps> = ({ onBack }) => {
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
            <FileText className="w-3 h-3" />
            <span>Transparency First</span>
          </div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-3">Refund Policy</h1>
          <p className="text-stone-500 text-base max-w-xl mx-auto">Please read our policy regarding digital goods and services carefully.</p>
        </div>

        <div className="space-y-5">
          {/* Section 1 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">1. Strict No-Refund Policy on Digital Goods</h3>
                <p className="text-stone-600 leading-relaxed">
                  Due to the immediate and irrevocable nature of our service, all sales are final and non-refundable.
                  ProHeadshot AI provides a digital transformation service that incurs immediate server and AI computing costs
                  the moment you initiate the process.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl flex-shrink-0">
                <BadgeCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">2. Definition of "Successful Delivery"</h3>
                <p className="text-stone-600 leading-relaxed">
                  Our service is considered "Delivered" and "Fulfilled" the moment the generated images appear on your
                  screen with their respective download buttons.
                  <span className="block mt-2 font-medium text-stone-700">Note: We do NOT send images via email. There is no "Download Link" sent to your inbox. All downloads happen directly from your dashboard.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - The Exception */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">3. The Only Exception (Technical Failure)</h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  We will only issue a refund under one specific condition:
                </p>
                <div className="bg-white rounded-xl p-4 border border-amber-200 text-sm">
                  <span className="font-bold text-amber-700">Condition:</span> <span className="text-stone-700">Your payment was successfully charged (Status: 'Paid'), but a persistent technical error on our server prevented the credits from being added to your account or prevented the generation from finishing after multiple attempts.</span>
                </div>
                <p className="text-sm text-stone-500 mt-4">
                  To request a refund for a technical failure, you must email{' '}
                  {SUPPORT_EMAIL
                    ? <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-700 hover:text-amber-800 hover:underline font-bold">{SUPPORT_EMAIL}</a>
                    : <span className="text-amber-700 font-bold">our support team</span>
                  }{' '}
                  within 24 hours with your Order ID and account email.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-stone-100 rounded-xl flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">4. Style Dissatisfaction</h3>
                <p className="text-stone-600 leading-relaxed">
                  AI generation is an artistic process. By using this service, you acknowledge that the artistic style,
                  likeness, and interpretation are generated by Artificial Intelligence. We do not offer refunds if you
                  simply do not like the aesthetic style or artistic interpretation of the result.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-xl flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">5. Chargebacks</h3>
                <p className="text-stone-600 leading-relaxed">
                  Filing a fraudulent chargeback after receiving your digital goods is a violation of our Terms of Service.
                  We reserve the right to dispute any chargeback and may report fraudulent activity to relevant authorities.
                  Fraudulent chargebacks will result in permanent account suspension and loss of all generated assets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-stone-400 text-sm">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
