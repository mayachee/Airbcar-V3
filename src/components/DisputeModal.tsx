import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDispute: (disputeTitle: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  onSubmitDispute,
}) => {
  const [category, setCategory] = useState('deposit');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitDispute(`Dispute on ${category}: ${description.slice(0, 30)}...`);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-scale-up">
        
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#f95721]" />
            <h3 className="font-serif-display text-xl font-bold text-neutral-900">
              Airbcar Trust & Dispute
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-serif-display text-lg font-bold text-neutral-900">
              Case opened & Escrow locked
            </h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Airbcar mediation has frozen deposit release for AC-2418. A case officer will review chat logs and contact you within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Airbcar holds security deposits in neutral escrow. If you experience an issue with vehicle condition or agency conduct, open a case here.
            </p>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                ISSUE CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F5F2EB] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#f95721]"
              >
                <option value="deposit">Deposit deduction contention</option>
                <option value="pickup">Pick-up delay / Airport delivery issue</option>
                <option value="condition">Vehicle condition differs from photos</option>
                <option value="communication">Unresponsive rental agency</option>
                <option value="other">Other billing or cancellation inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                DETAILS & EXPLANATION
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what happened and any agreement details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F5F2EB] border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#f95721]"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#181311] hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2 rounded-full transition-all shadow-sm"
              >
                Open case
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
