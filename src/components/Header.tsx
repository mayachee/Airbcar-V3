import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Menu, X, ShieldCheck, LogOut, Sparkles, Car, Building2, Key, Lock, Database } from 'lucide-react';
import { ActiveTab } from '../types';
import { NotificationBell } from './notifications/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { AdminAuthGateModal } from './admin/AdminAuthGateModal';
import { PartnerAuthGateModal } from './partner/PartnerAuthGateModal';
import { RealDataModal } from './common/RealDataModal';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userName: string;
  userAvatar?: string;
  onSwitchRole?: (role: 'partner' | 'renter' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, userName, userAvatar, onSwitchRole }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAdminGateOpen, setIsAdminGateOpen] = useState(false);
  const [isPartnerGateOpen, setIsPartnerGateOpen] = useState(false);
  const [isRealDataModalOpen, setIsRealDataModalOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isAdmin, isPartner, openAuthModal, logout } = useAuth();

  const displayAvatar = user?.avatar || userAvatar;

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="w-full bg-[#181311] border-b border-white/10 px-4 sm:px-8 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-10">
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-1.5 focus:outline-none group text-left"
          >
            <span className="font-serif-display font-extrabold text-2xl tracking-tight text-white group-hover:text-amber-100 transition-colors">
              airbcar
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f95721] self-end mb-1.5"></span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-neutral-300">
            <button 
              onClick={() => setActiveTab('rent')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'rent' ? 'text-white font-bold border-b-2 border-[#f95721] pb-1' : ''}`}
            >
              Rent
            </button>
            <button 
              onClick={() => setActiveTab('search')} 
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'search' || activeTab === 'car-detail' ? 'text-white font-bold border-b-2 border-[#f95721] pb-1' : ''}`}
            >
              <span>Search</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#f95721] text-white text-[10px] font-bold">MAP</span>
            </button>
            <button 
              onClick={() => setActiveTab('partner')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'partner' || activeTab === 'partner-profile' ? 'text-white font-bold border-b-2 border-[#f95721] pb-1' : ''}`}
            >
              Partner
            </button>
            <button 
              onClick={() => setActiveTab('mission')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'mission' ? 'text-white font-bold border-b-2 border-[#f95721] pb-1' : ''}`}
            >
              Mission
            </button>
            <button 
              onClick={() => setActiveTab('help')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'help' ? 'text-white font-bold border-b-2 border-[#f95721] pb-1' : ''}`}
            >
              Help &amp; FAQ
            </button>
          </nav>
        </div>

        {/* Right: Currency/Language & User Avatar */}
        <div className="flex items-center gap-3.5">
          {/* Currency / Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>EN · MAD</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
            {langDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-[#241c19] border border-white/15 rounded-xl shadow-xl py-1 text-xs text-neutral-200 z-50">
                <button 
                  onClick={() => setLangDropdown(false)} 
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between"
                >
                  <span>English (EN)</span>
                  <span className="text-amber-400 font-semibold">MAD</span>
                </button>
                <button 
                  onClick={() => setLangDropdown(false)} 
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between"
                >
                  <span>Français (FR)</span>
                  <span className="text-neutral-400">EUR</span>
                </button>
                <button 
                  onClick={() => setLangDropdown(false)} 
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between"
                >
                  <span>العربية (AR)</span>
                  <span className="text-neutral-400">MAD</span>
                </button>
              </div>
            )}
          </div>

          {/* Switch to Partner / Admin Portals */}
          {onSwitchRole && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isAdmin) {
                    onSwitchRole('admin');
                  } else {
                    setIsAdminGateOpen(true);
                  }
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                title={isAdmin ? "Open HQ Admin Dashboard" : "Restricted: Requires Admin Authentication"}
              >
                <span>🛡️ Admin</span>
                {!isAdmin && <Lock className="w-3 h-3 text-rose-200" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPartner) {
                    onSwitchRole('partner');
                  } else {
                    setIsPartnerGateOpen(true);
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-all border border-white/10 active:scale-95 cursor-pointer"
                title={isPartner ? "Open Partner Portal" : "Restricted: Partner Role Required"}
              >
                <span>🏢 Agency Portal</span>
                {!isPartner && <Lock className="w-3 h-3 text-amber-300/80" />}
              </button>
              <button
                type="button"
                onClick={() => setIsRealDataModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Real Moroccan Test Data & Database Hub"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Real Data</span>
              </button>
            </div>
          )}

          {/* Notification Bell */}
          <NotificationBell 
            currentRole="renter" 
            isLight={false} 
            onNavigateTab={setActiveTab} 
          />

          {/* Conditional OAuth Auth: 'Profile' button with avatar when logged in, 'Sign In' button when logged out */}
          {!isAuthenticated || !user ? (
            <button
              id="header-signin-btn"
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer border border-white/20 group"
              title="Sign in with Google OAuth"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="group-hover:text-[#f95721] transition-colors">Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={profileDropdownRef}>
              <button
                id="header-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-white cursor-pointer group active:scale-95"
                title={`${user.name} - View Profile`}
              >
                <div className="relative">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#f95721] text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {user.verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-neutral-900 flex items-center justify-center text-[7px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold group-hover:text-[#f95721] transition-colors">
                  Profile
                </span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#1a1412] text-[#f5efe8] border border-[#382b21] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  {/* User Overview */}
                  <div className="p-4 border-b border-[#2c2019] bg-[#140e0c]">
                    <div className="flex items-center gap-3">
                      {displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#f95721]/30"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#f95721] text-white flex items-center justify-center text-sm font-bold">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-white truncate">{user.name}</p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#a8988a] truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#f95721]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Google OAuth Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-2 space-y-1 border-b border-[#2c2019]">
                    <button
                      onClick={() => {
                        setActiveTab('overview');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-[#c9b8ab] hover:text-white transition-colors cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-[#f95721]" />
                      <span>My Trips &amp; Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('contracts');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-[#c9b8ab] hover:text-white transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Contracts &amp; Signatures</span>
                    </button>
                    {onSwitchRole && (
                      <button
                        onClick={() => {
                          onSwitchRole('partner');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-[#c9b8ab] hover:text-white transition-colors cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span>Agency Partner Portal</span>
                      </button>
                    )}
                  </div>

                  {/* Configuration & Sign out */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        openAuthModal('setup');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-[#a8988a] hover:text-white transition-colors cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>OAuth Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-red-950/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 text-sm text-neutral-300">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 pt-1">
            Main Pages
          </div>
          <button 
            onClick={() => { setActiveTab('rent'); setMobileMenuOpen(false); }}
            className={`px-3 py-2 rounded-lg text-left ${activeTab === 'rent' ? 'bg-[#f95721] text-white font-medium' : ''}`}
          >
            Rent
          </button>
          <button 
            onClick={() => { setActiveTab('search'); setMobileMenuOpen(false); }}
            className={`px-3 py-2 rounded-lg text-left flex items-center justify-between ${activeTab === 'search' || activeTab === 'car-detail' ? 'bg-[#f95721] text-white font-medium' : ''}`}
          >
            <span>Search Cars (Map)</span>
            <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">Tetouan</span>
          </button>
          <button 
            onClick={() => { setActiveTab('partner'); setMobileMenuOpen(false); }}
            className={`px-3 py-2 rounded-lg text-left ${activeTab === 'partner' ? 'bg-[#f95721] text-white font-medium' : ''}`}
          >
            Partner
          </button>
          <button 
            onClick={() => { setActiveTab('mission'); setMobileMenuOpen(false); }}
            className={`px-3 py-2 rounded-lg text-left ${activeTab === 'mission' ? 'bg-[#f95721] text-white font-medium' : ''}`}
          >
            Mission
          </button>
          <button 
            onClick={() => { setActiveTab('help'); setMobileMenuOpen(false); }}
            className={`px-3 py-2 rounded-lg text-left ${activeTab === 'help' ? 'bg-[#f95721] text-white font-medium' : ''}`}
          >
            Help &amp; FAQ
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 pt-3 border-t border-white/10">
            Account &amp; Security
          </div>

          {!isAuthenticated || !user ? (
            <div className="px-3 py-1 space-y-2">
              <button
                onClick={() => {
                  openAuthModal('signin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign In with Google</span>
              </button>
            </div>
          ) : (
            <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/10 mx-2 space-y-2">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#f95721] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white text-xs truncate">{user.name}</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-950/60 font-semibold text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <button 
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className="px-3 py-2 rounded-lg text-left text-neutral-300 hover:text-white"
          >
            My Trips &amp; Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('contracts'); setMobileMenuOpen(false); }}
            className="px-3 py-2 rounded-lg text-left text-neutral-300 hover:text-white"
          >
            Contracts &amp; Signatures
          </button>
          <button 
            onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }}
            className="px-3 py-2 rounded-lg text-left text-neutral-300 hover:text-white"
          >
            Messages
          </button>
          {onSwitchRole && (
            <>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isPartner) {
                    onSwitchRole('partner');
                  } else {
                    setIsPartnerGateOpen(true);
                  }
                }}
                className="px-3 py-2 rounded-lg text-left text-amber-400 font-medium flex items-center justify-between cursor-pointer"
              >
                <span>🏢 Open Partner Portal</span>
                {!isPartner && <Lock className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdmin) {
                    onSwitchRole('admin');
                  } else {
                    setIsAdminGateOpen(true);
                  }
                }}
                className="px-3 py-2 rounded-lg text-left text-rose-400 font-medium flex items-center justify-between cursor-pointer"
              >
                <span>🛡️ Open HQ Admin</span>
                {!isAdmin && <Lock className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            </>
          )}
        </div>
      )}

      {/* Admin Auth Gate Modal */}
      <AdminAuthGateModal
        isOpen={isAdminGateOpen}
        onClose={() => setIsAdminGateOpen(false)}
        onSuccess={() => onSwitchRole && onSwitchRole('admin')}
      />

      {/* Partner Auth Gate Modal */}
      <PartnerAuthGateModal
        isOpen={isPartnerGateOpen}
        onClose={() => setIsPartnerGateOpen(false)}
        onSuccess={() => onSwitchRole && onSwitchRole('partner')}
      />

      {/* Real Moroccan Test Data Hub Modal */}
      <RealDataModal
        isOpen={isRealDataModalOpen}
        onClose={() => setIsRealDataModalOpen(false)}
        onSwitchRole={onSwitchRole}
      />
    </header>
  );
};
