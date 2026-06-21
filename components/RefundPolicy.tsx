
import React from 'react';
import { FileText, ShieldAlert, BadgeCheck, AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { SUPPORT_EMAIL } from '../constants';

interface RefundPolicyProps {
  onBack: () => void;
}

const RefundPolicy: React.FC<RefundPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to previous page
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <FileText className="w-3 h-3" />
            <span>Transparency First</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Refund Policy</h1>
          <p className="text-slate-400 text-lg">Please read our policy regarding digital goods and services carefully.</p>
        </div>

        <div className="grid gap-8">
          {/* Section 1 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">1. Strict No-Refund Policy on Digital Goods</h3>
                <p className="text-slate-400 leading-relaxed">
                  Due to the immediate and irrevocable nature of our service, all sales are final and non-refundable. 
                  ProHeadshot AI provides a digital transformation service that incurs immediate server and GPU computing costs 
                  the moment you initiate the process.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-2xl">
                <BadgeCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">2. Definition of "Successful Delivery"</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our service is considered "Delivered" and "Fulfilled" the moment the generated images appear on your 
                  screen with their respective download buttons. 
                  <span className="block mt-2 font-medium text-slate-300">Note: We do NOT send images via email. There is no "Download Link" sent to your inbox. All downloads happen directly from your dashboard.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - The Exception */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">3. The Only Exception (Technical Failure)</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  We will only issue a refund under one specific condition:
                </p>
                <div className="bg-slate-950/50 rounded-xl p-4 border border-blue-500/20 text-sm">
                  <span className="font-bold text-blue-400">Condition:</span> Your payment was successfully charged (Status: 'Paid'), but a persistent technical error on our server prevented the credits from being added to your account or prevented the generation from finishing after multiple attempts.
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  To request a refund for a technical failure, you must email {SUPPORT_EMAIL ? <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-400 hover:underline font-bold">{SUPPORT_EMAIL}</a> : <span className="text-blue-400 font-bold">our support team</span>} within 24 hours with your Order ID and account email.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <HelpCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">4. Style Dissatisfaction</h3>
                <p className="text-slate-400 leading-relaxed">
                  AI generation is an artistic process. By using this service, you acknowledge that the artistic style, 
                  likeness, and interpretation are generated by Artificial Intelligence. We do not offer refunds if you 
                  simply do not like the aesthetic style or artistic interpretation of the result.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl">
                <ShieldAlert className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">5. Chargebacks</h3>
                <p className="text-slate-400 leading-relaxed">
                  Filing a fraudulent chargeback after receiving your digital goods is a violation of our Terms of Service. 
                  We reserve the right to dispute any chargeback and may report fraudulent activity to relevant authorities. 
                  Fraudulent chargebacks will result in permanent account suspension and loss of all generated assets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
