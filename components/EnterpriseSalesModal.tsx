
import React, { useState } from 'react';
import { X, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { APPS_SCRIPT_WEB_APP_URL } from '../constants';

interface EnterpriseSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass = "w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500";

const EnterpriseSalesModal: React.FC<EnterpriseSalesModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    estimatedHeadshots: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage(null);

    try {
      if (!APPS_SCRIPT_WEB_APP_URL) {
        throw new Error("Google Apps Script Web App URL is not configured. Please set VITE_APPS_SCRIPT_URL in your .env file.");
      }

      await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      setStatus('success');
      setFormData({ name: '', company: '', email: '', phone: '', estimatedHeadshots: '', message: '' });
    } catch (error: any) {
      console.error('Enterprise Sales Form submission error:', error);
      setErrorMessage(error.message || "Failed to submit inquiry. Please try again.");
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4">
            <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            >
            <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-8 max-h-[90vh] overflow-y-auto">
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Enterprise Sales Inquiry</h2>
            <p className="text-stone-500">Tell us about your team's needs, and we'll get back to you.</p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Inquiry Sent!</h3>
              <p className="text-stone-500 max-w-xs">We've received your message and will contact you shortly.</p>
              <button
                onClick={onClose}
                className="mt-8 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-stone-700">Your Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-stone-700">Company Name</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-stone-700">Work Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-stone-700">Phone (Optional)</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-123-4567" className={inputClass} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="estimatedHeadshots" className="text-sm font-medium text-stone-700">Estimated Headshots Needed</label>
                <select id="estimatedHeadshots" name="estimatedHeadshots" value={formData.estimatedHeadshots} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                  <option value="">Select an option</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-stone-700">Your Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your requirements..." rows={4} className={`${inputClass} resize-y`}></textarea>
              </div>

              {errorMessage && <p className="text-red-500 text-center text-sm">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-md shadow-amber-100"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSalesModal;
