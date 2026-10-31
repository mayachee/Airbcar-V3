import React from 'react';
import { Calendar, Clock, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';
import { ActiveTab } from '../types';

interface NextTripCardProps {
  onMessageAgency: () => void;
  onViewTripDetails: () => void;
  isSigned?: boolean;
}

export const NextTripCard: React.FC<NextTripCardProps> = ({
  onMessageAgency,
  onViewTripDetails,
  isSigned = false,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-2 relative z-20">
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-neutral-200/80 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Car Image with Badge */}
        <div className="relative w-full lg:w-[280px] h-[170px] sm:h-[185px] rounded-2xl overflow-hidden shrink-0 bg-neutral-100 group">
          <img
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
            alt="2025 Volkswagen Golf"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-neutral-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
            Starts in 6 days
          </div>
          {isSigned && (
            <div className="absolute bottom-3 left-3 bg-emerald-600/95 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
              Agreement signed
            </div>
          )}
        </div>

        {/* Center: Trip Information */}
        <div className="flex-1 w-full">
          <div className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            YOUR NEXT TRIP
          </div>
          <h2 className="text-2xl sm:text-[1.75rem] font-bold text-neutral-900 mt-1 tracking-tight">
            2025 Volkswagen Golf
          </h2>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 mt-1">
            <span>Mayache Cars</span>
            <span>·</span>
            <span>Agadir</span>
            <span>·</span>
            <span className="text-neutral-700 font-medium">delivered to Terminal 1</span>
          </div>

          {/* 3 Detail Badges */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-[#F5F2EB] rounded-xl p-3 border border-neutral-200/40">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                PICK-UP
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                Thu 3 Sep, 10:00
              </div>
            </div>

            <div className="bg-[#F5F2EB] rounded-xl p-3 border border-neutral-200/40">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                RETURN
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                Tue 8 Sep, 10:00
              </div>
            </div>

            <div className="bg-[#F5F2EB] rounded-xl p-3 border border-neutral-200/40">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                5 DAYS TOTAL
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                2,450 MAD
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="w-full lg:w-[220px] flex flex-col gap-2.5 shrink-0 items-stretch">
          <button
            onClick={onViewTripDetails}
            className="w-full bg-[#181311] hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium py-3 px-6 rounded-full transition-all text-center active:scale-98 shadow-sm"
          >
            Trip details
          </button>
          <button
            onClick={onMessageAgency}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs sm:text-sm font-medium py-3 px-6 rounded-full transition-all text-center flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
            <span>Message the agency</span>
          </button>
          <div className="text-center text-[11px] text-neutral-400">
            Free cancellation until 1 Sep
          </div>
        </div>

      </div>
    </div>
  );
};
