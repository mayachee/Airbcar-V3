import React from 'react';
import { 
  CheckCircle2, 
  Building, 
  Clock 
} from 'lucide-react';
import { PartnerEarnings, PartnerProfile } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerEarningsViewProps {
  earnings: PartnerEarnings;
  partnerProfile: PartnerProfile;
}

export const PartnerEarningsView: React.FC<PartnerEarningsViewProps> = ({
  earnings,
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
            Financials & Banking
          </span>
        </div>
        <h2 className={`font-serif-display text-2xl font-bold mt-1 tracking-tight ${
          isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
        }`}>
          {t('earningsPayouts', 'Earnings & Bank Payouts')}
        </h2>
        <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
          DRF Endpoint: <code className="text-[#f95721] text-[10px]">/partners/me/earnings/</code>
        </p>
      </div>

      {/* Next Payout Alert Banner matching Airbcar ops notification */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs transition-colors ${
        isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-[#1e1612] border-[#34251c] text-[#f5efe8]'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#f95721]/20 border border-[#f95721]/30 flex items-center justify-center text-[#f95721] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
              August Payout Cycle Notice
            </h4>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#9c8e82]'}`}>
              Cycle closes on <strong className={isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}>31 August</strong>. {formatPrice(41012.5)} will be wired directly to your {partnerProfile.bankAccount.bankName} account.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#f95721] bg-[#f95721]/15 px-3.5 py-1.5 rounded-full border border-[#f95721]/30">
          Payout Scheduled
        </span>
      </div>

      {/* 3 Main Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className={`rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            Gross August Bookings
          </span>
          <div className={`text-3xl font-bold mt-2 font-serif-display ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {formatPrice(earnings.currentMonthRevenueMAD)}
          </div>
          <p className={`text-xs mt-2 ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            Total rental charges across 8 vehicles
          </p>
        </div>

        <div className={`rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            Platform Fee (15%)
          </span>
          <div className="text-3xl font-bold text-[#8d7e73] mt-2 font-serif-display">
            -{formatPrice(earnings.airbcarFeeMAD)}
          </div>
          <p className={`text-xs mt-2 ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            Airbcar marketing, insurance & payment processing
          </p>
        </div>

        <div className={`rounded-3xl p-6 border shadow-xs relative overflow-hidden transition-colors ${
          isLight ? 'bg-white border-[#f95721]/40' : 'bg-[#1a130f] border-[#f95721]/30'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f95721]/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-xs font-bold text-[#f95721]">Net Payout to Mayache Cars</span>
          <div className={`text-3xl font-bold mt-2 font-serif-display ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {formatPrice(earnings.netPayoutMAD)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-500 mt-2 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Transfer queued for 31 Aug
          </div>
        </div>

      </div>

      {/* Bank Account Details & Transfer Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bank Account Snapshot (5 cols) */}
        <div className={`lg:col-span-5 rounded-3xl p-6 border space-y-4 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[#f95721] ${
              isLight ? 'bg-neutral-100' : 'bg-[#251c16]'
            }`}>
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-serif-display text-base font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Registered Moroccan Bank Account
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Automatic monthly wire transfer
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 text-xs transition-colors ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
          }`}>
            <div>
              <span className={`block text-[10px] uppercase font-bold ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
                Bank Name
              </span>
              <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                {partnerProfile.bankAccount.bankName}
              </span>
            </div>
            <div>
              <span className={`block text-[10px] uppercase font-bold ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
                Account Holder
              </span>
              <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                {partnerProfile.bankAccount.accountHolder}
              </span>
            </div>
            <div>
              <span className={`block text-[10px] uppercase font-bold ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
                RIB (24 digits)
              </span>
              <span className="font-mono text-[#f95721] font-bold text-xs">
                {partnerProfile.bankAccount.rib}
              </span>
            </div>
          </div>
        </div>

        {/* Previous Wire Payout History (7 cols) */}
        <div className={`lg:col-span-7 rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isLight ? 'border-neutral-100' : 'border-[#261d16]'
          }`}>
            <div>
              <h3 className={`font-serif-display text-base font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Payout History
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Recent completed settlements
              </p>
            </div>
          </div>

          <div className={`divide-y ${isLight ? 'divide-neutral-100' : 'divide-[#261d16]'}`}>
            {earnings.recentPayouts.map((payout) => (
              <div key={payout.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className={`font-bold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                    {payout.period}
                  </span>
                  <span className={`text-[11px] font-mono ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                    {payout.transferRef} • {payout.date}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                    {formatPrice(payout.amountMAD)}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold">✓ Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
