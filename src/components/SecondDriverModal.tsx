import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface SecondDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveDriver: (driverName: string, licenceNum: string) => void;
}

export const SecondDriverModal: React.FC<SecondDriverModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveDriver,
}) => {
  const [driverName, setDriverName] = useState(userProfile.secondDriverName || '');
  const [licenceNum, setLicenceNum] = useState(userProfile.secondDriverLicence || '');
  const [country, setCountry] = useState('France');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim()) return;
    onSaveDriver(driverName, licenceNum || 'B-992140');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-scale-up">
        
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#f95721]" />
            <h3 className="font-serif-display text-xl font-bold text-neutral-900">
              Add Second Driver
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
          Adding an authorized second driver extends full CDW and third-party insurance coverage to both drivers without extra agency fees.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              FULL NAME (AS ON LICENCE)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Marc Dubois"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full bg-[#F5F2EB] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#f95721]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              DRIVING LICENCE NUMBER
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 15AA12345"
              value={licenceNum}
              onChange={(e) => setLicenceNum(e.target.value)}
              className="w-full bg-[#F5F2EB] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#f95721]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              COUNTRY OF ISSUANCE
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-[#F5F2EB] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#f95721]"
            >
              <option value="France">France</option>
              <option value="Morocco">Morocco</option>
              <option value="Spain">Spain</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-semibold px-5 py-2 rounded-full transition-all shadow-sm"
            >
              Save second driver
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
