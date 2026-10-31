import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Car, 
  FileText, 
  Scale, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  CreditCard,
  KeyRound,
  Check
} from 'lucide-react';
import { 
  seedAllRealTestDataToFirestore, 
  getFirestoreDataCounts 
} from '../../services/firebase';
import { 
  REAL_TEST_PARTNERS, 
  REAL_TEST_USERS, 
  REAL_TEST_CARS,
  PartnerAgencyInfo,
  RealTestUser,
  RealTestCar
} from '../../data/realTestData';
import { useAuth } from '../../context/AuthContext';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { EXCLUSIVE_ADMIN_EMAIL } from '../../types/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

interface RealDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole?: (role: 'renter' | 'partner' | 'admin') => void;
}

type ModalTab = 'overview' | 'partners' | 'renters';

export const RealDataModal: React.FC<RealDataModalProps> = ({
  isOpen,
  onClose,
  onSwitchRole,
}) => {
  const { user, loginWithMockProfile, loginWithPassword, logout } = useAuth();
  const { isLight } = useAccountSettings();

  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(REAL_TEST_PARTNERS[0].id);
  const [isSeeding, setIsSeeding] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [counts, setCounts] = useState<{
    cars: number;
    bookings: number;
    contracts: number;
    disputes: number;
    messages: number;
    users: number;
    partners: number;
  }>({
    cars: 0,
    bookings: 0,
    contracts: 0,
    disputes: 0,
    messages: 0,
    users: 0,
    partners: 0,
  });

  const refreshCounts = async () => {
    try {
      const live = await getFirestoreDataCounts();
      setCounts(live);
    } catch (e) {
      console.warn('Error fetching counts:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshCounts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSeed = async () => {
    setIsSeeding(true);
    setSuccessMsg(null);
    try {
      const res = await seedAllRealTestDataToFirestore(true);
      setSuccessMsg(`Populated ${res.cars} Vehicles (50 across 10 partners), ${res.partners} Partners, ${res.users} Users, ${res.bookings} Bookings into Firestore!`);
      await refreshCounts();
    } catch (err: any) {
      console.error('Seeding failed:', err);
      setSuccessMsg('Error seeding data. Please check console.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSelectPartner = async (partner: PartnerAgencyInfo) => {
    // Log in as partner agency
    await loginWithPassword(partner.email, 'password123', 'partner');
    if (onSwitchRole) onSwitchRole('partner');
    onClose();
  };

  const handleSelectRenter = async (renter: RealTestUser) => {
    await loginWithPassword(renter.email, 'password123', 'renter');
    if (onSwitchRole) onSwitchRole('renter');
    onClose();
  };

  const handleSelectAdmin = async () => {
    await loginWithPassword(EXCLUSIVE_ADMIN_EMAIL, 'Mayache+1234', 'admin');
    if (onSwitchRole) onSwitchRole('admin');
    onClose();
  };

  const rentersList = REAL_TEST_USERS.filter(u => u.role === 'renter');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#140e0b] text-[#f5efe8] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-[#1e1511] to-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Morocco Real Test Database
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  10 Partners • 50 Vehicles • 10 Users
                </span>
              </div>
              <p className="text-xs text-[#a8988a]">
                Database: <span className="font-mono text-amber-300/90">{firebaseConfig.firestoreDatabaseId || 'ai-studio-airbcar'}</span> • Dahir 2026 Ready
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#8d7e73] hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#16100c] px-4 sm:px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Database Hub ({counts.cars || 50} Cars in DB)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'partners'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>10 Partners (5 Vehicles each)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">10</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('renters')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'renters'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>10 Verified Renters</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-mono">10</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Status Message */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Real Live Database Counts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Live Cloud Firestore Record Counts
                  </h3>
                  <button
                    type="button"
                    onClick={refreshCounts}
                    className="text-[11px] text-[#a8988a] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh Counts</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.cars || 50}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Vehicles (5/Partner)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.partners || 10}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Rental Agencies</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.users || 21}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Users & Renters</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.bookings || 8}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Dahir Bookings</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.contracts || 6}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Digital Contracts</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.disputes || 3}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Mediation Disputes</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{counts.messages || 12}</div>
                      <div className="text-[10px] text-[#8d7e73] font-medium">Chat Records</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1511] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Dahir 2026</div>
                      <div className="text-[10px] text-emerald-400 font-medium">Escrow Hold Active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seed Action Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#1f1712] to-amber-500/5 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Synchronize 10 Users & 10 Partners (5 Vehicles Each)</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      50 Vehicles Total
                    </span>
                  </div>
                  <p className="text-xs text-[#a8988a]">
                    Writes all 10 verified renters, 10 rental agency partners with commercial credentials, and their 5 registered vehicles (50 cars total with authentic Moroccan registration plates) into Cloud Firestore.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isSeeding ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing to Database...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sync All Real Data</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Persona Access */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    Instant Persona Switch
                  </h3>
                  <span className="text-[11px] text-[#8d7e73]">Click to immediately switch role and view real data</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Persona 1: Admin */}
                  <div 
                    onClick={handleSelectAdmin}
                    className="p-3 rounded-2xl bg-[#1c1511] hover:bg-[#251c17] border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                        👑
                      </div>
                      <div className="text-xs font-bold text-white">HQ Superadmin</div>
                    </div>
                    <div className="text-[11px] text-[#8d7e73] truncate">ayacheyassine2000@gmail.com</div>
                    <div className="text-[10px] text-rose-400 mt-1 flex items-center justify-between">
                      <span>Full Admin Control</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Persona 2: Mayache Cars */}
                  <div 
                    onClick={() => handleSelectPartner(REAL_TEST_PARTNERS[0])}
                    className="p-3 rounded-2xl bg-[#1c1511] hover:bg-[#251c17] border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                        🏢
                      </div>
                      <div className="text-xs font-bold text-white">Mayache Prestige</div>
                    </div>
                    <div className="text-[11px] text-[#8d7e73] truncate">partner@mayachecars.ma (Tetouan)</div>
                    <div className="text-[10px] text-amber-400 mt-1 flex items-center justify-between">
                      <span>Partner Fleet (5 Cars)</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Persona 3: Camille Dubois */}
                  <div 
                    onClick={() => handleSelectRenter(rentersList[0])}
                    className="p-3 rounded-2xl bg-[#1c1511] hover:bg-[#251c17] border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        👤
                      </div>
                      <div className="text-xs font-bold text-white">Camille Dubois</div>
                    </div>
                    <div className="text-[11px] text-[#8d7e73] truncate">camille.d@mail.com (CIN L-849201)</div>
                    <div className="text-[10px] text-blue-400 mt-1 flex items-center justify-between">
                      <span>Renter Portal</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 10 PARTNERS & 5 VEHICLES EACH */}
          {activeTab === 'partners' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    10 Certified Moroccan Rental Agencies
                  </h3>
                  <p className="text-xs text-[#8d7e73]">
                    Each partner has exactly 5 verified fleet vehicles listed with authentic Moroccan plates and MAD rates.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Total: 50 Vehicles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Partners List Sidebar */}
                <div className="md:col-span-5 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                  {REAL_TEST_PARTNERS.map((partner, idx) => {
                    const isSelected = selectedPartnerId === partner.id;
                    const partnerCars = REAL_TEST_CARS.filter(c => c.agencyId === partner.id);
                    return (
                      <div
                        key={partner.id}
                        onClick={() => setSelectedPartnerId(partner.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-950/40 border-amber-500/50 shadow-md shadow-amber-950/20'
                            : 'bg-[#18120e] hover:bg-[#201813] border-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white">{partner.agencyName}</div>
                              <div className="text-[11px] text-[#8d7e73] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                <span>{partner.city}</span> • <span>{partner.ownerName}</span>
                              </div>
                            </div>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            {partnerCars.length} Cars
                          </span>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#8d7e73]">
                          <span>Licence: {partner.licenseNumber}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPartner(partner);
                            }}
                            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition-colors"
                          >
                            Log In as Host
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Partner's 5 Vehicles Details */}
                <div className="md:col-span-7 bg-[#18120e] border border-white/10 rounded-2xl p-4 flex flex-col">
                  {(() => {
                    const partner = REAL_TEST_PARTNERS.find(p => p.id === selectedPartnerId) || REAL_TEST_PARTNERS[0];
                    const partnerCars = REAL_TEST_CARS.filter(c => c.agencyId === partner.id);
                    return (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between pb-3 border-b border-white/10">
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{partner.agencyName}</span>
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400">
                                Dahir 2026 Verified
                              </span>
                            </div>
                            <div className="text-xs text-[#a8988a] mt-0.5">
                              {partner.address} • Contact: {partner.phone}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectPartner(partner)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shrink-0"
                          >
                            Access Agency Portal
                          </button>
                        </div>

                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Registered Fleet ({partnerCars.length} Vehicles):
                        </div>

                        <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                          {partnerCars.map((car, cIdx) => (
                            <div 
                              key={car.id}
                              className="p-2.5 rounded-xl bg-[#201813] border border-white/5 flex items-center justify-between gap-3 hover:border-amber-500/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <img 
                                  src={car.imageUrl} 
                                  alt={car.name} 
                                  className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                                />
                                <div>
                                  <div className="text-xs font-bold text-white">{car.name}</div>
                                  <div className="text-[11px] text-[#8d7e73] flex items-center gap-2 mt-0.5">
                                    <span className="font-mono text-amber-300 font-bold px-1 rounded bg-black/40 text-[10px]">
                                      {car.plate}
                                    </span>
                                    <span>•</span>
                                    <span className="capitalize">{car.category}</span>
                                    <span>•</span>
                                    <span className="capitalize">{car.transmission}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="text-xs font-black text-emerald-400">
                                  {car.dailyRate} MAD<span className="text-[10px] text-[#8d7e73]">/day</span>
                                </div>
                                <div className="text-[10px] text-[#8d7e73]">
                                  Deposit: {car.depositAmount} MAD
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 10 VERIFIED RENTERS */}
          {activeTab === 'renters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    10 Verified Test Renters & Drivers
                  </h3>
                  <p className="text-xs text-[#8d7e73]">
                    Includes authentic Moroccan CIN, biometric driver licences, and international traveler identities.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  10 Renters + 1 Admin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                {rentersList.map((renter, idx) => (
                  <div 
                    key={renter.uid}
                    className="p-3.5 rounded-2xl bg-[#18120e] hover:bg-[#201813] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={renter.avatar} 
                            alt={renter.name} 
                            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{renter.name}</div>
                            <div className="text-[11px] text-[#8d7e73]">{renter.email}</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/30 p-2 rounded-xl border border-white/5 mb-2">
                        <div>
                          <span className="text-[#8d7e73]">CIN/Passport:</span>{' '}
                          <span className="text-white font-mono font-bold">{renter.cin}</span>
                        </div>
                        <div>
                          <span className="text-[#8d7e73]">Licence:</span>{' '}
                          <span className="text-white font-mono">{renter.drivingLicenceNumber}</span>
                        </div>
                        <div>
                          <span className="text-[#8d7e73]">Phone:</span>{' '}
                          <span className="text-white">{renter.phone}</span>
                        </div>
                        <div>
                          <span className="text-[#8d7e73]">City:</span>{' '}
                          <span className="text-white">{renter.city}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#a8988a] line-clamp-2">
                        {renter.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Dahir 2026 Identity Checked
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectRenter(renter)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Log In</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#160f0c] flex items-center justify-between text-xs text-[#8d7e73]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>10 Partners • 50 Fleet Vehicles (5 per Partner) • 10 Verified Renters • Dahir 2026 Escrow</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
