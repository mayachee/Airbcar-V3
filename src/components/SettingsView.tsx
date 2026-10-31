import React, { useState } from 'react';
import { 
  ShieldCheck, KeyRound, Mail, AlertTriangle, CheckCircle2, 
  Eye, EyeOff, Trash2, Globe, Check, Smartphone, Laptop, MapPin,
  Moon, Sun, Coins
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userProfile }) => {
  // Navigation section filter
  const [activeSection, setActiveSection] = useState<'all' | 'security' | 'email' | 'devices' | 'preferences' | 'danger'>('all');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Email verification state
  const [emailAddress, setEmailAddress] = useState(userProfile.email || 'ayacheyassine2000@gmail.com');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailResentToast, setEmailResentToast] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');

  // Sessions state
  const [otherSessionsTerminated, setOtherSessionsTerminated] = useState(false);

  // Account Actions / Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountDeletedToast, setAccountDeletedToast] = useState(false);

  // General settings state
  const [selectedCurrency, setSelectedCurrency] = useState('MAD');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Calculate password strength
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const criteriaCount = [hasMinLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
  
  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: '', color: 'bg-[#2b2018]', text: '' };
    if (criteriaCount <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
    if (criteriaCount === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (criteriaCount === 3) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = getStrengthLabel();

  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'Please enter your current password.',
      });
      return;
    }
    if (!hasMinLength) {
      setPasswordStatus({
        type: 'error',
        message: 'New password must be at least 8 characters long.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setPasswordStatus({
        type: 'success',
        message: 'Password updated successfully! Your account credentials are secured.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setPasswordStatus({ type: null, message: '' });
      }, 5000);
    }, 900);
  };

  // Handle resend email
  const handleResendEmail = () => {
    if (resendCooldown > 0) return;
    setEmailResentToast(true);
    setResendCooldown(60);

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      setEmailResentToast(false);
    }, 7000);
  };

  // Save new email address
  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmailInput && newEmailInput.includes('@')) {
      setEmailAddress(newEmailInput);
      setIsEditingEmail(false);
      setIsEmailVerified(false);
      setNewEmailInput('');
      setEmailResentToast(true);
    }
  };

  // Terminate other sessions
  const handleTerminateSessions = () => {
    setOtherSessionsTerminated(true);
    setTimeout(() => setOtherSessionsTerminated(false), 5000);
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setAccountDeletedToast(true);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-24 space-y-8 text-[#f5efe8]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#261d16]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
              Account Security & Controls
            </span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f5efe8] tracking-tight">
            Security & Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#9c8e82] mt-1 max-w-xl leading-relaxed">
            Manage your credentials, email verification status, active sessions, and Moroccan rental regional preferences.
          </p>
        </div>

        {/* Security Health Badge */}
        <div className="flex items-center gap-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-auto shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Account Shield</div>
            <div className="text-xs font-semibold text-emerald-300">Protected & Encrypted</div>
          </div>
        </div>
      </div>

      {/* Account Scheduled Deletion Notice */}
      {accountDeletedToast && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-400 px-5 py-4 rounded-3xl text-xs flex items-center gap-3 animate-fadeIn shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="leading-relaxed">
            Account deletion scheduled in 30 days pursuant to Moroccan law. Active rental reservations must conclude before permanent erasure.
          </span>
        </div>
      )}

      {/* Navigation Filter Pills in Airbcar style */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Settings' },
          { id: 'security', label: 'Password' },
          { id: 'email', label: 'Email Verification' },
          { id: 'devices', label: 'Active Sessions' },
          { id: 'preferences', label: 'Preferences' },
          { id: 'danger', label: 'Danger Zone' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeSection === tab.id
                ? 'bg-[#f95721] text-white shadow-xs'
                : 'bg-[#1a130f] text-[#a89b90] hover:text-[#f5efe8] border border-[#2b2018] hover:bg-[#241b15]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Change Password Section */}
      {(activeSection === 'all' || activeSection === 'security') && (
        <div className="bg-[#1a130f] rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#2b2018] shadow-sm space-y-7 transition-all">
          <div className="flex items-center gap-3.5 pb-5 border-b border-[#261d16]">
            <div className="w-11 h-11 rounded-2xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721] shrink-0 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#f5efe8] tracking-tight">
                Change Password
              </h3>
              <p className="text-xs text-[#8d7e73] mt-0.5">
                Update your password regularly to protect your contracts and booking deposits.
              </p>
            </div>
          </div>

          {passwordStatus.type && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-start gap-3 animate-fadeIn shadow-xs ${
                passwordStatus.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {passwordStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-[#f5efe8] mb-1.5">
                Current Password <span className="text-[#f95721]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-[#f5efe8] placeholder-[#7d6e63] focus:outline-none focus:ring-2 focus:ring-[#f95721]/30 focus:border-[#f95721] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d7e73] hover:text-[#f5efe8] p-1 rounded-lg"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#f5efe8]">
                  New Password <span className="text-[#f95721]">*</span>
                </label>
                {newPassword && (
                  <span className={`text-[11px] font-bold ${strength.text}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Enter new password (min. 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-[#f5efe8] placeholder-[#7d6e63] focus:outline-none focus:ring-2 focus:ring-[#f95721]/30 focus:border-[#f95721] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d7e73] hover:text-[#f5efe8] p-1 rounded-lg"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter Bars */}
              {newPassword && (
                <div className="mt-2.5 space-y-2">
                  <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                    <div className={`rounded-full ${criteriaCount >= 1 ? strength.color : 'bg-[#2b2018]'}`} />
                    <div className={`rounded-full ${criteriaCount >= 2 ? strength.color : 'bg-[#2b2018]'}`} />
                    <div className={`rounded-full ${criteriaCount >= 3 ? strength.color : 'bg-[#2b2018]'}`} />
                    <div className={`rounded-full ${criteriaCount >= 4 ? strength.color : 'bg-[#2b2018]'}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#8d7e73]">
                    <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-medium' : ''}`}>
                      <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-400' : 'text-[#504136]'}`} />
                      8+ characters
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-medium' : ''}`}>
                      <Check className={`w-3 h-3 ${hasUpper ? 'text-emerald-400' : 'text-[#504136]'}`} />
                      Uppercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-medium' : ''}`}>
                      <Check className={`w-3 h-3 ${hasNumber ? 'text-emerald-400' : 'text-[#504136]'}`} />
                      Number (0-9)
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400 font-medium' : ''}`}>
                      <Check className={`w-3 h-3 ${hasSpecial ? 'text-emerald-400' : 'text-[#504136]'}`} />
                      Special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#f5efe8]">
                  Confirm New Password <span className="text-[#f95721]">*</span>
                </label>
                {confirmPassword && newPassword && (
                  <span className={`text-[11px] font-semibold ${
                    confirmPassword === newPassword ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {confirmPassword === newPassword ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-[#f5efe8] placeholder-[#7d6e63] focus:outline-none focus:ring-2 focus:ring-[#f95721]/30 focus:border-[#f95721] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d7e73] hover:text-[#f5efe8] p-1 rounded-lg"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPass || (confirmPassword !== '' && confirmPassword !== newPassword)}
                className="bg-[#f95721] hover:bg-[#e04a17] disabled:opacity-40 text-white text-xs sm:text-sm font-semibold px-7 py-3 rounded-full transition-all duration-150 active:scale-95 shadow-xs cursor-pointer"
              >
                {isChangingPass ? 'Updating password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Email Verification Section */}
      {(activeSection === 'all' || activeSection === 'email') && (
        <div className="bg-[#1a130f] rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#2b2018] shadow-sm space-y-6 transition-all">
          <div className="flex items-center gap-3.5 pb-5 border-b border-[#261d16]">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#f5efe8] tracking-tight">
                Email Verification
              </h3>
              <p className="text-xs text-[#8d7e73] mt-0.5">
                Official contract signatures, refund notifications, and booking vouchers are sent here.
              </p>
            </div>
          </div>

          {emailResentToast && (
            <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 p-4 rounded-2xl text-xs flex items-start gap-3 animate-fadeIn shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                A new secure verification link has been sent to <strong>{emailAddress}</strong>. Please check your inbox or spam folder.
              </span>
            </div>
          )}

          {/* Verification Status Card */}
          <div className="bg-[#201813] rounded-3xl p-6 border border-[#2c2019] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isEmailVerified 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                </span>
                <span className="text-xs font-semibold text-[#f5efe8] font-mono">
                  {emailAddress}
                </span>
              </div>

              <p className="text-xs text-[#8d7e73] leading-relaxed max-w-lg">
                {isEmailVerified
                  ? 'Your email address is verified and active for all Moroccan legal rental agreements and security deposit returns.'
                  : 'Please verify your email address to secure your account.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {!isEmailVerified ? (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0}
                  className="bg-[#f95721] hover:bg-[#e04a17] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified</span>
                </span>
              )}

              {/* Edit email button */}
              <button
                type="button"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-xs text-[#a89b90] hover:text-[#f5efe8] bg-[#291f18] border border-[#382a20] px-3.5 py-2 rounded-full hover:bg-[#34271e] transition-colors cursor-pointer"
              >
                {isEditingEmail ? 'Cancel' : 'Change Email'}
              </button>

              {/* Demo toggle button */}
              <button
                type="button"
                onClick={() => setIsEmailVerified(!isEmailVerified)}
                className="text-[11px] text-[#7d6e63] hover:text-[#a89b90] bg-[#1a130f] border border-[#2b2018] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="Toggle verification status for review"
              >
                Toggle State
              </button>
            </div>
          </div>

          {/* Edit Email Form Inline */}
          {isEditingEmail && (
            <form onSubmit={handleSaveEmail} className="p-5 bg-[#201813] rounded-2xl border border-[#2c2019] space-y-3 animate-fadeIn">
              <label className="block text-xs font-bold text-[#f5efe8]">
                New Email Address
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter new email address"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  className="flex-1 bg-[#241b15] border border-[#382b21] rounded-xl px-4 py-2.5 text-xs text-[#f5efe8] focus:outline-none focus:ring-1 focus:ring-[#f95721]"
                />
                <button
                  type="submit"
                  className="bg-[#f95721] hover:bg-[#e04a17] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Save & Verify
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Active Devices & Sessions Section */}
      {(activeSection === 'all' || activeSection === 'devices') && (
        <div className="bg-[#1a130f] rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#2b2018] shadow-sm space-y-6 transition-all">
          <div className="flex items-center justify-between pb-5 border-b border-[#261d16]">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#f5efe8] tracking-tight">
                  Active Devices & Sessions
                </h3>
                <p className="text-xs text-[#8d7e73] mt-0.5">
                  Review logged-in browsers and revoke unverified sessions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTerminateSessions}
              className="text-xs font-semibold text-[#a89b90] hover:text-red-400 border border-[#382a20] hover:border-red-500/30 px-4 py-2 rounded-full transition-colors hidden sm:block cursor-pointer"
            >
              Sign out other devices
            </button>
          </div>

          {otherSessionsTerminated && (
            <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All other active browser and app sessions have been signed out.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Session 1: Current */}
            <div className="p-4 rounded-2xl bg-[#201813] border border-[#2c2019] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#291f18] border border-[#382a20] flex items-center justify-center text-[#f5efe8] shrink-0 mt-0.5">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f5efe8] flex items-center gap-2">
                    <span>MacBook Pro • Chrome</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      This Device
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8d7e73] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#f95721]" />
                    <span>Casablanca, Morocco</span>
                  </div>
                  <div className="text-[11px] text-[#7d6e63] mt-0.5 font-mono">
                    Active now • IP 196.200.***.***
                  </div>
                </div>
              </div>
            </div>

            {/* Session 2: Mobile */}
            <div className="p-4 rounded-2xl bg-[#201813] border border-[#2c2019] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#291f18] border border-[#382a20] flex items-center justify-center text-[#f5efe8] shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f5efe8]">
                    iPhone 15 Pro • Airbcar App
                  </div>
                  <div className="text-[11px] text-[#8d7e73] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#f95721]" />
                    <span>Rabat, Morocco</span>
                  </div>
                  <div className="text-[11px] text-[#7d6e63] mt-0.5">
                    Last active: 2 hours ago
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#7d6e63] font-mono">iOS 17.5</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Account Settings & Regional Preferences */}
      {(activeSection === 'all' || activeSection === 'preferences') && (
        <div className="bg-[#1a130f] rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#2b2018] shadow-sm space-y-7 transition-all">
          <div className="flex items-center gap-3.5 pb-5 border-b border-[#261d16]">
            <div className="w-11 h-11 rounded-2xl bg-[#291f18] border border-[#382a20] flex items-center justify-center text-[#f5efe8] shrink-0 shadow-xs">
              <Globe className="w-5 h-5 text-[#f95721]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#f5efe8] tracking-tight">
                Account Settings
              </h3>
              <p className="text-xs text-[#8d7e73] mt-0.5">
                Manage your account settings on the platform
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {/* Language */}
            <div>
              <label className="block text-xs font-bold text-[#f5efe8] mb-1">
                Language
              </label>
              <p className="text-[11px] text-[#8d7e73] mb-2">Choose your preferred language</p>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-[#241b15] border border-[#382b21] text-[#f5efe8] rounded-2xl p-3.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#f95721] cursor-pointer"
              >
                <option value="en">English (UK / US)</option>
                <option value="fr">Français (France / Maroc)</option>
                <option value="ar">العربية (الدارجة المغربية)</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-bold text-[#f5efe8] mb-1">
                Currency
              </label>
              <p className="text-[11px] text-[#8d7e73] mb-2">Set your preferred currency for prices</p>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-[#241b15] border border-[#382b21] text-[#f5efe8] rounded-2xl p-3.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#f95721] cursor-pointer"
              >
                <option value="MAD">DH MAD - Moroccan Dirham (د.م.)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="GBP">GBP - British Pound (£)</option>
              </select>
            </div>
          </div>

          {/* Dark / Light Mode Selector */}
          <div className="pt-2 max-w-2xl">
            <div className="text-xs font-bold text-[#f5efe8] mb-1">
              Dark / Light mode
            </div>
            <p className="text-[11px] text-[#8d7e73] mb-3">Choose your interface appearance</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-[#f95721]/15 border-[#f95721] text-[#f5efe8]'
                    : 'bg-[#201813] border-[#2c2019] text-[#8d7e73] hover:text-[#f5efe8]'
                }`}
              >
                <Moon className={`w-4 h-4 ${themeMode === 'dark' ? 'text-[#f95721]' : 'text-[#8d7e73]'}`} />
                <div>
                  <span className="text-xs font-bold block">Dark Mode</span>
                  <span className="text-[10px] text-[#8d7e73]">Warm Charcoal</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-[#f95721]/15 border-[#f95721] text-[#f5efe8]'
                    : 'bg-[#201813] border-[#2c2019] text-[#8d7e73] hover:text-[#f5efe8]'
                }`}
              >
                <Sun className={`w-4 h-4 ${themeMode === 'light' ? 'text-amber-400' : 'text-[#8d7e73]'}`} />
                <div>
                  <span className="text-xs font-bold block">Light Mode</span>
                  <span className="text-[10px] text-[#8d7e73]">Porcelain Ivory</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('system')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-[#f95721]/15 border-[#f95721] text-[#f5efe8]'
                    : 'bg-[#201813] border-[#2c2019] text-[#8d7e73] hover:text-[#f5efe8]'
                }`}
              >
                <Laptop className={`w-4 h-4 ${themeMode === 'system' ? 'text-blue-400' : 'text-[#8d7e73]'}`} />
                <div>
                  <span className="text-xs font-bold block">System</span>
                  <span className="text-[10px] text-[#8d7e73]">Auto-detect</span>
                </div>
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 max-w-2xl">
            <div className="text-xs font-bold text-[#f5efe8] mb-2">
              Notification Channels
            </div>

            <div 
              onClick={() => setEmailAlerts(!emailAlerts)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#201813] hover:bg-[#271d17] border border-[#2c2019] transition-colors cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-[#f5efe8]">Email receipts & deposit releases</div>
                <div className="text-[11px] text-[#8d7e73] mt-0.5">Receive PDF contracts, check-in sheets, and refund vouchers.</div>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                emailAlerts ? 'bg-[#f95721]' : 'bg-[#382b21]'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  emailAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            <div 
              onClick={() => setSmsAlerts(!smsAlerts)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#201813] hover:bg-[#271d17] border border-[#2c2019] transition-colors cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-[#f5efe8]">SMS Handover Alerts</div>
                <div className="text-[11px] text-[#8d7e73] mt-0.5">Instant updates when car agent arrives at airport terminal.</div>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                smsAlerts ? 'bg-[#f95721]' : 'bg-[#382b21]'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            <div 
              onClick={() => setLoginAlerts(!loginAlerts)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#201813] hover:bg-[#271d17] border border-[#2c2019] transition-colors cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-[#f5efe8]">Security Login Notifications</div>
                <div className="text-[11px] text-[#8d7e73] mt-0.5">Alert if someone logs in from a new city or unfamiliar browser.</div>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                loginAlerts ? 'bg-[#f95721]' : 'bg-[#382b21]'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  loginAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Account Actions / Danger Zone */}
      {(activeSection === 'all' || activeSection === 'danger') && (
        <div className="bg-[#1a130f] rounded-3xl p-6 sm:p-8 lg:p-9 border border-rose-950/60 shadow-sm space-y-6 transition-all">
          <div className="flex items-center gap-3.5 pb-5 border-b border-rose-950/40">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#f5efe8] tracking-tight">
                Account Actions & Deletion
              </h3>
              <p className="text-xs text-[#8d7e73] mt-0.5">
                Permanent data removal and account decommissioning.
              </p>
            </div>
          </div>

          <div className="bg-rose-950/25 rounded-3xl p-6 border border-rose-900/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h4 className="text-sm font-bold text-[#f5efe8]">
                Delete Account
              </h4>
              <p className="text-xs text-[#8d7e73] mt-1 max-w-xl leading-relaxed">
                Are you sure you want to delete your account? This action cannot be undone. All verified driving licence scans, past contracts, and saved vehicles will be permanently purged.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-sm active:scale-95 self-start md:self-center shrink-0 cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#1a130f] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#2b2018] text-[#f5efe8]">
            <div className="flex items-center gap-3 text-rose-400 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#f5efe8]">
                  Confirm Deletion
                </h3>
                <p className="text-[11px] text-[#8d7e73]">This action is irreversible</p>
              </div>
            </div>

            <p className="text-xs text-[#8d7e73] leading-relaxed mt-3.5">
              Are you sure you want to delete your account? This action cannot be undone. All stored documents, past trip invoices, and saved vehicles will be permanently purged in accordance with Moroccan privacy regulations.
            </p>

            <div className="mt-4 bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-2xl text-[11px] text-amber-300 leading-relaxed">
              Note: Active bookings (such as VW Golf AC-2418) or pending deposit refunds must be concluded before data deletion completes.
            </div>

            <div className="mt-5">
              <label className="block text-[11px] font-bold text-[#a89b90] uppercase tracking-wider mb-1.5">
                Type <span className="text-rose-400 font-mono">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                placeholder="Type DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-4 py-3 text-xs text-[#f5efe8] placeholder-[#7d6e63] focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#261d16]">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#a89b90] hover:bg-[#241b15] hover:text-[#f5efe8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.toLowerCase() !== 'delete' || isDeleting}
                onClick={handleDeleteAccount}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
