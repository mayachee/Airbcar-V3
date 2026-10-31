import React from 'react';
import { ActiveTab } from '../types';
import { UserRole } from '../types/partner';
import { ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onBrowseCars: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onBrowseCars, 
  onNavigateTab,
  onSwitchRole 
}) => {
  return (
    <footer className="w-full bg-[#181311] text-white pt-16 pb-12 px-4 sm:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Call to action */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Where to next in Morocco?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              The road begins with a verified key. Seamless agency rentals across 14 cities from Tangier to Merzouga.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab ? onNavigateTab('rent') : onBrowseCars()}
              className="bg-[#f95721] hover:bg-[#e04816] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('partner') : null}
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-full transition-all border border-white/10 cursor-pointer"
            >
              Become an Agency Partner
            </button>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: Rent */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Rent in Morocco</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab?.('rent')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Casablanca Fleet &amp; Airport
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('rent')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Marrakech Menara Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('rent')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Tangier Port &amp; Ibn Battouta
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('rent')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Agadir &amp; Taghazout Coast
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('saved-cars')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Saved Cars &amp; Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Partner Network */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">For Agencies</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab?.('partner')} className="hover:text-white transition-colors text-left cursor-pointer font-medium text-amber-400">
                  Partner Overview &amp; Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSwitchRole ? onSwitchRole('partner') : onNavigateTab?.('partner')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Live Agency Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('partner')} className="hover:text-white transition-colors text-left cursor-pointer">
                  B2B Demand Overflow
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('help')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Partner Requirements &amp; RC
                </button>
              </li>
              <li>
                <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Insured by Wafa Assurance
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Story */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Company</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab?.('mission')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Our Mission &amp; Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('help')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Help Center &amp; FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('contracts')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Rental Contracts &amp; Terms
                </button>
              </li>
              <li>
                <a href="mailto:salam@airbcar.com" className="hover:text-white transition-colors text-left inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-neutral-400" />
                  salam@airbcar.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Renter Account */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Account &amp; Security</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab?.('overview')} className="hover:text-white transition-colors text-left cursor-pointer">
                  My Trips &amp; Bookings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('contracts')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Active Rental Contracts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('documents')} className="hover:text-white transition-colors text-left cursor-pointer">
                  CIN &amp; Driving License
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab?.('help')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Deposit &amp; Fuel Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-white text-base">airbcar</span>
            <span>· The Moroccan mobility platform © 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
            <span>RC Casablanca 492019</span>
            <span>·</span>
            <span>ICE 00293810290001</span>
            <span>·</span>
            <span>CNDP Compliance No. D-W-419/2024</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
