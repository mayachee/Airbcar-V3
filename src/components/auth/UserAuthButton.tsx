import React, { useState, useRef, useEffect } from 'react';
import { 
  LogOut, 
  ShieldCheck, 
  Settings, 
  Car, 
  Building2, 
  ChevronDown, 
  User, 
  ExternalLink,
  Key,
  Sparkles,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MockProfileKey, EXCLUSIVE_ADMIN_EMAIL } from '../../types/auth';
import { AdminAuthGateModal } from '../admin/AdminAuthGateModal';
import { Lock } from 'lucide-react';

interface UserAuthButtonProps {
  currentRole: 'renter' | 'partner' | 'admin';
  onSwitchRole: (role: 'renter' | 'partner' | 'admin') => void;
  onNavigateTab?: (tab: string) => void;
}

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({
  currentRole,
  onSwitchRole,
  onNavigateTab,
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, loginWithMockProfile, mockProfiles } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickLoginOpen, setQuickLoginOpen] = useState(false);
  const [isAdminGateOpen, setIsAdminGateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickLoginRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (quickLoginRef.current && !quickLoginRef.current.contains(event.target as Node)) {
        setQuickLoginOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="relative flex items-center gap-1.5" ref={quickLoginRef}>
        <button
          onClick={() => openAuthModal('signin')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer border border-white/20 group"
          title="Sign in with Google OAuth or Mock Profile"
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

        {/* Quick Mock Profile Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setQuickLoginOpen(!quickLoginOpen)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title="Quick Instant Mock Profiles"
        >
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${quickLoginOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Mock Profile Menu */}
        {quickLoginOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1412] text-[#f5efe8] border border-[#382b21] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8d7e73] flex items-center justify-between border-b border-[#2c2019] mb-1">
              <span>Instant Mock Profiles</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            
            {mockProfiles.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  loginWithMockProfile(p.key);
                  onSwitchRole(p.role);
                  setQuickLoginOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white group-hover:text-[#f95721] transition-colors truncate">
                      {p.name}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-mono">
                      {p.roleLabel.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#a8988a] truncate">{p.badge}</p>
                </div>
              </button>
            ))}

            <div className="pt-2 mt-1 border-t border-[#2c2019]">
              <button
                type="button"
                onClick={() => {
                  setQuickLoginOpen(false);
                  openAuthModal('signin');
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#f95721] hover:bg-[#e04a17] text-white font-bold text-center transition-all cursor-pointer"
              >
                Open Full Authentication Page
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const roleLabel = {
    renter: 'Traveler',
    partner: 'Fleet Partner',
    admin: 'HQ Admin',
  }[currentRole];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-white cursor-pointer group"
      >
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
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
        <div className="text-left hidden sm:block">
          <span className="text-xs font-semibold leading-none block group-hover:text-[#f95721] transition-colors">
            Profile
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#1a1412] text-[#f5efe8] border border-[#382b21] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* User Overview */}
          <div className="p-4 border-b border-[#2c2019] bg-[#140e0c]">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
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
                  <span>{user.provider === 'google' ? 'Google OAuth Active' : 'Connected to Mock Profile'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Switch Active Role */}
          <div className="p-2 space-y-1 text-xs border-b border-[#2c2019]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8d7e73] px-3 py-1">
              Active Dashboard
            </div>
            <button
              onClick={() => {
                onSwitchRole('renter');
                if (onNavigateTab) onNavigateTab('overview');
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentRole === 'renter' ? 'bg-[#f95721]/15 text-[#f95721] font-bold' : 'hover:bg-white/5 text-[#c9b8ab]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Traveler Trips & Bookings
              </span>
              {currentRole === 'renter' && <span className="text-[10px] font-mono">ACTIVE</span>}
            </button>

            <button
              onClick={() => {
                onSwitchRole('partner');
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentRole === 'partner' ? 'bg-[#f95721]/15 text-[#f95721] font-bold' : 'hover:bg-white/5 text-[#c9b8ab]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Agency Partner Portal
              </span>
              {currentRole === 'partner' && <span className="text-[10px] font-mono">ACTIVE</span>}
            </button>

            <button
              onClick={() => {
                if (isAdmin) {
                  onSwitchRole('admin');
                  setDropdownOpen(false);
                } else {
                  setDropdownOpen(false);
                  setIsAdminGateOpen(true);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentRole === 'admin' ? 'bg-[#f95721]/15 text-[#f95721] font-bold' : 'hover:bg-white/5 text-[#c9b8ab]'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Morocco HQ Admin
              </span>
              {currentRole === 'admin' ? (
                <span className="text-[10px] font-mono">ACTIVE</span>
              ) : !isAdmin ? (
                <Lock className="w-3.5 h-3.5 text-rose-400" />
              ) : null}
            </button>
          </div>

          {/* Quick Mock Profile Switcher */}
          <div className="p-2 space-y-1 text-xs border-b border-[#2c2019]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8d7e73] px-3 py-1 flex items-center justify-between">
              <span>Switch Mock Identity</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            {mockProfiles.slice(0, 2).map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  loginWithMockProfile(p.key);
                  onSwitchRole(p.role);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-colors cursor-pointer ${
                  user.email === p.email ? 'bg-white/10 text-white font-bold' : 'hover:bg-white/5 text-[#a8988a]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate">{p.name}</span>
                </div>
                {user.email === p.email && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Configuration & Sign out */}
          <div className="p-2 space-y-1 text-xs">
            <button
              onClick={() => {
                openAuthModal('setup');
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-[#a8988a] hover:text-white transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>OAuth Settings & Redirect URIs</span>
            </button>

            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-red-950/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}

      {/* Strict Admin Authentication Gate Modal */}
      <AdminAuthGateModal
        isOpen={isAdminGateOpen}
        onClose={() => setIsAdminGateOpen(false)}
        onSuccess={() => onSwitchRole('admin')}
      />
    </div>
  );
};

