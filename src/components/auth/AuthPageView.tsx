import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Mail, 
  Car, 
  Building2, 
  Check, 
  Sparkles,
  ArrowLeft,
  Star,
  MapPin,
  Key,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EXCLUSIVE_ADMIN_EMAIL, EXCLUSIVE_ADMIN_PASSWORD } from '../../types/auth';

interface AuthPageViewProps {
  initialMode?: 'signin' | 'signup' | 'otp';
  initialRole?: 'renter' | 'partner';
  onClose: () => void;
  onSuccessRole?: (role: 'renter' | 'partner' | 'admin') => void;
  onOpenSetup?: () => void;
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({
  initialMode = 'signin',
  initialRole = 'renter',
  onClose,
  onSuccessRole,
  onOpenSetup,
}) => {
  const { user, loginWithGoogle, loginWithDemo, loginWithPassword, isLoading, authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  // Layout Variant: 'a' (Split) vs 'b' (Card)
  const [layoutVariant, setLayoutVariant] = useState<'a' | 'b'>('a');

  // Account Type: 'traveller' vs 'partner'
  const [acctType, setAcctType] = useState<'traveller' | 'partner'>(
    initialRole === 'partner' ? 'partner' : 'traveller'
  );

  // Auth Mode: 'signin' | 'signup' | 'otp'
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>(initialMode);

  // Input Method: 'email' | 'phone'
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('6 12 34 56 78');
  const [otpDigits, setOtpDigits] = useState(['4', '2', '8', '', '', '']);
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [resendTimer, setResendTimer] = useState(42);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (mode === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    // Auto-advance focus to next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const isAdminEmail = normalizedEmail === EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim();

    // If user enters admin email
    if (isAdminEmail) {
      if (password !== EXCLUSIVE_ADMIN_PASSWORD) {
        setFormError('Invalid administrator credentials. Access to Airbcar HQ is strictly protected.');
        return;
      }
      const success = await loginWithPassword(normalizedEmail, password, 'admin');
      if (success) {
        if (onSuccessRole) onSuccessRole('admin');
        onClose();
      }
      return;
    }

    // If regular password login / sign up
    if (method === 'email' && email && password) {
      const assignedRole = acctType === 'partner' ? 'partner' : 'renter';
      const success = await loginWithPassword(email, password, assignedRole, {
        name: fullName.trim() || undefined,
        phone: phone ? (phone.startsWith('+212') ? phone : `+212 ${phone}`) : undefined,
        agencyName: acctType === 'partner' ? (agencyName.trim() || 'Morocco Partner Fleet') : undefined,
      });
      if (success) {
        if (onSuccessRole) onSuccessRole(assignedRole);
        onClose();
      }
      return;
    }

    const assignedRole = acctType === 'partner' ? 'partner' : 'renter';
    loginWithDemo(assignedRole);
    if (onSuccessRole) onSuccessRole(assignedRole);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${layoutVariant === 'b' ? 'bg-[#0a0503]' : 'bg-[#F7F4EE]'} text-[#1a1412] font-sans antialiased transition-colors duration-500`}>
      
      {/* Background Starry Sky for Variant B */}
      {layoutVariant === 'b' && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,#1f1810_0%,#0e0905_60%,#050302_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20%_30%,#fff,transparent),radial-gradient(1px_1px_at_70%_70%,rgba(255,255,255,0.6),transparent),radial-gradient(2px_2px_at_40%_50%,rgba(201,163,91,0.7),transparent)] bg-[size:600px_600px]" />
          <div className="absolute left-0 right-0 bottom-0 h-[50vh] bg-[radial-gradient(ellipse_at_50%_100%,rgba(249,87,33,0.25)_0%,transparent_60%)]" />
        </div>
      )}

      {/* Top Header Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 bg-transparent ${layoutVariant === 'b' ? 'text-white' : 'text-[#1a1412]'}`}>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold tracking-wide hover:text-[#f95721] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Fleet</span>
          </button>
          <span className="font-['Fraunces'] font-bold text-2xl tracking-tighter text-[#f95721]">
            airbcar
          </span>
        </div>

        {/* Layout Variant Switcher & Quick Auth Toggle */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center p-1 rounded-full border ${layoutVariant === 'b' ? 'bg-[#18110e] border-[#382b21]' : 'bg-[#e8e2d8] border-[#d8d0c2]'}`}>
            <span className="text-[10px] uppercase font-mono font-bold px-2 text-[#8d7e73]">Layout</span>
            <button
              type="button"
              onClick={() => setLayoutVariant('a')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                layoutVariant === 'a'
                  ? 'bg-[#1a1412] text-white shadow-xs'
                  : 'text-[#8d7e73] hover:text-[#1a1412]'
              }`}
            >
              A · Split
            </button>
            <button
              type="button"
              onClick={() => setLayoutVariant('b')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                layoutVariant === 'b'
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : 'text-[#8d7e73] hover:text-white'
              }`}
            >
              B · Card
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-[#8d7e73]">
            <span>EN · MAD</span>
            <span className="opacity-40">·</span>
            <span>
              {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className={`ml-1.5 font-bold underline underline-offset-4 hover:text-[#f95721] cursor-pointer ${layoutVariant === 'b' ? 'text-white' : 'text-[#1a1412]'}`}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Stage */}
      <div className={`min-h-screen relative z-10 ${layoutVariant === 'a' ? 'grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]' : 'max-w-xl mx-auto pt-24 pb-16 px-4'}`}>
        
        {/* ===================== FORM PANE ===================== */}
        <div className={`flex flex-col justify-center px-6 sm:px-14 lg:px-20 pt-28 pb-12 ${layoutVariant === 'b' ? 'bg-[#F7F4EE] rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10' : ''}`}>
          <div className="w-full max-w-md mx-auto">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f95721] font-bold mb-4">
              <span className="w-6 h-[2px] bg-[#f95721]" />
              <span>
                {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Verify code'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Fraunces'] font-medium text-4xl sm:text-5xl tracking-tight leading-[1.05] text-[#1a1412] mb-3">
              {mode === 'signin' ? (
                <>Welcome <em className="italic text-[#f95721] font-normal">back</em>.<br />The road awaits.</>
              ) : mode === 'signup' ? (
                <>Pick the <em className="italic text-[#f95721] font-normal">door</em>.<br />Morocco is open.</>
              ) : (
                <>Just a <em className="italic text-[#f95721] font-normal">quick</em><br />verification check.</>
              )}
            </h1>

            <p className="text-sm text-[#736357] mb-7 leading-relaxed">
              {acctType === 'traveller' ? (
                <>
                  Sign in to your <strong className="text-[#1a1412] font-semibold">traveller</strong> account. Or{' '}
                  <button
                    type="button"
                    onClick={() => setAcctType('partner')}
                    className="font-semibold text-[#1a1412] underline decoration-[#f95721] decoration-2 underline-offset-4 hover:text-[#f95721] cursor-pointer"
                  >
                    switch to partner
                  </button>{' '}
                  if you operate a rental fleet.
                </>
              ) : (
                <>
                  Sign in to your <strong className="text-[#1a1412] font-semibold">partner agency</strong> portal. Or{' '}
                  <button
                    type="button"
                    onClick={() => setAcctType('traveller')}
                    className="font-semibold text-[#1a1412] underline decoration-[#f95721] decoration-2 underline-offset-4 hover:text-[#f95721] cursor-pointer"
                  >
                    switch to traveller
                  </button>{' '}
                  to book a car.
                </>
              )}
            </p>

            {/* Account Type Segmented Control (Traveller / Partner) */}
            <div className="flex bg-[#eae2d5] p-1 rounded-full mb-6 text-xs">
              <button
                type="button"
                onClick={() => setAcctType('traveller')}
                className={`flex-1 py-2.5 px-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  acctType === 'traveller'
                    ? 'bg-[#1a1412] text-[#F7F4EE] shadow-sm'
                    : 'text-[#615146] hover:text-[#1a1412]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Traveller</span>
              </button>
              <button
                type="button"
                onClick={() => setAcctType('partner')}
                className={`flex-1 py-2.5 px-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  acctType === 'partner'
                    ? 'bg-[#1a1412] text-[#F7F4EE] shadow-sm'
                    : 'text-[#615146] hover:text-[#1a1412]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Partner Agency</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                  acctType === 'partner' ? 'bg-[#c9a35b] text-[#1a1412]' : 'bg-[#f95721] text-white'
                }`}>
                  B2B
                </span>
              </button>
            </div>

            {/* Mode Switcher Tabs (Sign in / Create account / Verify) */}
            <div className="flex border-b border-[#ded7ca] mb-6">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`pb-3 pr-6 text-sm font-semibold transition-all relative cursor-pointer ${
                  mode === 'signin'
                    ? 'text-[#1a1412] after:absolute after:left-0 after:right-6 after:bottom-[-1px] after:h-[2px] after:bg-[#f95721]'
                    : 'text-[#8d7e73] hover:text-[#1a1412]'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`pb-3 pr-6 text-sm font-semibold transition-all relative cursor-pointer ${
                  mode === 'signup'
                    ? 'text-[#1a1412] after:absolute after:left-0 after:right-6 after:bottom-[-1px] after:h-[2px] after:bg-[#f95721]'
                    : 'text-[#8d7e73] hover:text-[#1a1412]'
                }`}
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => setMode('otp')}
                className={`pb-3 pr-6 text-sm font-semibold transition-all relative cursor-pointer ${
                  mode === 'otp'
                    ? 'text-[#1a1412] after:absolute after:left-0 after:right-6 after:bottom-[-1px] after:h-[2px] after:bg-[#f95721]'
                    : 'text-[#8d7e73] hover:text-[#1a1412]'
                }`}
              >
                Verify code
              </button>
            </div>

            {/* Method Segmented Control (Email vs Phone) */}
            {mode !== 'otp' && (
              <div className="flex border border-[#d8d0c2] rounded-xl p-1 mb-5 bg-white/50">
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'email'
                      ? 'bg-[#1a1412] text-[#F7F4EE] shadow-sm'
                      : 'text-[#615146] hover:text-[#1a1412]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'phone'
                      ? 'bg-[#1a1412] text-[#F7F4EE] shadow-sm'
                      : 'text-[#615146] hover:text-[#1a1412]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone (+212)</span>
                </button>
              </div>
            )}

            {/* Auth Error / Form Error Notification */}
            {(formError || authError) && (() => {
              const activeMessage = formError || authError || '';
              const isPopupClosed = 
                activeMessage.toLowerCase().includes('closed') || 
                activeMessage.toLowerCase().includes('cancelled') ||
                activeMessage.toLowerCase().includes('popup');

              return (
                <div className={`p-3.5 mb-4 rounded-xl text-xs space-y-2.5 transition-all ${
                  isPopupClosed 
                    ? 'bg-amber-50 border border-amber-200 text-amber-950' 
                    : 'bg-red-50 border border-red-200 text-red-950'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isPopupClosed ? 'text-amber-600' : 'text-red-600'}`} />
                    <div className="flex-1 leading-snug">
                      <strong className={`font-semibold block ${isPopupClosed ? 'text-amber-900' : 'text-red-900'}`}>
                        {isPopupClosed ? 'Sign-in Window Closed' : 'Authentication Notice'}
                      </strong>
                      <span className="text-[12px] opacity-90">{activeMessage}</span>
                    </div>
                  </div>

                  <div className={`pt-2 flex flex-wrap items-center justify-between gap-2 border-t text-[11px] ${
                    isPopupClosed ? 'border-amber-200/70' : 'border-red-200/60'
                  }`}>
                    {isPopupClosed ? (
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = await loginWithGoogle();
                          if (ok) {
                            if (onSuccessRole) onSuccessRole(acctType === 'partner' ? 'partner' : 'renter');
                            onClose();
                          }
                        }}
                        className="font-bold text-[#1a1412] hover:text-[#f95721] underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Retry Google Sign-In</span>
                      </button>
                    ) : (
                      <span className="text-[#736357]">Need instant access?</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const role = acctType === 'partner' ? 'partner' : 'renter';
                        loginWithDemo(role);
                        if (onSuccessRole) onSuccessRole(role);
                        onClose();
                      }}
                      className="font-bold text-[#f95721] hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Use Instant 1-Click Login</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ===================== FORM CONTENT ===================== */}
            {mode === 'otp' ? (
              /* OTP VERIFICATION FORM */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#736357]">
                  <span>Code sent to <strong className="text-[#1a1412] font-mono">+212 6 12 •• •• 78</strong></span>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-[#f95721] font-semibold underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div className="flex gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="flex-1 text-center font-['Fraunces'] text-2xl font-medium py-3 rounded-xl border border-[#d8d0c2] bg-white text-[#1a1412] focus:border-[#1a1412] focus:ring-2 focus:ring-[#1a1412]/10 outline-hidden"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1a1412] hover:bg-[#f95721] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-[#8d7e73] pt-1">
                  <span>
                    Didn't receive it?{' '}
                    <span className="text-[#f95721] font-semibold">
                      {resendTimer > 0 ? `Resend in 0:${resendTimer.toString().padStart(2, '0')}` : (
                        <button type="button" onClick={() => setResendTimer(45)} className="underline cursor-pointer">
                          Resend now
                        </button>
                      )}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setMethod('email'); }}
                    className="text-[#1a1412] font-semibold hover:underline cursor-pointer"
                  >
                    Use email instead
                  </button>
                </div>
              </div>
            ) : method === 'phone' ? (
              /* PHONE FORM */
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8d7e73] mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex gap-2.5">
                    <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-[#d8d0c2] bg-white font-semibold text-xs text-[#1a1412] shrink-0">
                      <span className="w-5 h-3.5 rounded-xs bg-red-700 relative flex items-center justify-center text-[8px] text-green-900 font-bold">
                        ★
                      </span>
                      <span>+212 ▾</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="6 12 34 56 78"
                      className="flex-1 px-4 py-3 rounded-xl border border-[#d8d0c2] bg-white text-sm text-[#1a1412] focus:border-[#1a1412] outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMode('otp')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1a1412] hover:bg-[#f95721] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Send 6-digit code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="p-3 bg-[#ede6da] rounded-xl border border-[#ded7ca] text-[11px] text-[#615146] leading-relaxed">
                  <strong>Delivered via SMS.</strong> Instant verification code arrives in under 30 seconds across Maroc Telecom, Orange, and Inwi networks.
                </div>
              </div>
            ) : (
              /* EMAIL FORM */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8d7e73] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="As on your driver's licence"
                      className="w-full px-4 py-3 rounded-xl border border-[#d8d0c2] bg-white text-sm text-[#1a1412] focus:border-[#1a1412] outline-hidden"
                    />
                  </div>
                )}

                {mode === 'signup' && acctType === 'partner' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8d7e73] mb-1.5 flex items-center justify-between">
                      <span>Agency Name</span>
                      <span className="text-[10px] text-[#8d7e73] font-normal normal-case">RC + ICE verification later</span>
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Mayache Prestige Cars · Tetouan"
                      className="w-full px-4 py-3 rounded-xl border border-[#d8d0c2] bg-white text-sm text-[#1a1412] focus:border-[#1a1412] outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8d7e73] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#d8d0c2] bg-white text-sm text-[#1a1412] focus:border-[#1a1412] outline-hidden"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8d7e73]">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button type="button" className="text-xs text-[#f95721] font-semibold hover:underline cursor-pointer">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-[#d8d0c2] bg-white text-sm text-[#1a1412] focus:border-[#1a1412] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d7e73] hover:text-[#1a1412] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signin' && (
                  <label className="flex items-center gap-2 pt-1 text-xs text-[#615146] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={staySignedIn}
                      onChange={(e) => setStaySignedIn(e.target.checked)}
                      className="accent-[#f95721] w-4 h-4 rounded"
                    />
                    <span>Stay signed in on this device</span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1a1412] hover:bg-[#f95721] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer pt-3"
                >
                  <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#ded7ca]" />
              </div>
              <span className="relative bg-[#F7F4EE] px-3 text-[11px] uppercase tracking-widest text-[#8d7e73] font-semibold">
                or continue with
              </span>
            </div>

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  const ok = await loginWithGoogle();
                  if (ok) {
                    if (onSuccessRole) onSuccessRole(acctType === 'partner' ? 'partner' : 'renter');
                    onClose();
                  }
                }}
                className="py-3 px-3 rounded-xl border border-[#d8d0c2] bg-white hover:border-[#1a1412] hover:bg-neutral-50 text-[#1a1412] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5Z"/>
                  <path fill="#34A853" d="M12 22c2.8 0 5.2-1 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.4 19.6 7.9 22 12 22Z"/>
                  <path fill="#FBBC05" d="M6.2 13.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.9H2.7C2 8.4 1.5 10.1 1.5 12s.5 3.6 1.2 5.1l3.5-3.5Z"/>
                  <path fill="#EA4335" d="M12 5.7c1.5 0 2.9.5 4 1.6l3-3C17.2 2.5 14.7 1.5 12 1.5 7.9 1.5 4.4 3.9 2.7 7.4l3.5 2.7c.8-2.5 3.1-4.4 5.8-4.4Z"/>
                </svg>
                <span>Google</span>
              </button>

              {/* Instant 1-Click Verified Traveler/Partner Profile */}
              <button
                type="button"
                onClick={() => {
                  const role = acctType === 'partner' ? 'partner' : 'renter';
                  loginWithDemo(role);
                  if (onSuccessRole) onSuccessRole(role);
                  onClose();
                }}
                className="py-3 px-3 rounded-xl border border-[#c9a35b]/60 bg-[#faf6ee] hover:bg-[#f5ecda] text-[#1a1412] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f95721] group-hover:scale-110 transition-transform" />
                <span>Instant 1-Click</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-[#ded7ca] flex flex-wrap items-center justify-between gap-3 text-xs text-[#736357]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2FA Protected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dahir 2026 / CNDP</span>
              </div>
            </div>

            {/* Legal Footer & Dev Setup Trigger */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#8d7e73] leading-relaxed">
              <span>
                By continuing you agree to airbcar's Terms and Privacy Policy. Moroccan Loi 09-08 compliant.
              </span>
              {onOpenSetup && (
                <button
                  type="button"
                  onClick={onOpenSetup}
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-[#8d7e73] hover:text-[#f95721] shrink-0 underline cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Google Cloud Credentials</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ===================== ART PANE (Variant A: Split) ===================== */}
        {layoutVariant === 'a' && (
          <aside className="hidden lg:flex relative overflow-hidden bg-[#1a1208] text-white flex-col justify-between p-16">
            
            {/* Scenic Moroccan Atlas / Sunset Canvas Background */}
            <div className="absolute inset-0 z-0">
              {/* Sunset Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#3a1f15] via-[#1a1208] to-[#0a0503]" />
              <div className="absolute top-[20%] right-[20%] w-72 h-72 rounded-full bg-[radial-gradient(circle,#f4c378_0%,#e89d4a_30%,rgba(192,57,43,0.5)_60%,transparent_80%)] blur-md opacity-80" />
              
              {/* Starry Night particles */}
              <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20%_30%,#fff,transparent),radial-gradient(1px_1px_at_70%_70%,rgba(255,255,255,0.6),transparent),radial-gradient(2px_2px_at_40%_50%,rgba(201,163,91,0.7),transparent)] bg-[size:600px_600px] opacity-70" />

              {/* Mountains SVG */}
              <div className="absolute left-0 right-0 bottom-[36%] h-[32%] pointer-events-none">
                <svg viewBox="0 0 1600 300" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="amb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3b2418" />
                      <stop offset="1" stopColor="#1a0e07" />
                    </linearGradient>
                    <linearGradient id="amf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#1a0e07" />
                      <stop offset="1" stopColor="#050302" />
                    </linearGradient>
                  </defs>
                  <path d="M0,300 L0,180 L120,110 L260,180 L380,90 L520,160 L660,80 L820,170 L960,100 L1100,180 L1240,110 L1400,170 L1600,100 L1600,300 Z" fill="url(#amb)" />
                  <path d="M0,300 L0,230 L100,160 L220,210 L360,140 L500,210 L640,170 L780,220 L920,160 L1080,220 L1220,180 L1380,220 L1540,170 L1600,210 L1600,300 Z" fill="url(#amf)" />
                </svg>
              </div>

              {/* Perspective Road SVG with Golden Center Dashes */}
              <div className="absolute left-1/2 -bottom-2 w-[160%] h-[48%] -translate-x-1/2 pointer-events-none">
                <svg viewBox="0 0 1600 800" preserveAspectRatio="xMidYMax slice" className="w-full h-full block">
                  <defs>
                    <linearGradient id="argb" x1="0.5" y1="0" x2="0.5" y2="1">
                      <stop offset="0" stopColor="#1a1208" stopOpacity="0" />
                      <stop offset="0.4" stopColor="#1a1208" stopOpacity="0.6" />
                      <stop offset="1" stopColor="#0a0503" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path d="M-200,800 L-200,400 Q800,360 1800,400 L1800,800 Z" fill="rgba(58,44,28,0.5)" />
                  <path d="M740,400 L860,400 L1300,800 L300,800 Z" fill="url(#argb)" />
                  <g fill="#c9a35b" opacity="0.75">
                    <polygon points="795,440 805,440 808,470 792,470" />
                    <polygon points="788,510 812,510 818,560 782,560" />
                    <polygon points="778,590 822,590 832,660 768,660" />
                    <polygon points="765,690 835,690 850,790 750,790" />
                  </g>
                  <path d="M740,400 L300,800" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
                  <path d="M860,400 L1300,800" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Subtle Film Grain */}
              <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>

            {/* Floating Live Moroccan Rental Badges */}
            <div className="relative z-10 space-y-4">
              <div className="max-w-xs p-3.5 rounded-2xl bg-[#F7F4EE]/95 text-[#1a1412] shadow-2xl backdrop-blur-md border border-white/20 animate-bounce duration-1000">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#f95721]/15 text-[#f95721] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold">Booking Confirmed</span>
                </div>
                <div className="font-['Fraunces'] font-semibold text-base text-[#1a1412]">
                  Marrakech → Merzouga
                </div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#736357] mt-0.5">
                  4 Days · Golf 8 R-Line · Mayache Cars
                </p>
              </div>

              <div className="max-w-xs p-3.5 rounded-2xl bg-[#F7F4EE]/95 text-[#1a1412] shadow-2xl backdrop-blur-md border border-white/20 ml-8">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-[11px] font-bold text-[#1a1412] ml-1">5.0</span>
                </div>
                <div className="font-['Fraunces'] italic text-sm text-[#1a1412]">
                  "Seamless CMI deposit release upon return at Casablanca Airport."
                </div>
                <p className="text-[10px] font-mono text-[#736357] mt-1">
                  — Karim T. · Verified Renter
                </p>
              </div>
            </div>

            {/* Bottom Quote & Key Moroccan Ecosystem Metrics */}
            <div className="relative z-10 mt-auto pt-16">
              <div className="font-['Fraunces'] italic font-light text-2xl lg:text-3xl text-white/95 leading-snug max-w-lg mb-8">
                "The road across <em className="text-[#c9a35b] not-italic font-normal">Morocco</em> begins with a key — and a key begins with a trusted handshake."
                <span className="block font-mono not-italic text-[11px] uppercase tracking-widest text-white/60 font-semibold mt-3">
                  — airbcar · Dahir 2026 digital automotive framework
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                <div>
                  <div className="font-['Fraunces'] text-3xl font-semibold text-white">
                    320<em className="text-[#c9a35b] not-italic font-normal">+</em>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mt-0.5">
                    Licensed Agencies
                  </div>
                </div>
                <div>
                  <div className="font-['Fraunces'] text-3xl font-semibold text-white">
                    14
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mt-0.5">
                    Moroccan Cities
                  </div>
                </div>
                <div>
                  <div className="font-['Fraunces'] text-3xl font-semibold text-white">
                    4.94<em className="text-[#c9a35b] not-italic font-normal">★</em>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mt-0.5">
                    Verified Rating
                  </div>
                </div>
              </div>
            </div>

          </aside>
        )}

      </div>
    </div>
  );
};
