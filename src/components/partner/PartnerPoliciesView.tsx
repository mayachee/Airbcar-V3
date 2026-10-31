import React from 'react';
import { Shield, Fuel, Gauge, Plane } from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';

export const PartnerPoliciesView: React.FC = () => {
  const { isLight, formatPrice, t } = useAccountSettings();

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
            Terms & Safeguards
          </span>
        </div>
        <h2 className={`font-serif-display text-2xl font-bold mt-1 tracking-tight ${
          isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
        }`}>
          {t('policies', 'Rental Policies & Safeguards')}
        </h2>
        <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
          These terms are automatically embedded into your Airbcar digital agreements and sent to renters before vehicle handover.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Policy 1: Security Deposit */}
        <div className={`rounded-3xl p-6 border space-y-3 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[#f95721] ${
              isLight ? 'bg-orange-50 border border-orange-200' : 'bg-[#281e18]'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-serif-display text-base font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Security Deposit Pre-authorization
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Tiered by car category</p>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
            Standard deposits are <strong className="text-[#f95721]">{formatPrice(2000)}</strong> for economy/compacts (Golf, Clio, Duster), <strong className="text-[#f95721]">{formatPrice(3500)}</strong> for executive (Audi A6), and <strong className="text-[#f95721]">{formatPrice(5000)}–{formatPrice(8000)}</strong> for sports & prestige (Mustang, AMG GT). Held via pre-auth and released upon return inspection.
          </p>
        </div>

        {/* Policy 2: Fuel */}
        <div className={`rounded-3xl p-6 border space-y-3 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-amber-500 ${
              isLight ? 'bg-amber-50 border border-amber-200' : 'bg-[#281e18]'
            }`}>
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-serif-display text-base font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Fuel Policy: Full-to-Full
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Fair & transparent</p>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
            Every vehicle is handed over with 8/8 full tank of premium fuel and must be returned with 8/8 full tank. Digital fuel level check is recorded during handover photo inspection.
          </p>
        </div>

        {/* Policy 3: Mileage */}
        <div className={`rounded-3xl p-6 border space-y-3 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-500 ${
              isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-[#281e18]'
            }`}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-serif-display text-base font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Mileage Allowance
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Unlimited in region</p>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
            Unlimited kilometers included for all rentals within Souss-Massa and Marrakech regions. Extended cross-country permits (Dakhla / Tanger) require prior notice.
          </p>
        </div>

        {/* Policy 4: Airport Handover */}
        <div className={`rounded-3xl p-6 border space-y-3 shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[#f95721] ${
              isLight ? 'bg-orange-50 border border-orange-200' : 'bg-[#281e18]'
            }`}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-serif-display text-base font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Airport Handover (Al Massira AGA)
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Terminal 1 arrivals</p>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
            Free delivery directly to Al Massira Terminal 1 arrivals parking for all rentals 3+ days. Mayache Cars representative tracks flight numbers in real-time.
          </p>
        </div>

      </div>
    </div>
  );
};
