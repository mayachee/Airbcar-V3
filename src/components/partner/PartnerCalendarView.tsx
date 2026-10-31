import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PartnerVehicle, PartnerBooking } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerCalendarViewProps {
  vehicles: PartnerVehicle[];
  bookings: PartnerBooking[];
}

export const PartnerCalendarView: React.FC<PartnerCalendarViewProps> = ({
  vehicles,
}) => {
  const { isLight, t } = useAccountSettings();

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
              Fleet Schedule
            </span>
          </div>
          <h2 className={`font-serif-display text-2xl font-bold mt-1 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {t('calendar', 'Availability & Timeline')} (September 2026)
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
            Real-time reservations and blackout dates across your {vehicles.length} vehicles
          </p>
        </div>

        <div className={`flex items-center gap-2 p-1.5 rounded-full border transition-colors ${
          isLight ? 'bg-white border-neutral-200 shadow-xs' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <button 
            type="button" 
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isLight ? 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900' : 'hover:bg-[#251c16] text-[#8d7e73] hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-xs font-bold px-3 ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
            September 2026
          </span>
          <button 
            type="button" 
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isLight ? 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900' : 'hover:bg-[#251c16] text-[#8d7e73] hover:text-white'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fleet Calendar Matrix */}
      <div className={`rounded-3xl border p-6 overflow-x-auto shadow-xs transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
      }`}>
        <div className="min-w-[800px] space-y-3">
          {/* Days Header */}
          <div className={`grid grid-cols-12 gap-1 text-[11px] font-bold pb-2 border-b ${
            isLight ? 'text-neutral-500 border-neutral-100' : 'text-[#8d7e73] border-[#261d16]'
          }`}>
            <div className="col-span-3">Vehicle / Plate</div>
            <div className="col-span-9 grid grid-cols-7 gap-1 text-center">
              <span>Wed 2</span>
              <span className="text-[#f95721]">Thu 3 (Golf)</span>
              <span>Fri 4</span>
              <span className="text-amber-500">Sat 5 (Audi)</span>
              <span>Sun 6</span>
              <span>Mon 7</span>
              <span>Tue 8</span>
            </div>
          </div>

          {/* Vehicle Rows */}
          {vehicles.map((v) => (
            <div 
              key={v.id} 
              className={`grid grid-cols-12 gap-1 py-3 border-b items-center text-xs ${
                isLight ? 'border-neutral-100' : 'border-[#261d16]'
              }`}
            >
              <div className="col-span-3 flex items-center gap-2">
                <span className={`font-bold truncate ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                  {v.model}
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
                  {v.plate}
                </span>
              </div>

              <div className="col-span-9 grid grid-cols-7 gap-1 h-8">
                {v.id === 'veh-golf' ? (
                  <>
                    <div className={`rounded-md ${isLight ? 'bg-neutral-100' : 'bg-[#241b15]'}`} />
                    <div className="col-span-6 bg-[#f95721] text-white font-bold text-[10px] rounded-md flex items-center px-2 truncate shadow-xs">
                      Camille Dubois • Al Massira T1
                    </div>
                  </>
                ) : v.id === 'veh-audi' ? (
                  <>
                    <div className={`col-span-3 rounded-md ${isLight ? 'bg-neutral-100' : 'bg-[#241b15]'}`} />
                    <div className="col-span-4 bg-amber-500 text-white font-bold text-[10px] rounded-md flex items-center px-2 truncate shadow-xs">
                      Omar Benali • Sofitel Agadir
                    </div>
                  </>
                ) : v.id === 'veh-duster' ? (
                  <div className={`col-span-7 font-medium text-[10px] rounded-md flex items-center px-2 border ${
                    isLight 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-emerald-900/40 text-emerald-300 border-emerald-800/30'
                  }`}>
                    B2B Loan • Atlas Drive Agadir
                  </div>
                ) : (
                  <div className={`col-span-7 text-[10px] rounded-md flex items-center justify-center ${
                    isLight ? 'bg-neutral-100 text-neutral-500' : 'bg-[#241b15] text-[#8d7e73]'
                  }`}>
                    Available in Agadir Fleet Yard
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
