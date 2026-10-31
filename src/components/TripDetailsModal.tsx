import React from 'react';
import { X, MapPin, Calendar, ShieldCheck, Car, Phone, FileText } from 'lucide-react';

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPdfModal: () => void;
  onMessageAgency: () => void;
  isSigned: boolean;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  isOpen,
  onClose,
  onOpenPdfModal,
  onMessageAgency,
  isSigned,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-scale-up">
        
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <div className="text-[10px] font-bold text-[#f95721] tracking-widest uppercase">
              BOOKING DETAILS
            </div>
            <h3 className="font-serif-display text-xl font-bold text-neutral-900 mt-0.5">
              2025 Volkswagen Golf
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-neutral-700">
          <div className="w-full h-44 rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
              alt="2025 Volkswagen Golf"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-200/70">
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase">Agency</div>
              <div className="font-bold text-neutral-900">Mayache Cars · Agadir</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase">Status</div>
              <div className={`font-bold ${isSigned ? 'text-emerald-600' : 'text-[#f95721]'}`}>
                {isSigned ? 'Contract Signed' : 'Awaiting Signature'}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase">Pick-up</div>
              <div className="font-semibold text-neutral-800">Thu 3 Sep, 10:00 (Terminal 1)</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase">Return</div>
              <div className="font-semibold text-neutral-800">Tue 8 Sep, 10:00 (Terminal 1)</div>
            </div>
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-3">
            <div className="flex justify-between">
              <span className="text-neutral-500">Duration</span>
              <span className="font-semibold text-neutral-900">6 days (5 nights)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Rate</span>
              <span className="font-semibold text-neutral-900">408.33 MAD / day</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-100">
              <span>Total Amount</span>
              <span className="text-[#f95721] text-sm">2,450 MAD</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Deposit (Held)</span>
              <span>2,000 MAD</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenPdfModal();
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-800 border border-neutral-200 hover:bg-neutral-50"
          >
            Agreement PDF
          </button>
          <button
            onClick={() => {
              onClose();
              onMessageAgency();
            }}
            className="bg-[#181311] hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-sm"
          >
            Message Mayache Cars
          </button>
        </div>

      </div>
    </div>
  );
};
