import React from 'react';
import { X, Download, Printer, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

interface ContractPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSigned: boolean;
  contractData?: {
    contractNumber?: string;
    carName?: string;
    carPlate?: string;
    renterName?: string;
    renterCin?: string;
    renterPhone?: string;
    renterEmail?: string;
    agencyName?: string;
    agencyCity?: string;
    pickupDate?: string;
    returnDate?: string;
    pickupLocation?: string;
    totalAmount?: number;
    depositAmount?: number;
    paymentMethod?: string;
  };
}

export const ContractPdfModal: React.FC<ContractPdfModalProps> = ({
  isOpen,
  onClose,
  isSigned,
  contractData,
}) => {
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const contractNum = contractData?.contractNumber || 'AC-2418-AGA';
  const renterName = contractData?.renterName || 'Camille Dubois';
  const carName = contractData?.carName || 'Volkswagen Golf 8 (2025)';
  const carPlate = contractData?.carPlate || '4218-A-6';
  const agencyName = contractData?.agencyName || 'Mayache Cars S.A.R.L.';
  const city = contractData?.agencyCity || 'Agadir';
  const pickup = contractData?.pickupDate || '14 Oct 2026';
  const returnD = contractData?.returnDate || '19 Oct 2026';
  const total = contractData?.totalAmount || 2450;
  const deposit = contractData?.depositAmount || 2000;
  const paymentMethod = contractData?.paymentMethod || 'Carte Bancaire CMI (3D Secure)';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Contrat_Location_${contractNum}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1a1412; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 2px solid #c43b0d; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    h1 { margin: 0; font-size: 18px; color: #1a1412; }
    .subtitle { font-size: 11px; color: #6e5d53; text-transform: uppercase; }
    .badge { background: #e6f4ea; color: #137333; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .box { background: #faf8f5; border: 1px solid #eae3d9; padding: 15px; border-radius: 8px; }
    .box-title { font-weight: bold; font-size: 11px; color: #7f523c; margin-bottom: 6px; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #eae3d9; padding: 10px; text-align: left; }
    th { background: #f4efea; font-size: 11px; text-transform: uppercase; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #eae3d9; }
    .sig-box { border: 1px solid #eae3d9; padding: 15px; border-radius: 8px; min-height: 80px; }
    .seal { text-align: center; margin-top: 30px; font-size: 10px; color: #888; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="subtitle">Royaume du Maroc • Ministère du Transport et de la Logistique</div>
      <h1>CONTRAT DE LOCATION DE VÉHICULE SANS CHAUFFEUR</h1>
      <div style="font-weight:bold; color:#c43b0d; margin-top:4px;">N° Enregistrement Dahir: ${contractNum}</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">Séquestre AirbCar Vérifié</span>
      <div style="font-size: 11px; margin-top: 5px; color: #666;">Date: ${new Date().toLocaleDateString('fr-FR')}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <div class="box-title">Agence de Location (Loueur)</div>
      <strong>${agencyName}</strong><br>
      Ville: ${city} (Maroc)<br>
      Registre de Commerce: RC-${Math.floor(10000 + Math.random() * 90000)}<br>
      Agrément Ministère: N° TRANS-2026-MA
    </div>
    <div class="box">
      <div class="box-title">Locataire (Conducteur Principal)</div>
      <strong>${renterName}</strong><br>
      CIN / Passeport: ${contractData?.renterCin || 'L-849201'}<br>
      Permis de Conduire: MA-${Math.floor(1000000 + Math.random() * 9000000)}<br>
      Tél: ${contractData?.renterPhone || '+212 6 12 34 56 78'}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Véhicule</th>
        <th>Immatriculation</th>
        <th>Période</th>
        <th>Mode de Règlement</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${carName}</strong></td>
        <td>${carPlate}</td>
        <td>${pickup} au ${returnD}</td>
        <td>${paymentMethod}</td>
      </tr>
    </tbody>
  </table>

  <div class="box">
    <div class="box-title">Règlement Financier &amp; Séquestre de Caution</div>
    <div>Total Location TTC: <strong>${total} MAD</strong></div>
    <div>Caution Garantie Escrow (Dahir 2026): <strong>${deposit} MAD</strong> (Restitution sous 24h après inspection sans dommage)</div>
    <div>Assurance: <strong>Tous Risques CDW + Vol + Assistance 24/7 au Maroc</strong></div>
  </div>

  <div class="signatures">
    <div class="sig-box">
      <div class="box-title">Signature de l'Agence</div>
      <div style="font-style: italic; font-size: 16px; margin-top: 10px;">${agencyName}</div>
      <div style="font-size: 10px; color: green; margin-top: 5px;">✓ Signature électronique certifiée</div>
    </div>
    <div class="sig-box">
      <div class="box-title">Signature du Locataire</div>
      <div style="font-style: italic; font-size: 16px; margin-top: 10px;">${renterName}</div>
      <div style="font-size: 10px; color: green; margin-top: 5px;">✓ e-Signature conforme Loi 53-05</div>
    </div>
  </div>

  <div class="seal">
    Contrat numérique généré sous le protocole de conformité Dahir 2026 AirbCar • Horodatage certifié CNDP
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contrat_Airbcar_${contractNum}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice('Official bilingual rental contract downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 animate-scale-up overflow-hidden">
        
        {/* Top bar */}
        <div className="bg-[#181311] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f95721] text-white flex items-center justify-center font-bold text-xs">
              PDF
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">
                AC-2418 agreement.pdf
              </div>
              <div className="text-[11px] text-neutral-400">
                4 pages · FR / EN · 240 KB · Certified digital copy
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f95721] hover:bg-[#e04816] text-white transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Document Visual Paper Render */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-neutral-100 flex justify-center">
          <div className="bg-white shadow-lg rounded-xl border border-neutral-200/80 p-8 sm:p-12 w-full max-w-2xl text-neutral-800 text-xs space-y-6 font-sans">
            
            {/* Header / Republic / Ministry */}
            <div className="flex justify-between items-start border-b border-neutral-200 pb-5">
              <div>
                <div className="font-serif-display text-lg font-bold tracking-tight text-neutral-900">
                  ROYAUME DU MAROC
                </div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Ministère du Transport et de la Logistique · Contrôle des Véhicules
                </div>
                <div className="text-xs font-semibold text-neutral-700 mt-1">
                  CONTRAT DE LOCATION DE VÉHICULE SANS CHAUFFEUR
                </div>
              </div>
              <div className="text-right">
                <span className="font-serif-display font-bold text-xl text-neutral-900">airbcar</span>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Platform Escrow</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">Ref: {contractNum}</div>
              </div>
            </div>

            {downloadNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadNotice}</span>
              </div>
            )}

            {/* Parties */}
            <div className="grid grid-cols-2 gap-6 bg-[#FAF8F5] p-4 rounded-xl border border-neutral-200/60">
              <div>
                <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                  AGENCE LOUEUR / RENTAL AGENCY
                </div>
                <div className="font-bold text-neutral-900 mt-1">{agencyName}</div>
                <div className="text-neutral-500">{city} Regional Hub</div>
                <div className="text-neutral-500">Registre de Commerce: RC-89412 {city}</div>
                <div className="text-neutral-500">Agrément Dahir 2026: Actif &amp; Conforme</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                  LOCATAIRE / RENTER
                </div>
                <div className="font-bold text-neutral-900 mt-1">{renterName}</div>
                <div className="text-neutral-500">CIN: {contractData?.renterCin || 'L-849201'}</div>
                <div className="text-neutral-500">Permis: {contractData?.renterPhone ? 'Vérifié Recto/Verso' : 'MA-2849102'}</div>
                <div className="text-neutral-500">Contact: {contractData?.renterEmail || 'traveler@airbcar.ma'}</div>
              </div>
            </div>

            {/* Vehicle & Reservation Specs */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2 font-bold text-[11px] text-neutral-700 border-b border-neutral-200">
                CONDITIONS DU VÉHICULE &amp; DATES DE LOCATION
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Véhicule</div>
                  <div className="font-bold text-neutral-900">{carName}</div>
                  <div className="text-neutral-500 font-mono">Immat: {carPlate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Prise en charge</div>
                  <div className="font-bold text-neutral-900">{pickup}</div>
                  <div className="text-neutral-500">{city} Centre / Hub</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Restitution</div>
                  <div className="font-bold text-neutral-900">{returnD}</div>
                  <div className="text-neutral-500">{city} Centre / Hub</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Règlement</div>
                  <div className="font-bold text-neutral-900">{paymentMethod.split(' ')[0]}</div>
                  <div className="text-neutral-500">{paymentMethod}</div>
                </div>
              </div>
            </div>

            {/* Financials & Deposit Hold */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-neutral-200/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Location de base véhicule TTC</span>
                <span className="font-bold text-neutral-900">{total} MAD</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Assurance tous risques (CDW + Vol + Zéro Franchise Escrow)</span>
                <span className="text-emerald-700 font-medium">Inclus / Included</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Assistance dépannage 24/7 Royaume du Maroc</span>
                <span className="text-emerald-700 font-medium">Gratuit / Inclus</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-neutral-200/80 pt-2 text-neutral-900">
                <span>Total TTC Réglé</span>
                <span className="text-[#f95721] font-mono">{total} MAD</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-neutral-700 pt-1">
                <span>Caution Bloquée (Séquestre Airbcar Escrow)</span>
                <span>{deposit} MAD ({paymentMethod})</span>
              </div>
            </div>

            {/* Signatures block */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 gap-8">
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Signature de l'Agence</div>
                <div className="font-serif-display italic text-neutral-800 text-sm mt-2">
                  {agencyName}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Certifié Dahir 2026</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Signature du Locataire</div>
                {isSigned ? (
                  <div>
                    <div className="font-serif-display italic text-neutral-800 text-sm mt-2">
                      {renterName}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Signé en ligne via Airbcar Secure ID</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#f95721] font-semibold mt-3 italic">
                    En attente de votre signature numérique
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
