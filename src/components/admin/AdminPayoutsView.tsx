import React, { useState } from 'react';
import { 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowUpRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { AdminPayoutBatch } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface AdminPayoutsViewProps {
  batches: AdminPayoutBatch[];
  onExecuteBatch: (batchId: string) => void;
}

export const AdminPayoutsView: React.FC<AdminPayoutsViewProps> = ({
  batches,
  onExecuteBatch,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  const [activeBatchId, setActiveBatchId] = useState<string>(batches[0]?.id || '');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState(false);

  const activeBatch = batches.find(b => b.id === activeBatchId) || batches[0];

  const handleDownloadCsv = () => {
    setDownloadSuccessMessage(true);
    setTimeout(() => setDownloadSuccessMessage(false), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            Treasury & Banking
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Bank Payout Batches & Settlements
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Disbursing net rental revenue to Moroccan partner agencies via Bank Al-Maghrib interbank transfers.
          </p>
        </div>

        {/* Batches tab */}
        <div className="flex items-center gap-2">
          {batches.map((batch) => (
            <button
              key={batch.id}
              type="button"
              onClick={() => setActiveBatchId(batch.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeBatch?.id === batch.id
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : isLight
                  ? 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  : 'bg-[#201813] border border-[#31241a] text-[#8d7e73] hover:text-white'
              }`}
            >
              <span>{batch.batchNumber}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                batch.status === 'settled' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {batch.status.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeBatch ? (
        <div className="space-y-6">
          
          {/* Batch Summary Card */}
          <div className={`p-6 rounded-3xl border ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
          }`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-neutral-500/15">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#f95721]">
                    {activeBatch.batchNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    activeBatch.status === 'settled' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                  }`}>
                    {activeBatch.status}
                  </span>
                </div>
                <h2 className="font-serif-display text-xl font-bold mt-1">
                  Settlement Period: {activeBatch.period}
                </h2>
                <p className="text-xs text-[#8d7e73]">
                  {activeBatch.items.length} verified agencies in this disbursement run
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors flex items-center gap-1.5 ${
                    isLight 
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300' 
                      : 'bg-[#221813] hover:bg-[#2c2018] text-[#f5efe8] border-[#382b21]'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export RIB Virement CSV</span>
                </button>

                {activeBatch.status !== 'settled' ? (
                  <button
                    type="button"
                    onClick={() => onExecuteBatch(activeBatch.id)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Execute Bank Disbursements</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold px-3 py-1.5 bg-emerald-500/10 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Batch Fully Settled & Disbursed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notification on export */}
            {downloadSuccessMessage && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Moroccan Banking RIB transfer file exported successfully (format: BAM-ISO-20022 compliant).</span>
              </div>
            )}

            {/* Metric Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-center text-xs">
              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
              }`}>
                <span className="text-[10px] text-[#8d7e73] block uppercase font-bold">Total Gross Trip GMV</span>
                <span className="font-mono font-bold text-lg">{formatPrice(activeBatch.totalAmountMAD + activeBatch.totalCommissionMAD)}</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
              }`}>
                <span className="text-[10px] text-[#f95721] block uppercase font-bold">HQ Platform Commission (15%)</span>
                <span className="font-mono font-bold text-lg text-[#f95721]">{formatPrice(activeBatch.totalCommissionMAD)}</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
              }`}>
                <span className="text-[10px] block uppercase font-bold text-emerald-500">Net Interbank Disbursement</span>
                <span className="font-mono font-bold text-lg">{formatPrice(activeBatch.totalAmountMAD)}</span>
              </div>
            </div>
          </div>

          {/* Agencies Table */}
          <div className={`rounded-3xl border overflow-hidden ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
          }`}>
            <div className="p-4 border-b border-neutral-500/15 font-bold text-xs flex items-center justify-between">
              <span>Agency Breakdown & Beneficiary RIBs</span>
              <span className="text-[#8d7e73] text-[11px] font-normal">All RIBs 24 digits verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`text-[10px] uppercase font-bold text-[#8d7e73] border-b ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1e1612] border-[#2c2018]'
                }`}>
                  <tr>
                    <th className="p-3.5">Agency</th>
                    <th className="p-3.5">Bank & RIB (24 Digits)</th>
                    <th className="p-3.5 text-right">Trips</th>
                    <th className="p-3.5 text-right">Gross GMV</th>
                    <th className="p-3.5 text-right">HQ Take Rate</th>
                    <th className="p-3.5 text-right">Net Wire Amount</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-500/15">
                  {activeBatch.items.map((item, idx) => (
                    <tr key={idx} className={isLight ? 'hover:bg-neutral-50' : 'hover:bg-[#201813]'}>
                      <td className="p-3.5 font-bold">{item.agencyName}</td>
                      <td className="p-3.5">
                        <div className="font-mono text-[11px]">{item.rib}</div>
                        <div className="text-[10px] text-[#8d7e73]">{item.bankName}</div>
                      </td>
                      <td className="p-3.5 text-right font-semibold">{item.tripsCount}</td>
                      <td className="p-3.5 text-right font-mono font-medium">{formatPrice(item.grossVolumeMAD)}</td>
                      <td className="p-3.5 text-right font-mono text-[#f95721]">-{formatPrice(item.commissionMAD)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-500">{formatPrice(item.netPayoutMAD)}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          item.status === 'settled' || activeBatch.status === 'settled'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}>
                          {activeBatch.status === 'settled' ? 'SETTLED' : item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};
