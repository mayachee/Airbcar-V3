import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Key, 
  Sparkles, 
  UserCheck, 
  Building2, 
  ShieldAlert,
  HelpCircle,
  Car
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEV_APP_URL, SHARED_APP_URL } from '../../services/oauth';
import { AuthPageView } from './AuthPageView';

interface OAuthModalProps {
  onSwitchRole?: (role: 'renter' | 'partner' | 'admin') => void;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({ onSwitchRole }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogle,
    loginWithDemo,
    authError,
    googleClientId,
    setGoogleClientId,
    redirectUri,
    isLoading,
    authModalMode,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'setup'>(authModalMode === 'setup' ? 'setup' : 'signin');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [customInputId, setCustomInputId] = useState(googleClientId);
  const [selectedRole, setSelectedRole] = useState<'renter' | 'partner' | 'admin'>('renter');

  if (!isAuthModalOpen) return null;

  // Render Full Scenic Moroccan Auth Page for standard signin / signup / verification
  if (activeTab !== 'setup') {
    return (
      <AuthPageView
        initialMode={
          authModalMode === 'signup'
            ? 'signup'
            : authModalMode === 'otp'
            ? 'otp'
            : 'signin'
        }
        initialRole={selectedRole === 'partner' ? 'partner' : 'renter'}
        onClose={closeAuthModal}
        onSuccessRole={onSwitchRole}
        onOpenSetup={() => setActiveTab('setup')}
      />
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleClientId(customInputId.trim());
    setCopiedItem('saved-id');
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const devCallback = `${DEV_APP_URL}/auth/callback`;
  const sharedCallback = `${SHARED_APP_URL}/auth/callback`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1a1412] text-[#f5efe8] border border-[#382b21] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#2c2019] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Airbcar OAuth Setup
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2a1e17] text-[#f95721] border border-[#f95721]/20">
                  Google Cloud
                </span>
              </h3>
              <p className="text-xs text-[#a8988a]">OAuth 2.0 Credentials & Redirect URI Management</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-[#a8988a] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2c2019] px-6 bg-[#150f0e]">
          <button
            onClick={() => setActiveTab('signin')}
            className="py-2.5 px-3 text-xs font-semibold border-b-2 border-transparent text-[#8d7e73] hover:text-white transition-all cursor-pointer"
          >
            ← Return to Sign In Page
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className="py-2.5 px-3 text-xs font-semibold border-b-2 border-[#f95721] text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            Google Cloud Setup
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block text-amber-300">Sign-in Notice:</span>
                <p className="text-amber-200/90 mt-0.5">{authError}</p>
              </div>
            </div>
            <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-amber-800/40 text-[11px]">
              <span className="text-amber-300/80">Need instant testing access?</span>
              <button
                type="button"
                onClick={() => {
                  loginWithDemo(selectedRole);
                  if (onSwitchRole) onSwitchRole(selectedRole);
                }}
                className="font-bold text-[#f95721] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Connect with 1-Click Profile</span>
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          {activeTab === 'signin' ? (
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="text-xs font-medium text-[#c9b8ab] block mb-2">Select Account Role:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('renter')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'renter'
                        ? 'bg-[#f95721]/15 border-[#f95721] text-white font-bold'
                        : 'bg-[#221a16] border-[#382b21] text-[#a8988a] hover:bg-[#2c2019]'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs block">Renter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('partner')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'partner'
                        ? 'bg-[#f95721]/15 border-[#f95721] text-white font-bold'
                        : 'bg-[#221a16] border-[#382b21] text-[#a8988a] hover:bg-[#2c2019]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <span className="text-xs block">Agency Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'bg-[#f95721]/15 border-[#f95721] text-white font-bold'
                        : 'bg-[#221a16] border-[#382b21] text-[#a8988a] hover:bg-[#2c2019]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <span className="text-xs block">HQ Admin</span>
                  </button>
                </div>
              </div>

              {/* Primary: Google OAuth Sign-In Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    const ok = await loginWithGoogle();
                    if (ok && onSwitchRole) {
                      onSwitchRole(selectedRole);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  {isLoading ? 'Opening OAuth Window...' : 'Continue with Google'}
                </button>
              </div>

              {/* Instant Verified Account Option (Zero-Config Test) */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#291b15] to-[#201712] border border-[#453428] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f95721]" />
                    <span className="text-xs font-bold text-white">Instant Google Account (1-Click)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-[#b3a294] leading-relaxed">
                  Sign in immediately with Google ID profile (<span className="text-white font-mono">ayacheyassine2000@gmail.com</span>) to test verified traveler booking and Dahir 2026 contract signing without waiting for Google Console verification.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    loginWithDemo(selectedRole);
                    if (onSwitchRole) onSwitchRole(selectedRole);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#f95721] hover:bg-[#ff6938] text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Connect as {selectedRole === 'partner' ? 'Mayache Prestige Cars' : selectedRole === 'admin' ? 'HQ Admin' : 'Traveler'}
                </button>
              </div>
            </div>
          ) : (
            /* Setup Guide for Google Cloud Console */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#221915] border border-[#382b21] text-xs space-y-1">
                <span className="text-[#f95721] font-bold block">Google OAuth Provider Credentials</span>
                <p className="text-[#a8988a]">
                  To connect your real Google Project, register OAuth 2.0 Web Client credentials in Google Cloud Console.
                </p>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#f95721] hover:underline pt-1 text-xs font-semibold"
                >
                  Open Google Cloud Console <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Exact Origins & Redirect URIs */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#c9b8ab] block mb-1">
                    1. Authorized JavaScript Origins:
                  </label>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#110c0a] border border-[#2a1e17] text-xs">
                      <div className="truncate mr-2 font-mono text-[11px] text-[#e0d6cd]">
                        {DEV_APP_URL}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(DEV_APP_URL, 'dev-origin')}
                        className="px-2 py-1 rounded bg-[#2c2019] hover:bg-[#382b21] text-[#f95721] flex items-center gap-1 text-[11px] shrink-0 cursor-pointer"
                      >
                        {copiedItem === 'dev-origin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedItem === 'dev-origin' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#110c0a] border border-[#2a1e17] text-xs">
                      <div className="truncate mr-2 font-mono text-[11px] text-[#e0d6cd]">
                        {SHARED_APP_URL}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(SHARED_APP_URL, 'shared-origin')}
                        className="px-2 py-1 rounded bg-[#2c2019] hover:bg-[#382b21] text-[#f95721] flex items-center gap-1 text-[11px] shrink-0 cursor-pointer"
                      >
                        {copiedItem === 'shared-origin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedItem === 'shared-origin' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9b8ab] block mb-1">
                    2. Authorized Redirect URIs:
                  </label>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#110c0a] border border-[#2a1e17] text-xs">
                      <div className="truncate mr-2 font-mono text-[11px] text-[#e0d6cd]">
                        {devCallback}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(devCallback, 'dev-uri')}
                        className="px-2 py-1 rounded bg-[#2c2019] hover:bg-[#382b21] text-[#f95721] flex items-center gap-1 text-[11px] shrink-0 cursor-pointer"
                      >
                        {copiedItem === 'dev-uri' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedItem === 'dev-uri' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#110c0a] border border-[#2a1e17] text-xs">
                      <div className="truncate mr-2 font-mono text-[11px] text-[#e0d6cd]">
                        {sharedCallback}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(sharedCallback, 'shared-uri')}
                        className="px-2 py-1 rounded bg-[#2c2019] hover:bg-[#382b21] text-[#f95721] flex items-center gap-1 text-[11px] shrink-0 cursor-pointer"
                      >
                        {copiedItem === 'shared-uri' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedItem === 'shared-uri' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Google Client ID Input */}
              <form onSubmit={handleSaveClientId} className="space-y-2">
                <label className="text-xs font-semibold text-[#c9b8ab] block">
                  3. Paste Your Client ID here (or set VITE_GOOGLE_CLIENT_ID in AI Studio Settings):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                    value={customInputId}
                    onChange={(e) => setCustomInputId(e.target.value)}
                    className="flex-1 bg-[#150f0e] border border-[#382b21] focus:border-[#f95721] rounded-xl px-3 py-2 text-xs text-white placeholder-[#68574c] outline-hidden font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#f95721] hover:bg-[#ff6938] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {copiedItem === 'saved-id' ? 'Saved!' : 'Save'}
                  </button>
                </div>
                <p className="text-[10px] text-[#8d7e73]">
                  Stored safely in local browser storage or configured via <code className="text-[#f95721]">VITE_GOOGLE_CLIENT_ID</code>.
                </p>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#130d0b] border-t border-[#261b15] flex items-center justify-between text-[11px] text-[#7d6e64]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            256-bit Encrypted Token Exchange
          </span>
          <span>Dahir 2026 Verified</span>
        </div>

      </div>
    </div>
  );
};
