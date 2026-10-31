import React, { useState } from 'react';
import { AdminClient } from '../../types/admin';
import { 
  X, User, ShieldCheck, MapPin, Phone, Mail, Award, AlertTriangle, 
  CheckCircle, Calendar, CreditCard, Car, ExternalLink, Star, ShieldAlert
} from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { DriverLicenseVisualCard } from '../common/DriverLicenseVisualCard';

interface AdminClientDetailModalProps {
  client: AdminClient;
  onClose: () => void;
  onUpdateTrustScore: (clientId: string, newScore: AdminClient['trustScore']) => void;
  onViewBooking?: (bookingId: string) => void;
}

export const AdminClientDetailModal: React.FC<AdminClientDetailModalProps> = ({
  client,
  onClose,
  onUpdateTrustScore,
  onViewBooking
}) => {
  const { isLight } = useAccountSettings();

  const formatMAD = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
        isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#18120d] border-[#2e231c] text-[#f5efe8]'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b flex items-start justify-between ${
          isLight ? 'bg-neutral-50/70 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <div className="flex items-center gap-4">
            <img 
              src={client.avatar} 
              alt={client.fullName} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f95721] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">{client.fullName}</h2>
                <span className="text-lg">{client.flag}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  client.trustScore === 'vip' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  client.trustScore === 'verified_good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  client.trustScore === 'under_review' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  {client.trustScore.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                <span>{client.nationality}</span>
                <span>•</span>
                <span>{client.age} years old (DOB: {client.dateOfBirth})</span>
                <span>•</span>
                <span>Client since {client.joinedDate}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
              <span className="text-xs text-neutral-400">Total Bookings</span>
              <p className="text-xl font-bold text-[#f95721] mt-1">{client.totalBookings} Trips</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Completed rentals</p>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
              <span className="text-xs text-neutral-400">Lifetime Spend (LTV)</span>
              <p className="text-xl font-bold text-emerald-500 mt-1">{formatMAD(client.totalSpentMAD)}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Total paid</p>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
              <span className="text-xs text-neutral-400">Deposits Handled</span>
              <p className="text-xl font-bold mt-1">{formatMAD(client.depositHistory.totalHeldMAD)}</p>
              <p className="text-[11px] text-emerald-500 mt-0.5">{formatMAD(client.depositHistory.refundedFullMAD)} refunded</p>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
              <span className="text-xs text-neutral-400">Renter Score</span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xl font-bold">{client.rating} / 5.0</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">{client.disputeCount} dispute filed</p>
            </div>
          </div>

          {/* Identification Documents (Passport & Moroccan Driving License) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Passport / CIN */}
            <div className={`p-5 rounded-xl border space-y-3 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    {client.cinOrPassport.type === 'cin' ? 'Moroccan National ID (CIN)' : 'International Passport'}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Government Verified
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Document Number:</span>
                  <span className="font-mono font-bold text-sm text-[#f95721]">{client.cinOrPassport.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Issuing State:</span>
                  <span className="font-semibold">{client.country} {client.flag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Valid Until:</span>
                  <span className="font-semibold">{client.cinOrPassport.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Driving License */}
            <div className={`p-5 rounded-xl border space-y-3 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#f95721]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Permis de Conduire (Driver License)</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Valid • {client.drivingLicense.yearsExperience} Ans Exp.
                </span>
              </div>

              {/* Interactive Flip Card: Front / Back */}
              <DriverLicenseVisualCard
                licenseNumber={client.drivingLicense.number}
                driverName={client.name}
                driverCountry={client.country}
                driverFlag={client.flag}
                driverCinOrPassport={client.cinOrPassport.number}
                issueDate={client.drivingLicense.issueDate}
                expiryDate={client.drivingLicense.expiryDate}
                categories={client.drivingLicense.categories}
                photoUrl={client.avatar}
              />
            </div>

          </div>

          {/* Contact & Personal Details */}
          <div className={`p-5 rounded-xl border space-y-3 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Contact & Residential Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p><strong className="text-neutral-400">Mobile Phone:</strong> <a href={`tel:${client.phone}`} className="text-[#f95721] font-semibold ml-1 hover:underline">{client.phone}</a></p>
                <p><strong className="text-neutral-400">WhatsApp:</strong> <a href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 font-semibold ml-1 hover:underline">{client.whatsapp}</a></p>
                <p><strong className="text-neutral-400">Email Address:</strong> <a href={`mailto:${client.email}`} className="text-[#f95721] ml-1 hover:underline">{client.email}</a></p>
              </div>
              <div className="space-y-2">
                <p><strong className="text-neutral-400">Home Address:</strong> <span className="ml-1">{client.address}</span></p>
                <p><strong className="text-neutral-400">Preferred Destinations:</strong> <span className="ml-1 font-semibold">{client.preferredCity}</span></p>
                <p><strong className="text-neutral-400">Preferred Fleet Type:</strong> <span className="ml-1 font-semibold">{client.preferredCategory}</span></p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
              <strong>Admin Profile Note:</strong> {client.notes}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-4 ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 mr-1">Set Trust Tier:</span>
            {(['vip', 'verified_good', 'under_review', 'flagged'] as const).map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => onUpdateTrustScore(client.id, tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  client.trustScore === tier
                    ? 'bg-[#f95721] text-white'
                    : 'bg-black/10 dark:bg-white/5 hover:bg-black/20 text-neutral-400'
                }`}
              >
                {tier.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {client.activeBookingId && onViewBooking && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewBooking(client.activeBookingId!);
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#f95721] text-white hover:bg-[#e04a17] shadow-xs cursor-pointer"
              >
                <span>View Active Trip</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-white/10 hover:bg-white/5 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
