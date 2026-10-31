import React from 'react';
import { FileText, CheckCircle2, ShieldCheck, Download, ArrowRight } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroSectionProps {
  activeTab: ActiveTab;
  isSigned: boolean;
  onOpenSignModal: () => void;
  onOpenPdfModal: () => void;
  openDisputesCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeTab,
  isSigned,
  onOpenSignModal,
  onOpenPdfModal,
  openDisputesCount = 0,
}) => {
  const isContractsPage = activeTab === 'contracts';

  return (
    <div className="w-full bg-[#181311] text-white pt-8 pb-14 px-4 sm:px-8 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start justify-between gap-8 lg:gap-12">
        {/* Left Column: Heading & Subtitle */}
        <div className="flex-1 max-w-2xl">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[#f95721] uppercase mb-3">
            YOUR ACCOUNT
          </div>

          {isContractsPage ? (
            <div>
              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Contracts, Camille.
                <br />
                <span className="text-[#f95721]">Signed, dated, yours.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-neutral-400 font-normal max-w-xl">
                Every agreement is between you and the agency. Airbcar just keeps the copy.
              </p>

              {/* Stats row for Contracts Page */}
              <div className="mt-8 flex items-center gap-10 sm:gap-14">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isSigned ? '0' : '1'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Awaiting signature</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isSigned ? '7' : '6'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Signed agreements</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {openDisputesCount}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Open disputes</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Salam, Camille.
                <br />
                Your Golf waits in <span className="text-[#f95721]">Agadir.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-neutral-400 font-normal max-w-xl">
                {isSigned 
                  ? 'All set for 3 September. Pickup at Agadir Terminal 1 arrivals.' 
                  : 'Six days out. One signature left. Everything else is handled.'}
              </p>

              {/* Stats blocks for Overview & Messages */}
              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                <div className="bg-[#241c19]/80 border border-white/5 rounded-xl p-3.5 sm:p-4">
                  <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    TRIPS TAKEN
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    7
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    since 2024
                  </div>
                </div>

                <div className="bg-[#241c19]/80 border border-white/5 rounded-xl p-3.5 sm:p-4">
                  <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    RENTER RATING
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    4.9
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    from 6 agencies
                  </div>
                </div>

                <div className="bg-[#241c19]/80 border border-white/5 rounded-xl p-3.5 sm:p-4">
                  <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    SAVED CARS
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    3
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    1 price dropped
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Agreement Callout Box */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="relative rounded-2xl border border-amber-600/35 bg-gradient-to-b from-[#251d1a] to-[#1f1715] p-5 sm:p-6 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#f95721]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-amber-300/80 uppercase">
                RENTAL AGREEMENT AC-2418
              </div>

              {isSigned ? (
                <div>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white">
                      Agreement signed
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                    Signed and confirmed with Mayache Cars. Your vehicle inspection protocol is ready in your documents.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={onOpenPdfModal}
                      className="inline-flex items-center gap-2 bg-[#f95721] hover:bg-[#e04816] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full transition-all shadow-md active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={onOpenPdfModal}
                      className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-all"
                    >
                      View certificate
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white mt-1">
                    Waiting on your signature
                  </h3>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                    {isContractsPage 
                      ? 'Sign before 30 Aug. Free cancellation until then.'
                      : 'Mayache Cars signed on 26 Aug. Sign before 1 Sep and your free cancellation stays intact.'}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={onOpenSignModal}
                      className="bg-[#f95721] hover:bg-[#e04816] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Review and sign</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={onOpenPdfModal}
                      className="border border-white/25 hover:border-white/40 hover:bg-white/5 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-all"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
