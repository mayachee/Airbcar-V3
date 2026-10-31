import React, { useState } from 'react';
import { Building2, Lock, ArrowRight, ShieldCheck, Sparkles, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PartnerAuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PartnerAuthGateModal: React.FC<PartnerAuthGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithPassword, loginWithDemo, isLoading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter your partner agency email and password.');
      return;
    }

    const success = await loginWithPassword(email, password, 'partner');
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handle1ClickAgency = () => {
    loginWithDemo('partner');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#181310] text-[#f5efe8] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8d7e73] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Partner Agency Portal</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Partner Role Required
              </span>
            </div>
            <p className="text-xs text-[#a8988a] mt-0.5">
              Verified Fleet Owners &amp; Rental Agencies in Morocco
            </p>
          </div>
        </div>

        {/* Requirement Notice */}
        <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Agency Authentication Protected</strong>
            The partner dashboard is not public. You must sign in with a registered partner account or verified agency profile to access fleet management, bookings, and telematics.
          </div>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>{localError || authError}</p>
          </div>
        )}

        {/* Partner Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8988a] mb-1.5">
              Partner Agency Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agency@atlasrent.ma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#241a14] border border-[#3e2c22] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8988a] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#241a14] border border-[#3e2c22] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-neutral-950" />
            <span>{isLoading ? 'Verifying Partner Role...' : 'Sign In as Partner'}</span>
          </button>
        </form>

        {/* Quick Demo Partner Verification Option */}
        <div className="mt-5 pt-4 border-t border-[#2e2017] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a8988a]">
            <span>Need instant access for testing?</span>
          </div>
          <button
            type="button"
            onClick={handle1ClickAgency}
            className="w-full py-2.5 px-3 rounded-xl bg-[#251d18] hover:bg-[#30251f] border border-[#3e2f25] text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Connect as Atlas Rent Partner (1-Click)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto text-[#736357]" />
          </button>
        </div>
      </div>
    </div>
  );
};
