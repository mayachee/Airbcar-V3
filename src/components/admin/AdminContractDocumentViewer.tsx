import React, { useState } from 'react';
import { AdminBooking } from '../../types/admin';
import { 
  FileText, ShieldCheck, Printer, Download, CheckCircle, 
  ExternalLink, ZoomIn, Eye, Copy, Check, Car, User, 
  Building2, Calendar, CreditCard, Lock, AlertCircle, Sparkles, RotateCw
} from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { DriverLicenseVisualCard } from '../common/DriverLicenseVisualCard';

interface AdminContractDocumentViewerProps {
  booking: AdminBooking;
}

export const AdminContractDocumentViewer: React.FC<AdminContractDocumentViewerProps> = ({
  booking
}) => {
  const { isLight } = useAccountSettings();
  const [activeSubView, setActiveSubView] = useState<'contract' | 'documents'>('contract');
  const [copiedHash, setCopiedHash] = useState(false);
  const [previewModalDoc, setPreviewModalDoc] = useState<{
    title: string;
    type: string;
    number?: string;
    details: string[];
    imageUrl?: string;
    isLicense?: boolean;
    licenseSide?: 'front' | 'back';
  } | null>(null);

  const formatMAD = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(booking.digitalContract.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert(`Downloading official certified contract: ${booking.digitalContract.contractNumber}.pdf`);
  };

  // Mock document items for this booking
  const attachedDocs = [
    {
      id: 'doc-cin',
      title: 'Pièce d\'Identité (CIN / Passeport)',
      subtitle: `${booking.renterName} • ${booking.renterCountry}`,
      type: 'Moroccan CIN / Passport',
      number: booking.clientId === 'client-karim-bennani' ? 'BE849102' : '21FRA889104',
      status: 'verified' as const,
      expiry: '2031-08-20',
      details: [
        `Numéro: ${booking.clientId === 'client-karim-bennani' ? 'BE849102' : '21FRA889104'}`,
        `Titulaire: ${booking.renterName}`,
        `Nationalité: ${booking.renterCountry} ${booking.renterFlag}`,
        'Statut: Vérification biométrique réussie',
        'Validité: Jusqu\'au 20 Août 2031'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'doc-license-front',
      title: 'Permis de Conduire (Driver License - Front / Recto)',
      subtitle: 'Royaume du Maroc • Titulaire & Photo',
      type: 'Permis de Conduire (Recto)',
      number: booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109',
      status: 'verified' as const,
      expiry: '2028-06-10',
      isLicense: true,
      licenseSide: 'front' as const,
      details: [
        `Permis N°: ${booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}`,
        `Titulaire: ${booking.renterName}`,
        'Face: RECTO / FRONT (Photo portrait et état civil)',
        'Catégories autorisées: B (Tourisme ≤ 3.5T), AM',
        'Expérience de conduite: 18 années de permis',
        'Autorité de délivrance: NARSA Maroc'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'doc-license-back',
      title: 'Permis de Conduire (Driver License - Back / Verso)',
      subtitle: 'Tableau des Catégories & Code-barres NARSA',
      type: 'Permis de Conduire (Verso)',
      number: booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109',
      status: 'verified' as const,
      expiry: '2028-06-10',
      isLicense: true,
      licenseSide: 'back' as const,
      details: [
        `Permis N°: ${booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}`,
        'Face: VERSO / BACK (Matrice des catégories et mentions légales)',
        'Catégorie B: Validée (délivrée le 10/06/2008)',
        'Bande de sécurité MRZ & code-barres conformes',
        'Cachet du Centre Immatriculateur: Authentifié'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'doc-insurance',
      title: 'Attestation d\'Assurance & Carte Verte',
      subtitle: 'Wafa Assurance Maroc • Tous Risques',
      type: 'Police Automobile',
      number: 'POL-WAFA-89421-2026',
      status: 'valid' as const,
      expiry: '2027-01-15',
      details: [
        'Police N°: POL-WAFA-89421-2026',
        'Compagnie: Wafa Assurance Maroc',
        'Couverture: Tous risques (CDW, Vol, Incendie, Bris de glace)',
        'Assistance 24/7: +212 522 957575 (Remorquage national inclus)',
        'Franchise contractuelle: 3 000 MAD'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'doc-handover',
      title: 'Fiche d\'État des Lieux & Photos Inspection',
      subtitle: `Effectué par ${booking.checkInInspection.agentName}`,
      type: 'Inspection Prise en Charge',
      number: `INSP-${booking.bookingNumber}-01`,
      status: 'signed' as const,
      expiry: booking.checkInInspection.completedAt,
      details: [
        `Agent contrôleur: ${booking.checkInInspection.agentName}`,
        `Kilométrage initial: ${booking.checkInInspection.initialMileageKm.toLocaleString()} km`,
        `Niveau de carburant: ${booking.checkInInspection.initialFuelLevel}`,
        `Photos horodatées: ${booking.checkInInspection.photos.length} angles extérieurs capturés`,
        `Notes: ${booking.checkInInspection.notes}`
      ],
      imageUrl: booking.checkInInspection.photos[0]?.url || booking.vehicleImage
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-[#2e231c]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubView('contract')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'contract'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' : 'bg-[#201813] text-neutral-400 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Rental Contract (PDF Format)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('documents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'documents'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' : 'bg-[#201813] text-neutral-400 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Attached Identity & Insurance Documents ({attachedDocs.length})</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-white/10 hover:bg-white/5 transition-all cursor-pointer"
            title="Print certified document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs transition-all cursor-pointer"
            title="Download certified PDF with digital stamp"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OFFICIAL RENTAL CONTRACT PAPER PREVIEW */}
      {activeSubView === 'contract' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Integrity Seal Bar */}
          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Certified Digital Contract:</strong> Signed via 2-Factor SMS OTP and sealed with cryptographic SHA-256 integrity hash.
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyHash}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-white dark:bg-black/40 border border-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-100 transition-all cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Hash Copied!' : 'Copy SHA-256'}</span>
            </button>
          </div>

          {/* Paper Contract Container */}
          <div className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-10 border border-neutral-300 shadow-lg text-xs space-y-6 font-sans">
            
            {/* Header: Kingdom of Morocco & Ministry */}
            <div className="border-b-2 border-neutral-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇲🇦</span>
                  <div>
                    <h1 className="font-serif-display text-lg font-black tracking-tight text-neutral-950 uppercase">
                      Royaume du Maroc
                    </h1>
                    <p className="text-[10px] text-neutral-600 uppercase font-semibold tracking-wider">
                      Ministère du Transport et de la Logistique • Direction des Transports Routiers
                    </p>
                  </div>
                </div>
                <h2 className="text-sm font-bold text-neutral-800 mt-2 tracking-wide uppercase">
                  Contrat de Location de Véhicule sans Chauffeur
                </h2>
                <p className="text-[10px] text-neutral-500">
                  Établi en application du Dahir n° 1-10-07 du 26 Safar 1431 portant promulgation de la loi n° 52-05
                </p>
              </div>

              <div className="text-left sm:text-right border-l-2 sm:border-l-0 pl-3 sm:pl-0 border-[#f95721]">
                <span className="text-xl font-black font-serif-display text-[#f95721] tracking-tight">airbcar</span>
                <span className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mt-0.5">
                  Ref: {booking.digitalContract.contractNumber}
                </span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ Séquestre Bancaire Garanti
                </span>
              </div>
            </div>

            {/* PARTIES: LOUEUR & LOCATAIRE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Agency Box */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#f95721]" />
                    Le Loueur (Agence Partenaire)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700">Agréé Ministère</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p className="font-bold text-xs text-neutral-950">{booking.agencyName} (SARL AU)</p>
                  <p><span className="text-neutral-500">RC:</span> <span className="font-mono font-semibold">4545/Meknès</span> • <span className="text-neutral-500">Patente:</span> <span className="font-mono font-semibold">PAT-482019</span></p>
                  <p><span className="text-neutral-500">ICE:</span> <span className="font-mono font-semibold">002849102000045</span> (15 chiffres)</p>
                  <p><span className="text-neutral-500">Identifiant Fiscal:</span> <span className="font-mono font-semibold">IF 45450012</span></p>
                  <p><span className="text-neutral-500">Adresse Siège:</span> Boulevard Mohammed V, Azrou (Succursale Agadir Al Massira)</p>
                  <p><span className="text-neutral-500">Contact Téléphonique:</span> <span className="font-semibold">+212 696-145103</span></p>
                </div>
              </div>

              {/* Renter Box */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#f95721]" />
                    Le Locataire (Client Conducteur)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">Identité Certifiée</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p className="font-bold text-xs text-neutral-950">{booking.renterName} {booking.renterFlag}</p>
                  <p><span className="text-neutral-500">Pièce d'Identité:</span> <span className="font-mono font-bold text-[#f95721]">{booking.clientId === 'client-karim-bennani' ? 'CIN BE849102' : 'Passport 21FRA889104'}</span></p>
                  <p><span className="text-neutral-500">Permis de Conduire:</span> <span className="font-mono font-semibold">{booking.clientId === 'client-karim-bennani' ? '44/198204 (Maroc)' : 'FR-140928109 (France)'}</span> • Cat. B</p>
                  <p><span className="text-neutral-500">Nationalité:</span> {booking.renterCountry}</p>
                  <p><span className="text-neutral-500">Téléphone Mobile:</span> <span className="font-semibold">{booking.renterPhone}</span></p>
                  <p><span className="text-neutral-500">Email:</span> {booking.renterEmail}</p>
                </div>
              </div>

            </div>

            {/* VEHICLE SPECIFICATIONS */}
            <div className="border border-neutral-300 rounded-xl overflow-hidden">
              <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-300 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#f95721]" />
                  Caractéristiques du Véhicule Désigné
                </span>
                <span className="text-[10px] font-mono text-neutral-500 font-semibold">Police Wafa N° WAFA-89421</span>
              </div>
              
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase">Marque & Modèle</span>
                  <span className="font-bold text-neutral-950 text-xs">{booking.vehicleName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase">Immatriculation</span>
                  <span className="font-mono font-bold text-xs bg-black/5 px-2 py-0.5 rounded inline-block text-neutral-900 border border-neutral-300">
                    {booking.vehiclePlate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase">Énergie / Carburant</span>
                  <span className="font-semibold text-neutral-900">Diesel 10 ppm (Plein au départ)</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase">Numéro de Châssis (VIN)</span>
                  <span className="font-mono text-[10px] font-semibold text-neutral-700">VF1HJD2094810283</span>
                </div>
              </div>
            </div>

            {/* ITINERARY, RATES & ESCROW SCHEDULE */}
            <div className="border border-neutral-300 rounded-xl overflow-hidden">
              <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-300 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#f95721]" />
                  Conditions de Prise en Charge, Restitution & Barème Financier
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Kilométrage Illimité</span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] border-b border-neutral-200">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Prise en Charge (Départ)</span>
                  <p className="font-bold text-neutral-950">{booking.pickupLocation}</p>
                  <p className="text-neutral-600">{booking.pickupDate} à {booking.pickupTime}</p>
                  {booking.flightNumber && <p className="text-emerald-700 font-semibold">Vol Arrivée: {booking.flightNumber}</p>}
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Restitution (Retour)</span>
                  <p className="font-bold text-neutral-950">{booking.returnLocation}</p>
                  <p className="text-neutral-600">{booking.returnDate} à {booking.returnTime}</p>
                </div>
              </div>

              {/* Financial Lines */}
              <div className="p-4 bg-[#fbfaf8] space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span>Location de base du véhicule (Assurance tous risques incluse)</span>
                  <span className="font-mono font-bold text-neutral-950">{formatMAD(booking.totalAmountMAD)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Assurance CDW, Bris de Glace & Vol avec assistance 24/7 au Maroc</span>
                  <span className="font-semibold">Inclus / Offert</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Livraison ponctuelle et accueil aéroportuaire</span>
                  <span className="font-semibold">0.00 MAD</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-neutral-300 pt-2 text-neutral-950">
                  <span>Montant Total Réglé TTC (Paiement Sécurisé CMI)</span>
                  <span className="text-[#f95721] font-mono text-sm">{formatMAD(booking.totalAmountMAD)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-neutral-700 pt-1 border-t border-dashed border-neutral-300">
                  <span>Dépôt de Garantie Séquestré (Caution Fiduciary Escrow Airbcar)</span>
                  <span className="font-mono font-bold text-neutral-950">{formatMAD(booking.escrowDepositMAD)} ({booking.paymentDetails.cardBrand} •••• {booking.paymentDetails.cardLast4})</span>
                </div>
              </div>
            </div>

            {/* GENERAL CONDITIONS EXCERPT */}
            <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50 space-y-2 text-[10px] text-neutral-600 leading-relaxed">
              <h3 className="font-bold uppercase tracking-wider text-neutral-800 text-[10px]">
                Clauses & Conditions Générales Réglementaires (Extrait Obligatoire)
              </h3>
              <p>
                <strong>1. Utilisation du véhicule:</strong> Le locataire s'engage à conduire le véhicule exclusivement sur les voies carrossables du Royaume du Maroc. Tout franchissement de frontière internationale est strictement interdit et entraîne la déchéance immédiate des garanties d'assurance.
              </p>
              <p>
                <strong>2. Carburant et restitution:</strong> Le véhicule doit être restitué avec le même niveau de carburant qu'au départ (8/8 plein). À défaut, le carburant manquant sera facturé au tarif en vigueur majoré de frais de remise à niveau.
              </p>
              <p>
                <strong>3. Amendes & Radars Automatiques:</strong> Conformément à la législation marocaine, le locataire est pécuniairement et pénalement responsable de toutes les infractions au code de la route commises durant la durée de location (radars fixes CNPAC, stationnement, excès de vitesse).
              </p>
            </div>

            {/* CERTIFIED SIGNATURES SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-neutral-800">
              
              {/* Agency Stamp */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50 relative overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Pour le Loueur (Mayache Cars SARL AU)
                </div>
                <div className="font-serif-display italic text-neutral-800 text-sm mt-3">
                  Direction Générale & Cachet Électronique
                </div>
                <div className="mt-2 text-[10px] text-neutral-500 space-y-0.5">
                  <p>Cachet commercial apposé</p>
                  <p className="font-mono text-emerald-700 font-semibold">Certifié le 26/08/2026 à 14:18 GMT+1</p>
                </div>
                {/* Stamp visual */}
                <div className="absolute right-3 bottom-3 w-16 h-16 rounded-full border-2 border-dashed border-[#f95721]/40 flex items-center justify-center text-[9px] font-bold text-[#f95721] -rotate-12 pointer-events-none uppercase text-center p-1">
                  Airbcar Verified Partner
                </div>
              </div>

              {/* Renter Digital Signature */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50 relative overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Pour le Locataire (Signature Numérique Certifiée)
                </div>
                <div className="font-serif-display italic text-neutral-900 text-sm mt-3">
                  {booking.renterName}
                </div>
                <div className="mt-2 text-[10px] text-neutral-600 space-y-0.5">
                  <p className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Validé par Code SMS OTP (2FA)</span>
                  </p>
                  <p className="font-mono text-neutral-500">Horodatage: {booking.digitalContract.signedAt}</p>
                  <p className="font-mono text-[9px] text-neutral-400 truncate">IP: {booking.deviceInfo.ipAddress} ({booking.deviceInfo.geoCity})</p>
                </div>
              </div>

            </div>

            {/* Cryptographic SHA-256 Seal Footer */}
            <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] text-neutral-400 font-mono">
              <span className="truncate max-w-full">
                SHA-256: {booking.digitalContract.sha256Hash}
              </span>
              <span className="shrink-0 text-emerald-600 font-bold">
                ✓ Document officiel scellé et opposable
              </span>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: ATTACHED IDENTITY & VERIFICATION DOCUMENTS */}
      {activeSubView === 'documents' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Official identity papers, driver's licenses, insurance policies, and vehicle inspection sheets attached to Booking #{booking.bookingNumber}.
            </p>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 5/5 Verified Documents
            </span>
          </div>

          {/* DRIVER'S LICENSE BIOMETRIC SPOTLIGHT: FRONT & BACK */}
          <div className={`p-5 rounded-2xl border ${
            isLight ? 'bg-amber-50/40 border-amber-200 shadow-xs' : 'bg-[#1e1510] border-[#38261b]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Renter Driving License Dossier (Permis de Conduire Marocain)
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  High-fidelity inspection of both Front (Recto) identity photo and Back (Verso) endorsed categories & MRZ barcoding.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                <Check className="w-3.5 h-3.5" />
                <span>NARSA Certified Valid</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recto / Front Card */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Face 1: Recto / Front (Identité, Photo, C.I.N.)
                </span>
                <DriverLicenseVisualCard
                  licenseNumber={booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}
                  driverName={booking.renterName}
                  driverCountry={booking.renterCountry}
                  driverFlag={booking.renterFlag}
                  driverCinOrPassport={booking.clientId === 'client-karim-bennani' ? 'BE849102' : '21FRA889104'}
                  defaultSide="front"
                  onZoom={(side) => setPreviewModalDoc({
                    title: `Permis de Conduire (${side === 'front' ? 'Recto / Front' : 'Verso / Back'})`,
                    type: 'Permis de Conduire Officiel',
                    number: booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109',
                    details: [
                      `Titulaire: ${booking.renterName}`,
                      `Numéro de Permis: ${booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}`,
                      `Identifiant C.I.N.: ${booking.clientId === 'client-karim-bennani' ? 'BE849102' : '21FRA889104'}`,
                      'Catégorie B Validée pour Véhicules de Tourisme (≤ 3.5T)',
                      'Contrôle biométrique facial conforme aux registres NARSA',
                      'Validité contractuelle active jusqu\'au 10/06/2028'
                    ],
                    isLicense: true,
                    licenseSide: side
                  })}
                />
              </div>

              {/* Verso / Back Card */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Face 2: Verso / Back (Catégories Validées & MRZ)
                </span>
                <DriverLicenseVisualCard
                  licenseNumber={booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}
                  driverName={booking.renterName}
                  driverCountry={booking.renterCountry}
                  driverFlag={booking.renterFlag}
                  driverCinOrPassport={booking.clientId === 'client-karim-bennani' ? 'BE849102' : '21FRA889104'}
                  defaultSide="back"
                  onZoom={(side) => setPreviewModalDoc({
                    title: `Permis de Conduire (${side === 'front' ? 'Recto / Front' : 'Verso / Back'})`,
                    type: 'Permis de Conduire Officiel',
                    number: booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109',
                    details: [
                      `Titulaire: ${booking.renterName}`,
                      `Numéro de Permis: ${booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}`,
                      'Matrice des catégories: AM, B autorisées',
                      'Code-barres de sécurité et MRZ cryptographique scannés',
                      'Cachet officiel de la Direction des Transports Routiers'
                    ],
                    isLicense: true,
                    licenseSide: side
                  })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attachedDocs.map(doc => (
              <div 
                key={doc.id}
                className={`p-5 rounded-2xl border transition-all hover:border-[#f95721]/50 ${
                  isLight ? 'bg-neutral-50 border-neutral-200 shadow-xs' : 'bg-[#201813] border-[#2e231c]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-300 dark:border-white/10 shrink-0 bg-black/20">
                      <img src={doc.imageUrl} alt={doc.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold leading-tight">{doc.title}</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{doc.subtitle}</p>
                      <span className="inline-block mt-1 font-mono text-[11px] font-bold text-[#f95721]">
                        {doc.number}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {doc.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-white/10 space-y-1 text-xs">
                  {doc.details.slice(0, 3).map((item, i) => (
                    <p key={i} className="text-neutral-400 text-[11px] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#f95721]" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">
                    Expiry: <strong>{doc.expiry}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setPreviewModalDoc(doc)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f95721]/10 text-[#f95721] hover:bg-[#f95721]/20 border border-[#f95721]/20 transition-all cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Inspect Document</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className={`relative max-w-lg w-full rounded-2xl border p-6 shadow-2xl overflow-hidden space-y-4 ${
            isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#1a120d] border-[#36271e] text-[#f5efe8]'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f95721]">
                  Official Document Dossier
                </span>
                <h3 className="text-base font-bold">{previewModalDoc.title}</h3>
                <p className="text-xs text-neutral-400">{previewModalDoc.type} • {previewModalDoc.number}</p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Image Preview or Interactive License */}
            {previewModalDoc.isLicense ? (
              <div className="space-y-2">
                <DriverLicenseVisualCard
                  licenseNumber={booking.clientId === 'client-karim-bennani' ? '44/198204' : 'FR-140928109'}
                  driverName={booking.renterName}
                  driverCountry={booking.renterCountry}
                  driverFlag={booking.renterFlag}
                  driverCinOrPassport={booking.clientId === 'client-karim-bennani' ? 'BE849102' : '21FRA889104'}
                  defaultSide={previewModalDoc.licenseSide || 'front'}
                />
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-white/10 h-52 bg-black/40 flex items-center justify-center">
                <img 
                  src={previewModalDoc.imageUrl} 
                  alt={previewModalDoc.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Checklist Details */}
            <div className={`p-4 rounded-xl border space-y-2 text-xs ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Extracted Biometric & Legal Fields:
              </span>
              <ul className="space-y-1 text-xs">
                {previewModalDoc.details.map((d, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-white/10 hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
