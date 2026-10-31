import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Globe2
} from 'lucide-react';
import { PartnerProfile } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerAnalyticsViewProps {
  partnerProfile: PartnerProfile;
}

export const PartnerAnalyticsView: React.FC<PartnerAnalyticsViewProps> = ({
  partnerProfile,
}) => {
  const { isLight, formatPrice, t } = useAccountSettings();

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
            Market Benchmarks & Insights
          </span>
        </div>
        <h2 className={`font-serif-display text-2xl font-bold mt-1 tracking-tight ${
          isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
        }`}>
          {t('analytics', 'Performance Analytics')}
        </h2>
        <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
          DRF Endpoint: <code className="text-[#f95721] text-[10px]">/partners/me/analytics/</code>
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Average Response Speed
            </span>
            <Clock className="w-4 h-4 text-[#f95721]" />
          </div>
          <div className="text-3xl font-bold text-[#f95721] mt-2 tracking-tight">
            {partnerProfile.replySpeedMinutes} min
          </div>
          <p className="text-xs text-emerald-500 mt-2 font-medium">
            {partnerProfile.replySpeedRank}
          </p>
        </div>

        <div className={`rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Fleet Occupancy Rate
            </span>
            <TrendingUp className="w-4 h-4 text-[#f95721]" />
          </div>
          <div className={`text-3xl font-bold mt-2 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            82%
          </div>
          <p className={`text-xs mt-2 ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            +18% above Souss-Massa regional average
          </p>
        </div>

        <div className={`rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Repeat Renter Ratio
            </span>
            <Users className="w-4 h-4 text-[#f95721]" />
          </div>
          <div className={`text-3xl font-bold mt-2 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            34%
          </div>
          <p className="text-xs text-emerald-500 mt-2 font-medium">
            Camille Dubois & 28 others returned
          </p>
        </div>
      </div>

      {/* Renter Geography Breakdown & Vehicle Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Renter Demographics */}
        <div className={`rounded-3xl p-6 border space-y-4 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isLight ? 'border-neutral-100' : 'border-[#261d16]'
          }`}>
            <h3 className={`font-serif-display text-base font-bold flex items-center gap-2 ${
              isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
            }`}>
              <Globe2 className="w-4 h-4 text-[#f95721]" />
              <span>Renter Origins (Summer 2026)</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
                <span>France (Paris, Lyon, Marseille)</span>
                <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>48%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-neutral-100' : 'bg-[#261d16]'}`}>
                <div className="h-full bg-[#f95721] rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
                <span>United Kingdom (London Gatwick/Stansted)</span>
                <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>22%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-neutral-100' : 'bg-[#261d16]'}`}>
                <div className="h-full bg-[#f95721]/80 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
                <span>Moroccan Diaspora & Domestic Tourism</span>
                <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>16%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-neutral-100' : 'bg-[#261d16]'}`}>
                <div className="h-full bg-[#f95721]/60 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>

            <div>
              <div className={`flex justify-between mb-1 ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
                <span>Germany & Switzerland</span>
                <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>14%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-neutral-100' : 'bg-[#261d16]'}`}>
                <div className="h-full bg-[#f95721]/40 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Vehicles */}
        <div className={`rounded-3xl p-6 border space-y-4 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isLight ? 'border-neutral-100' : 'border-[#261d16]'
          }`}>
            <h3 className={`font-serif-display text-base font-bold ${
              isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
            }`}>
              Top Revenue Vehicles
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
              isLight ? 'bg-neutral-50 border border-neutral-200' : 'bg-[#201813]'
            }`}>
              <div>
                <span className={`font-bold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                  Volkswagen Golf VII (2025)
                </span>
                <span className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                  Plate 4218-A-6 • 42 trips
                </span>
              </div>
              <span className="font-bold text-[#f95721]">{formatPrice(20580)}</span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
              isLight ? 'bg-neutral-50 border border-neutral-200' : 'bg-[#201813]'
            }`}>
              <div>
                <span className={`font-bold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                  Audi A6 40 TDI (2024)
                </span>
                <span className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                  Plate 9102-B-33 • 31 trips
                </span>
              </div>
              <span className="font-bold text-[#f95721]">{formatPrice(22320)}</span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
              isLight ? 'bg-neutral-50 border border-neutral-200' : 'bg-[#201813]'
            }`}>
              <div>
                <span className={`font-bold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                  Dacia Duster 4x4 (2024)
                </span>
                <span className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                  Plate 6543-A-6 • 65 trips
                </span>
              </div>
              <span className="font-bold text-[#f95721]">{formatPrice(24700)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
