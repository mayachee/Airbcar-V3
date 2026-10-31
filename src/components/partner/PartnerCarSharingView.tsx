import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Camera, 
  Gauge, 
  Fuel, 
  Building2,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { B2BCarShare } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerCarSharingViewProps {
  carShares: B2BCarShare[];
}

export const PartnerCarSharingView: React.FC<PartnerCarSharingViewProps> = ({
  carShares: initialShares,
}) => {
  const { isLight, formatPrice, t } = useAccountSettings();
  const [carShares, setCarShares] = useState<B2BCarShare[]>(initialShares);
  const [selectedShare, setSelectedShare] = useState<B2BCarShare | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [odometer, setOdometer] = useState('34210');
  const [fuelLevel, setFuelLevel] = useState('8/8 Full');
  const [inspectionNotes, setInspectionNotes] = useState('Front bumper clear, no scratch, tyres checked.');

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShare) return;

    const newInsp = {
      id: `insp-${Date.now()}`,
      type: 'pickup' as const,
      odometerKm: parseInt(odometer, 10) || 34210,
      fuelLevel,
      photosCount: 4,
      notes: inspectionNotes,
      date: 'Today',
      inspectorName: 'Youssef (Mayache Cars)',
    };

    setCarShares(prev => prev.map(s => {
      if (s.id === selectedShare.id) {
        return {
          ...s,
          inspections: [newInsp, ...s.inspections],
        };
      }
      return s;
    }));

    setShowInspectionModal(false);
  };

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
              B2B Fleet Sharing Network
            </span>
          </div>
          <h2 className={`font-serif-display text-2xl font-bold mt-1 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {t('carSharing', 'Inter-Agency Car Loaning')}
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
            DRF Endpoints: <code className="text-[#f95721] text-[10px]">/partners/car-shares/</code> and <code className="text-[#f95721] text-[10px]">/partners/car-shares/&lt;id&gt;/inspections/</code>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            alert('Requesting B2B vehicle loan from Agadir verified partners...');
          }}
          className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Request B2B Loan</span>
        </button>
      </div>

      {/* Info Explainer Card */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1e1612] border-[#2e231c]'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[#f95721] shrink-0 ${
            isLight ? 'bg-orange-50 border border-orange-200' : 'bg-[#281e18]'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
              Agadir & Souss Car-Share Protocol
            </h4>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#9c8e82]'}`}>
              Share fleet vehicles with verified agencies during tourist surges with digital inspection checklists and automated B2B billing.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0">
          ✓ Verified Partner Safe
        </span>
      </div>

      {/* Active Shares List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {carShares.map((share) => (
          <div
            key={share.id}
            className={`rounded-3xl p-6 border space-y-5 shadow-xs transition-colors ${
              isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isLight ? 'bg-neutral-100 text-[#f95721] border-neutral-200' : 'bg-[#251c16] text-[#f95721] border-[#33261e]'
                  }`}>
                    {share.requestNumber}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">
                    {share.status === 'active' ? 'Active Loaning' : 'Pending Approval'}
                  </span>
                </div>
                <h3 className={`font-serif-display text-base font-bold mt-1 ${
                  isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
                }`}>
                  {share.vehicleName}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-[#f95721]">{formatPrice(share.dailyRateMAD)}</span>
                <span className={`text-[10px] block ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>B2B rate / day</span>
              </div>
            </div>

            {/* Partner Agency Info */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e221b]'
            }`}>
              <div className="flex items-center gap-2">
                <Building2 className={`w-4 h-4 ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`} />
                <span className={`font-semibold ${isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}`}>{share.targetAgencyName}</span>
              </div>
              <span className={isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}>{share.targetAgencyCity}</span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl ${isLight ? 'bg-neutral-50 text-neutral-800' : 'bg-[#201813] text-[#a89b90]'}`}>
                <span className={`block text-[10px] ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>Start Date</span>
                <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>{share.startDate}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${isLight ? 'bg-neutral-50 text-neutral-800' : 'bg-[#201813] text-[#a89b90]'}`}>
                <span className={`block text-[10px] ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>Return Date</span>
                <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>{share.endDate}</span>
              </div>
            </div>

            {/* Digital Inspections Section */}
            <div className={`border-t pt-4 space-y-3 ${isLight ? 'border-neutral-100' : 'border-[#261d16]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                  Digital Inspection Logs ({share.inspections.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShare(share);
                    setShowInspectionModal(true);
                  }}
                  className="text-xs text-[#f95721] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Inspection</span>
                </button>
              </div>

              {share.inspections.length === 0 ? (
                <p className={`text-xs italic ${isLight ? 'text-neutral-400' : 'text-[#7d6e63]'}`}>No handover inspection logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {share.inspections.map((insp) => (
                    <div key={insp.id} className={`p-3 rounded-xl border space-y-1.5 text-xs transition-colors ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2c2019]'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-500 uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Handover {insp.type}
                        </span>
                        <span className={isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}>{insp.date} • {insp.inspectorName}</span>
                      </div>
                      <div className={`flex items-center gap-4 ${isLight ? 'text-neutral-700' : 'text-[#c9b8ab]'}`}>
                        <span className="flex items-center gap-1 font-mono">
                          <Gauge className="w-3 h-3 text-[#f95721]" /> {insp.odometerKm} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-amber-500" /> {insp.fuelLevel}
                        </span>
                        <span className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
                          <Camera className="w-3 h-3" /> {insp.photosCount} photos
                        </span>
                      </div>
                      <p className={`text-[11px] italic ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>"{insp.notes}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Inspection Modal */}
      {showInspectionModal && selectedShare && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl border p-6 max-w-md w-full shadow-xl space-y-4 transition-colors ${
            isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#1a130f] border-[#2b2018] text-[#f5efe8]'
          }`}>
            <h3 className="font-serif-display text-lg font-bold">
              Log B2B Handover Inspection
            </h3>
            <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Digital proof for {selectedShare.vehicleName} under contract {selectedShare.requestNumber}.
            </p>

            <form onSubmit={handleAddInspection} className="space-y-3">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
                  Odometer (KM)
                </label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  required
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-[#f95721] focus:outline-none ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                      : 'bg-[#241b15] border-[#382b21] text-[#f5efe8]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
                  Fuel Gauge
                </label>
                <select
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-[#f95721] focus:outline-none ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                      : 'bg-[#241b15] border-[#382b21] text-[#f5efe8]'
                  }`}
                >
                  <option value="8/8 Full">8/8 Full (Full Tank)</option>
                  <option value="6/8 Full">6/8 (3/4 Tank)</option>
                  <option value="4/8 Full">4/8 (Half Tank)</option>
                  <option value="2/8 Full">2/8 (1/4 Tank)</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
                  Inspection Notes & Body Check
                </label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-[#f95721] focus:outline-none ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                      : 'bg-[#241b15] border-[#382b21] text-[#f5efe8]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer ${
                    isLight 
                      ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200' 
                      : 'text-[#8d7e73] hover:text-white bg-[#221914]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Submit Inspection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
