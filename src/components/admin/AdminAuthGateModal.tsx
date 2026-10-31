import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EXCLUSIVE_ADMIN_EMAIL, EXCLUSIVE_ADMIN_PASSWORD } from '../../types/auth';

interface AdminAuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthGateModal: React.FC<AdminAuthGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithPassword, isLoading, authError } = useAuth();
  const [email, setEmail] = useState(EXCLUSIVE_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim()) {
      setLocalError(`Access Restricted: Only ${EXCLUSIVE_ADMIN_EMAIL} is authorized for administrative privileges.`);
      return;
    }

    if (password !== EXCLUSIVE_ADMIN_PASSWORD) {
      setLocalError('Invalid administrative password. Access denied.');
      return;
    }

    const success = await loginWithPassword(normalizedEmail, password, 'admin');
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const fillDefaultAdminCredentials = () => {
    setEmail(EXCLUSIVE_ADMIN_EMAIL);
    setPassword(EXCLUSIVE_ADMIN_PASSWORD);
    setLocalError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#18120e] text-[#f5efe8] border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8d7e73] hover:text-white rounded-full hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">HQ Admin Verification</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Restricted
              </span>
            </div>
            <p className="text-xs text-[#a8988a] mt-0.5">
              Kingdom of Morocco • Platform Governance &amp; Dahir 2026 Registry
            </p>
          </div>
        </div>

        {/* Policy notice */}
        <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200/90 leading-relaxed flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Sole Administrator Policy</strong>
            Access to this console is strictly restricted to the authorized master account: <code className="bg-rose-900/60 px-1 py-0.5 rounded text-[11px] font-mono text-rose-100">{EXCLUSIVE_ADMIN_EMAIL}</code>.
          </div>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>{localError || authError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8988a] mb-1.5">
              Authorized Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={EXCLUSIVE_ADMIN_EMAIL}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#241a14] border border-[#3e2c22] text-sm text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8988a] mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#241a14] border border-[#3e2c22] text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d7e73] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Unlock Admin Portal'}</span>
          </button>
        </form>

        {/* Quick Autofill Helper for Authorized Admin */}
        <div className="mt-5 pt-4 border-t border-[#2e2017] flex items-center justify-between text-xs text-[#8d7e73]">
          <span>Authorized account preset:</span>
          <button
            type="button"
            onClick={fillDefaultAdminCredentials}
            className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fill Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
