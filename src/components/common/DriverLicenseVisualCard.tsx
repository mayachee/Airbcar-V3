import React, { useState } from 'react';
import { 
  ShieldCheck, RotateCw, ZoomIn, Download, CheckCircle, 
  Calendar, Check, Award, Lock, ExternalLink
} from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';

export interface DriverLicenseVisualCardProps {
  licenseNumber: string;
  driverName: string;
  driverCountry?: string;
  driverFlag?: string;
  driverCinOrPassport?: string;
  birthDate?: string;
  issueDate?: string;
  expiryDate?: string;
  categories?: string[];
  photoUrl?: string;
  onZoom?: (side: 'front' | 'back') => void;
  className?: string;
  defaultSide?: 'front' | 'back';
}

export const DriverLicenseVisualCard: React.FC<DriverLicenseVisualCardProps> = ({
  licenseNumber,
  driverName,
  driverCountry = 'Morocco',
  driverFlag = '🇲🇦',
  driverCinOrPassport = 'BE849102',
  birthDate = '14.05.1986 Casablanca',
  issueDate = '10.06.2008',
  expiryDate = '10.06.2028',
  categories = ['B', 'AM'],
  photoUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  onZoom,
  className = '',
  defaultSide = 'front',
}) => {
  const { isLight } = useAccountSettings();
  const [side, setSide] = useState<'front' | 'back'>(defaultSide);

  const toggleSide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSide(prev => prev === 'front' ? 'back' : 'front');
  };

  const nameParts = driverName.split(' ');
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ').toUpperCase() : driverName.toUpperCase();
  const firstName = nameParts[0]?.toUpperCase() || '';

  return (
    <div className={`space-y-2 ${className}`}>
      
      {/* Top Header Bar for License Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {side === 'front' ? "Permis de Conduire (Recto / Front)" : "Permis de Conduire (Verso / Back)"}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30">
            {licenseNumber}
          </span>
        </div>

        {/* Action controls: Flip & Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleSide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#f95721] text-white hover:bg-[#e04a17] transition-all cursor-pointer shadow-xs"
            title="Flip between Front and Back of the driving license"
          >
            <RotateCw className="w-3 h-3" />
            <span>{side === 'front' ? 'Voir Verso (Back)' : 'Voir Recto (Front)'}</span>
          </button>

          {onZoom && (
            <button
              type="button"
              onClick={() => onZoom(side)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Inspect high resolution"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* THE ACTUAL DRIVER LICENSE PHYSICAL CARD DESIGN */}
      <div 
        onClick={() => onZoom && onZoom(side)}
        className="w-full rounded-2xl border border-neutral-300 dark:border-[#3d2f25] bg-gradient-to-br from-[#f8f6f3] via-[#f1eee9] to-[#e8e4dc] dark:from-[#2a1e17] dark:via-[#201712] dark:to-[#17100c] text-neutral-900 dark:text-[#f5efe8] p-4 sm:p-5 shadow-md relative overflow-hidden cursor-pointer group transition-all hover:border-[#f95721]/60"
        style={{ minHeight: '220px' }}
      >
        {/* Background Guilloche / Security Pattern lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f95721_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Hologram security stamp in corner */}
        <div className="absolute right-3 top-3 w-9 h-9 rounded-full border border-amber-400/50 bg-gradient-to-tr from-amber-400/20 via-pink-400/20 to-cyan-400/20 flex items-center justify-center text-[8px] font-black text-amber-500/80 uppercase shadow-inner pointer-events-none">
          MAR
        </div>

        {/* ========================================================= */}
        {/* FRONT SIDE (RECTO) */}
        {/* ========================================================= */}
        {side === 'front' && (
          <div className="space-y-3.5 animate-fadeIn">
            
            {/* Header: Kingdom of Morocco */}
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇲🇦</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">المملكة المغربية</span>
                    <span className="text-[10px] font-black text-[#f95721] tracking-wider uppercase">ROYAUME DU MAROC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-neutral-900 dark:text-white uppercase tracking-tight">PERMIS DE CONDUIRE</span>
                    <span className="text-[10px] text-neutral-500 font-semibold">رخصة السياقة</span>
                  </div>
                </div>
              </div>

              <div className="text-right pr-9">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  NARSA OFFICIEL
                </span>
                <span className="text-[10px] font-bold font-mono text-[#f95721]">
                  CAT. {categories.join(', ')}
                </span>
              </div>
            </div>

            {/* Middle Section: Photo & Biometrics */}
            <div className="grid grid-cols-12 gap-3 items-center">
              
              {/* Photo Frame */}
              <div className="col-span-4 sm:col-span-3">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-neutral-300 dark:border-white/20 bg-black/10 relative shadow-inner">
                  <img 
                    src={photoUrl} 
                    alt={driverName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[8px] text-white text-center font-mono py-0.5">
                    {driverCinOrPassport}
                  </div>
                </div>
              </div>

              {/* Data Rows */}
              <div className="col-span-8 sm:col-span-9 space-y-1 text-[11px]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-semibold">1. Nom / Last Name</span>
                    <span className="font-bold text-neutral-950 dark:text-white text-xs">{lastName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-semibold">2. Prénom / First Name</span>
                    <span className="font-bold text-neutral-950 dark:text-white text-xs">{firstName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-semibold">3. Date & Lieu de Naiss.</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{birthDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block font-semibold">4d. N° C.I.N. / Passport</span>
                    <span className="font-mono font-bold text-[#f95721]">{driverCinOrPassport}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-0.5 border-t border-neutral-300/80 dark:border-white/10 text-[10px]">
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase block">4a. Délivré le</span>
                    <span className="font-mono font-semibold">{issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase block">4b. Expire le</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase block">5. N° Permis</span>
                    <span className="font-mono font-bold text-neutral-950 dark:text-white">{licenseNumber}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-2 border-t border-neutral-300 dark:border-white/10 flex items-center justify-between text-[9px] text-neutral-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                Vérification Biométrique Conforme (Agence Nationale de la Sécurité Routière)
              </span>
              <span className="text-[#f95721] font-semibold group-hover:underline flex items-center gap-1">
                Cliquer pour agrandir <ZoomIn className="w-3 h-3" />
              </span>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* BACK SIDE (VERSO) */}
        {/* ========================================================= */}
        {side === 'back' && (
          <div className="space-y-3 animate-fadeIn">
            
            {/* Header: Back Endorsements */}
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                  D1-MAR • PERMIS DE CONDUIRE NUMÉRIQUE
                </span>
                <span className="text-xs font-bold text-neutral-950 dark:text-white uppercase">
                  Tableau des Catégories & Mentions Spéciales
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ✓ Catégorie B Validée
              </span>
            </div>

            {/* Categories Table Matrix */}
            <div className="rounded-xl border border-neutral-300 dark:border-white/15 overflow-hidden text-[10px]">
              <div className="grid grid-cols-12 bg-neutral-200/70 dark:bg-white/10 font-bold uppercase text-[9px] p-1.5 text-neutral-600 dark:text-neutral-300">
                <div className="col-span-3">Catégorie</div>
                <div className="col-span-4">Date Délivrance (10)</div>
                <div className="col-span-3">Date Expiration (11)</div>
                <div className="col-span-2 text-right">Statut</div>
              </div>

              {/* Row AM */}
              <div className="grid grid-cols-12 p-1.5 border-t border-neutral-300 dark:border-white/10 items-center">
                <div className="col-span-3 font-bold">AM (Cyclomoteur)</div>
                <div className="col-span-4 font-mono text-neutral-500">{issueDate}</div>
                <div className="col-span-3 font-mono text-neutral-500">{expiryDate}</div>
                <div className="col-span-2 text-right font-bold text-emerald-600 dark:text-emerald-400">VALIDE</div>
              </div>

              {/* Row B (Highlighted) */}
              <div className="grid grid-cols-12 p-1.5 border-t border-neutral-300 dark:border-white/10 items-center bg-[#f95721]/10 text-neutral-950 dark:text-white font-semibold">
                <div className="col-span-3 font-bold flex items-center gap-1 text-[#f95721]">
                  <span>🚗 B</span>
                  <span className="text-[8px] font-normal text-neutral-500">(&lt; 3.5 T)</span>
                </div>
                <div className="col-span-4 font-mono font-bold">{issueDate}</div>
                <div className="col-span-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{expiryDate}</div>
                <div className="col-span-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ ACTIF
                </div>
              </div>

              {/* Row C / Heavy */}
              <div className="grid grid-cols-12 p-1.5 border-t border-neutral-300 dark:border-white/10 items-center text-neutral-400">
                <div className="col-span-3">C / Poids Lourd</div>
                <div className="col-span-4 font-mono">—</div>
                <div className="col-span-3 font-mono">—</div>
                <div className="col-span-2 text-right text-[9px]">Non titulaire</div>
              </div>
            </div>

            {/* Stamp & Barcode Strip */}
            <div className="pt-2 border-t border-neutral-300 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="font-mono text-[9px] text-neutral-500 tracking-wider">
                BARCODE: ||| | |||| ||| ||||||| | ||| |||||
              </div>
              <div className="font-mono text-[9px] text-neutral-400 truncate">
                MRZ: D1MAR{licenseNumber.replace('/', '')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;8605144M
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
