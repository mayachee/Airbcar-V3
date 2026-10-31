import React, { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Percent, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Power, 
  Save, 
  Plus,
  Database,
  Server,
  Activity
} from 'lucide-react';
import { PlatformSettings } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface AdminSettingsViewProps {
  settings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const { isLight } = useAccountSettings();

  const [formSettings, setFormSettings] = useState<PlatformSettings>(settings);
  const [saveToast, setSaveToast] = useState(false);

  const handleToggleCity = (cityName: string) => {
    const updatedCities = formSettings.activeCities.map(c => 
      c.city === cityName ? { ...c, enabled: !c.enabled } : c
    );
    setFormSettings({ ...formSettings, activeCities: updatedCities });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            Configuration & Territorial Coverage
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Platform Parameters & City Hubs
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Control commission structures, dispute windows, safety rules, and enabled rental hubs across Morocco.
          </p>
        </div>

        {saveToast && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Platform settings saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Global Financial & Policy Parameters */}
        <div className={`p-6 rounded-3xl border space-y-6 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#f95721]" />
            <h2 className="font-serif-display text-base font-bold">
              Global Platform Parameters & Escrow Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            
            {/* Standard Commission Rate */}
            <div className="space-y-1.5">
              <label className="block font-semibold">Standard Agency Commission Rate (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={formSettings.platformCommissionPct}
                  onChange={(e) => setFormSettings({ ...formSettings, platformCommissionPct: Number(e.target.value) })}
                  className={`w-full rounded-xl border p-2.5 font-mono font-bold text-sm focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#221813] border-[#36271e]'
                  }`}
                />
                <span className="text-[#8d7e73] font-bold">%</span>
              </div>
              <p className="text-[10px] text-[#8d7e73]">
                Deducted automatically from gross trip fees prior to agency bank transfer.
              </p>
            </div>

            {/* Minimum Escrow Deposit */}
            <div className="space-y-1.5">
              <label className="block font-semibold">Minimum Security Deposit (MAD)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={formSettings.minimumDepositMAD}
                  onChange={(e) => setFormSettings({ ...formSettings, minimumDepositMAD: Number(e.target.value) })}
                  className={`w-full rounded-xl border p-2.5 font-mono font-bold text-sm focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#221813] border-[#36271e]'
                  }`}
                />
                <span className="text-[#8d7e73] font-bold">MAD</span>
              </div>
              <p className="text-[10px] text-[#8d7e73]">
                Floor security deposit held in Bank Al-Maghrib escrow for economy vehicles.
              </p>
            </div>

            {/* Minimum Renter Age */}
            <div className="space-y-1.5">
              <label className="block font-semibold">Minimum Renter Age Requirement</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={18}
                  max={30}
                  value={formSettings.minimumRenterAge}
                  onChange={(e) => setFormSettings({ ...formSettings, minimumRenterAge: Number(e.target.value) })}
                  className={`w-full rounded-xl border p-2.5 font-mono font-bold text-sm focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#221813] border-[#36271e]'
                  }`}
                />
                <span className="text-[#8d7e73] font-bold">Years</span>
              </div>
              <p className="text-[10px] text-[#8d7e73]">
                Standard age across Morocco; drivers under 25 may incur young driver surcharge.
              </p>
            </div>

            {/* Dispute Resolution Window */}
            <div className="space-y-1.5">
              <label className="block font-semibold">Dispute Claim Window (Hours)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={12}
                  max={120}
                  value={formSettings.disputeResolutionWindowHours}
                  onChange={(e) => setFormSettings({ ...formSettings, disputeResolutionWindowHours: Number(e.target.value) })}
                  className={`w-full rounded-xl border p-2.5 font-mono font-bold text-sm focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#221813] border-[#36271e]'
                  }`}
                />
                <span className="text-[#8d7e73] font-bold">Hours</span>
              </div>
              <p className="text-[10px] text-[#8d7e73]">
                Agencies have 48 hours to submit damage claims before deposit auto-releases.
              </p>
            </div>

            {/* Maintenance Mode */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block font-semibold">Platform Emergency Mode</label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-500/20">
                <div>
                  <span className="font-bold block">Maintenance Mode</span>
                  <span className="text-[10px] text-[#8d7e73]">Temporarily prevent new bookings while preserving active trips</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormSettings({ ...formSettings, maintenanceMode: !formSettings.maintenanceMode })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    formSettings.maintenanceMode
                      ? 'bg-rose-600 text-white'
                      : 'bg-neutral-500/20 text-[#8d7e73]'
                  }`}
                >
                  {formSettings.maintenanceMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Moroccan Cities & Territorial Coverage */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#f95721]" />
              <h2 className="font-serif-display text-base font-bold">
                Kingdom of Morocco • Active Regional Hubs ({formSettings.activeCities.filter(c => c.enabled).length} Enabled)
              </h2>
            </div>
            <span className="text-xs text-[#8d7e73]">
              Disable cities undergoing off-season or regulatory re-registration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formSettings.activeCities.map((c) => (
              <div
                key={c.city}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                  c.enabled 
                    ? isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
                    : isLight ? 'bg-neutral-100/60 border-neutral-200 opacity-60' : 'bg-[#18110e] border-[#261b14] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{c.city}</span>
                    <span className="text-[10px] text-[#8d7e73] font-mono">{c.region}</span>
                  </div>
                  <div className="text-[10px] text-[#8d7e73] mt-0.5">
                    {c.agenciesCount} Agencies • {c.vehiclesCount} Fleet cars
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCity(c.city)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    c.enabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-500/20 text-[#8d7e73]'
                  }`}
                >
                  {c.enabled ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Backend Infrastructure & Cloud Database */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h2 className="font-serif-display text-base font-bold">
                Backend Infrastructure &amp; Cloud Database
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Provisioned
              </span>
            </div>
          </div>

          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Live full-stack Express.js backend and Google Cloud Firestore database supporting Dahir 2026 contract verification, vehicle registries, and user sync.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#140e0c] border-[#2c2018]'}`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#f95721] mb-1">
                <Server className="w-3.5 h-3.5" />
                <span>Backend Platform</span>
              </div>
              <p className="text-sm font-bold">Express.js (Node.js)</p>
              <p className="text-[10px] text-[#8d7e73] mt-0.5 font-mono">Port 3000 • Host 0.0.0.0</p>
              <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded inline-block font-mono">
                GET /api/health
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#140e0c] border-[#2c2018]'}`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <Database className="w-3.5 h-3.5" />
                <span>Database Engine</span>
              </div>
              <p className="text-sm font-bold">Google Cloud Firestore</p>
              <p className="text-[10px] text-[#8d7e73] mt-0.5 font-mono truncate" title="prime-implement-mgmzr">
                Project: prime-implement-mgmzr
              </p>
              <div className="mt-2 text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded inline-block font-mono">
                GET /api/db/status
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#140e0c] border-[#2c2018]'}`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security &amp; Rules</span>
              </div>
              <p className="text-sm font-bold">Dahir 2026 Guard</p>
              <p className="text-[10px] text-[#8d7e73] mt-0.5 font-mono">
                firestore.rules Deployed
              </p>
              <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded inline-block font-mono">
                Collections: users, cars, bookings, contracts
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
