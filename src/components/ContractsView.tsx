import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  Download, ArrowRight, ExternalLink, MessageSquare, Calendar, UserPlus 
} from 'lucide-react';
import { ContractRecord, ActiveTab } from '../types';

interface ContractsViewProps {
  isSigned: boolean;
  onOpenSignModal: () => void;
  onOpenPdfModal: () => void;
  onOpenSecondDriverModal: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenDispute: () => void;
  closedContracts: ContractRecord[];
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  isSigned,
  onOpenSignModal,
  onOpenPdfModal,
  onOpenSecondDriverModal,
  onNavigateTab,
  onOpenDispute,
  closedContracts,
}) => {
  const [cancelModal, setCancelModal] = useState(false);
  const [changeDatesModal, setChangeDatesModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Left Column (col-span-8) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Active Contract Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-sm">
            
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                    AC-2418 · VW Golf
                  </h2>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                    isSigned
                      ? 'border-emerald-500/40 text-emerald-700 bg-emerald-50'
                      : 'border-[#f95721] text-[#f95721] bg-orange-50/50'
                  }`}>
                    {isSigned ? 'Signed & verified' : 'Awaiting signature'}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Mayache Cars · Agadir · issued 26 Aug 2026
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {!isSigned ? (
                  <button
                    onClick={onOpenSignModal}
                    className="bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
                  >
                    Review and sign
                  </button>
                ) : (
                  <button
                    onClick={onOpenPdfModal}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
                  >
                    View signed contract
                  </button>
                )}
                <button
                  onClick={onOpenPdfModal}
                  className="border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-medium px-4 py-2.5 rounded-full transition-all"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Content Body: Car image + Detailed Terms Grid */}
            <div className="py-6 flex flex-col md:flex-row gap-6 items-start">
              {/* Thumbnail */}
              <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
                  alt="2025 Volkswagen Golf"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Terms Breakdown Grid */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    PICK-UP
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Thu 3 Sep, 10:00
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Al Massira · Terminal 1
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    RENTAL TOTAL
                  </div>
                  <div className="font-bold text-[#f95721] text-sm mt-0.5">
                    2,450 MAD
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    6 days · 408 MAD/day
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    INSURANCE
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Third party + CDW
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Excess 4,000 MAD
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    FUEL POLICY
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Full to full
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Diesel
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    RETURN
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Tue 8 Sep, 10:00
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    DEPOSIT (HELD)
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    2,000 MAD
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    MILEAGE
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Unlimited
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    CANCELLATION
                  </div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Free until 30 Aug
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Document snippet + Action buttons */}
            <div className="pt-5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Document File Link */}
              <div 
                onClick={onOpenPdfModal}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-[#f95721] flex items-center justify-center font-bold text-[10px]">
                  PDF
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-[#f95721] transition-colors flex items-center gap-1.5">
                    <span>AC-2418 agreement.pdf</span>
                    <span className="text-[#f95721] text-[11px] font-semibold underline ml-1">Open</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    4 pages · FR / EN · 240 KB
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={onOpenSecondDriverModal}
                  className="bg-[#F5F2EB] hover:bg-neutral-200/70 text-neutral-800 font-medium px-4 py-2 rounded-full transition-colors"
                >
                  Add second driver
                </button>
                <button
                  onClick={() => setChangeDatesModal(true)}
                  className="bg-[#F5F2EB] hover:bg-neutral-200/70 text-neutral-800 font-medium px-4 py-2 rounded-full transition-colors"
                >
                  Change dates
                </button>
                <button
                  onClick={() => onNavigateTab('messages')}
                  className="bg-[#F5F2EB] hover:bg-neutral-200/70 text-neutral-800 font-medium px-4 py-2 rounded-full transition-colors"
                >
                  Message agency
                </button>
                <button
                  onClick={() => setCancelModal(true)}
                  className="border border-neutral-300 hover:bg-neutral-50 text-neutral-600 font-medium px-4 py-2 rounded-full transition-colors"
                >
                  Cancel booking
                </button>
              </div>
            </div>

          </div>

          {/* Section: Signed and closed */}
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
              Signed and closed
            </h2>

            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50/50">
                      <th className="py-4 px-5">CONTRACT</th>
                      <th className="py-4 px-5">VEHICLE & AGENCY</th>
                      <th className="py-4 px-5">DATES</th>
                      <th className="py-4 px-5">TOTAL</th>
                      <th className="py-4 px-5">DEPOSIT</th>
                      <th className="py-4 px-5 text-right">DOCUMENT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {closedContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-4 px-5 font-bold text-neutral-900">
                          {contract.id}
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-neutral-900">
                            {contract.vehicle}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {contract.agency} · {contract.city}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-neutral-600 font-medium">
                          {contract.dates}
                        </td>
                        <td className="py-4 px-5 font-bold text-neutral-900">
                          {contract.total.toLocaleString()} {contract.currency}
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-emerald-600 font-semibold">
                            {contract.depositStatus}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={onOpenPdfModal}
                            className="text-[#f95721] font-bold hover:underline"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Column (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. SIGNATURE STATUS (Dark Card) */}
          <div className="bg-[#1c1614] text-white rounded-3xl p-6 border border-white/10 shadow-lg">
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-5">
              SIGNATURE STATUS
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f95721] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Agency signed
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Youssef · 26 Aug, 14:18
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isSigned ? 'bg-emerald-500 text-white' : 'bg-[#f95721] text-white'
                }`}>
                  {isSigned ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {isSigned ? 'Your signature recorded' : 'Your signature'}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isSigned ? 'Completed today via biometric verification' : 'Due before 30 Aug, 23:59'}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isSigned ? 'bg-emerald-500 text-white' : 'bg-neutral-700 text-neutral-300'
                }`}>
                  {isSigned ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {isSigned ? 'Deposit secured on hold' : 'Deposit authorised'}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isSigned ? '2,000 MAD pre-authorized via Visa 4218' : 'On signature · 2,000 MAD'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 text-xs text-neutral-300 leading-relaxed">
              Signing is done in-app with your verified licence. Nothing is paid to the agency outside Airbcar.
            </div>

            <div className="mt-5">
              {!isSigned ? (
                <button
                  onClick={onOpenSignModal}
                  className="w-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs sm:text-sm font-semibold py-3 rounded-full transition-all shadow-md text-center active:scale-98"
                >
                  Review and sign
                </button>
              ) : (
                <button
                  onClick={onOpenPdfModal}
                  className="w-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium py-3 rounded-full transition-all text-center"
                >
                  Download signed certificate
                </button>
              )}
            </div>
          </div>

          {/* 2. DOCUMENTS ON FILE (White Card) */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4">
              DOCUMENTS ON FILE
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-neutral-900">Driving licence</span>
                <span className="text-[#f95721] font-semibold">Expires soon</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-neutral-900">Passport</span>
                <span className="text-emerald-600 font-semibold">Verified</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-neutral-900">Visa ending 4218</span>
                <span className="text-emerald-600 font-semibold">Active</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('documents')}
              className="mt-5 w-full bg-[#F5F2EB] hover:bg-neutral-200/70 text-neutral-800 text-xs font-semibold py-2.5 rounded-full transition-colors text-center"
            >
              Manage documents
            </button>
          </div>

          {/* 3. IF SOMETHING GOES WRONG (Warm Beige Card) */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-neutral-200/80 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
              IF SOMETHING GOES WRONG
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Your contract is with the agency, not with us. Airbcar can read the thread, hold the deposit and step in.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={onOpenDispute}
                className="flex-1 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-semibold py-2.5 px-3 rounded-full transition-all text-center"
              >
                Open a dispute
              </button>
              <button
                onClick={() => onNavigateTab('messages')}
                className="flex-1 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-semibold py-2.5 px-3 rounded-full transition-all text-center"
              >
                Get Airbcar help
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Cancel Booking Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 animate-scale-up">
            <h3 className="font-serif-display text-xl font-bold text-neutral-900">
              Cancel booking AC-2418?
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              You are eligible for 100% free cancellation until 30 August 2026. Any hold or pre-authorization on your card will be released instantly.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Keep booking
              </button>
              <button
                onClick={() => {
                  alert('Cancellation request submitted. You will receive an email confirmation.');
                  setCancelModal(false);
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm"
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Dates Modal */}
      {changeDatesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 animate-scale-up">
            <h3 className="font-serif-display text-xl font-bold text-neutral-900">
              Request date change
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Current dates: <strong>3 Sep 2026 – 8 Sep 2026</strong>. Change requests will be routed to Mayache Cars in Agadir for immediate approval.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">New Pick-up</label>
                <input type="date" defaultValue="2026-09-03" className="w-full bg-neutral-100 rounded-xl p-2 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">New Return</label>
                <input type="date" defaultValue="2026-09-09" className="w-full bg-neutral-100 rounded-xl p-2 text-xs" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setChangeDatesModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Back
              </button>
              <button
                onClick={() => {
                  alert('Change request transmitted to Mayache Cars via Messages.');
                  setChangeDatesModal(false);
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#181311] hover:bg-neutral-800 shadow-sm"
              >
                Submit request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
