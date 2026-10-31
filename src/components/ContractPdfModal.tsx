import React from 'react';
import { X, Download, Printer, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

interface ContractPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSigned: boolean;
}

export const ContractPdfModal: React.FC<ContractPdfModalProps> = ({
  isOpen,
  onClose,
  isSigned,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Downloading AC-2418 agreement.pdf (240 KB)...');
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
                <div className="text-[10px] text-neutral-400 mt-0.5">Ref: AC-2418-AGA</div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-6 bg-[#FAF8F5] p-4 rounded-xl border border-neutral-200/60">
              <div>
                <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                  AGENCE LOUEUR / RENTAL AGENCY
                </div>
                <div className="font-bold text-neutral-900 mt-1">Mayache Cars S.A.R.L.</div>
                <div className="text-neutral-500">Agadir Al Massira Airport Branch</div>
                <div className="text-neutral-500">Registre de Commerce: RC-89412 Agadir</div>
                <div className="text-neutral-500">Représenté par: Youssef Mayache</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                  LOCATAIRE / RENTER
                </div>
                <div className="font-bold text-neutral-900 mt-1">Camille Dubois</div>
                <div className="text-neutral-500">Permis N°: FR-9204812 (Exp: 11 Nov 2026)</div>
                <div className="text-neutral-500">Identité: Passport vérifié 14 Mar 2026</div>
                <div className="text-neutral-500">Contact: camille.d@mail.com</div>
              </div>
            </div>

            {/* Vehicle & Reservation Specs */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2 font-bold text-[11px] text-neutral-700 border-b border-neutral-200">
                CONDITIONS DU VÉHICULE & DATES DE LOCATION
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Véhicule</div>
                  <div className="font-bold text-neutral-900">2025 VW Golf</div>
                  <div className="text-neutral-500">Immat: 4218-A-6</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Prise en charge</div>
                  <div className="font-bold text-neutral-900">Jeu 3 Sep, 10:00</div>
                  <div className="text-neutral-500">Agadir T1 Arrivées</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Restitution</div>
                  <div className="font-bold text-neutral-900">Mar 8 Sep, 10:00</div>
                  <div className="text-neutral-500">Agadir T1 Départs</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Carburant</div>
                  <div className="font-bold text-neutral-900">Plein / Plein</div>
                  <div className="text-neutral-500">Diesel 10 ppm</div>
                </div>
              </div>
            </div>

            {/* Financials & Deposit Hold */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-neutral-200/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Location de base (6 jours × 408.33 MAD)</span>
                <span className="font-bold text-neutral-900">2,450.00 MAD</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Assurance tous risques (CDW + Vol) Franchise: 4,000 MAD</span>
                <span className="text-emerald-700 font-medium">Inclus / Included</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Livraison & Récupération Aéroport Agadir Al Massira</span>
                <span className="text-emerald-700 font-medium">Gratuit / Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-neutral-200/80 pt-2 text-neutral-900">
                <span>Total TTC Réglé</span>
                <span className="text-[#f95721]">2,450.00 MAD</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-neutral-700 pt-1">
                <span>Caution Bloquée (Séquestre Airbcar / Escrow)</span>
                <span>2,000.00 MAD (Visa 4218)</span>
              </div>
            </div>

            {/* Signatures block */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 gap-8">
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Signature de l'Agence</div>
                <div className="font-serif-display italic text-neutral-800 text-sm mt-2">
                  Youssef Mayache
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Signé le 26/08/2026 14:18 GMT+1</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Signature du Locataire</div>
                {isSigned ? (
                  <div>
                    <div className="font-serif-display italic text-neutral-800 text-sm mt-2">
                      Camille Dubois
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
