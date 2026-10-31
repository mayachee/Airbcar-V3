import React, { useState } from 'react';
import { AdminClient } from '../../types/admin';
import { 
  Search, Filter, UserCheck, Shield, Star, ExternalLink, 
  MapPin, Phone, MessageSquare, AlertCircle, Award, Eye
} from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { AdminClientDetailModal } from './AdminClientDetailModal';

interface AdminClientsViewProps {
  clients: AdminClient[];
  onUpdateTrustScore: (clientId: string, newScore: AdminClient['trustScore']) => void;
  onViewBooking?: (bookingId: string) => void;
}

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({
  clients,
  onUpdateTrustScore,
  onViewBooking,
}) => {
  const { isLight } = useAccountSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);

  const formatMAD = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.cinOrPassport.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesScore = filterScore === 'all' || client.trustScore === filterScore;
    return matchesSearch && matchesScore;
  });

  const totalClients = clients.length;
  const vipCount = clients.filter(c => c.trustScore === 'vip').length;
  const totalVolume = clients.reduce((acc, c) => acc + c.totalSpentMAD, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients & Renters Registry</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Audited renter identities, Moroccan CIN & international passport verification, driving license validations, and trust metrics.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-[#18120d] border-[#2e231c]'}`}>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Registered</span>
            <p className="text-base font-bold text-[#f95721]">{totalClients} Renters</p>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-[#18120d] border-[#2e231c]'}`}>
            <span className="text-[10px] uppercase font-bold text-neutral-400">VIP Renters</span>
            <p className="text-base font-bold text-amber-400">{vipCount} VIPs</p>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-[#18120d] border-[#2e231c]'}`}>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Client GMV</span>
            <p className="text-base font-bold text-emerald-500">{formatMAD(totalVolume)}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-neutral-200 shadow-xs' : 'bg-[#18120d] border-[#2e231c]'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, passport, CIN, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#f95721] ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c] text-white'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Renters' },
            { id: 'vip', label: '👑 VIP' },
            { id: 'verified_good', label: '✅ Good Standing' },
            { id: 'under_review', label: '🔍 Under Review' },
            { id: 'flagged', label: '⚠️ Flagged' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterScore(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterScore === f.id
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : isLight ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' : 'bg-[#201813] text-neutral-400 hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Renters Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#18120d] border-[#2e231c]'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-neutral-400 uppercase tracking-wider text-[11px] font-bold ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
            }`}>
              <tr>
                <th className="p-4">Renter Identity</th>
                <th className="p-4">Passport / CIN</th>
                <th className="p-4">Permis de Conduire</th>
                <th className="p-4">Trips & Spend</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Trust Status</th>
                <th className="p-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-[#2e231c]">
              {filteredClients.map(client => (
                <tr 
                  key={client.id}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Identity */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={client.avatar} 
                        alt={client.fullName} 
                        className="w-10 h-10 rounded-xl object-cover border border-[#f95721]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm">{client.fullName}</span>
                          <span>{client.flag}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <span>{client.email}</span>
                          <span>•</span>
                          <span>{client.phone}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ID / Passport */}
                  <td className="p-4">
                    <div className="font-mono text-xs">
                      <span className="font-bold text-[#f95721]">{client.cinOrPassport.number}</span>
                      <span className="block text-[11px] text-neutral-400 mt-0.5 uppercase">
                        {client.cinOrPassport.type} • Exp: {client.cinOrPassport.expiryDate}
                      </span>
                    </div>
                  </td>

                  {/* Driving License */}
                  <td className="p-4">
                    <div>
                      <span className="font-mono font-semibold">{client.drivingLicense.number}</span>
                      <span className="block text-[11px] text-emerald-500 mt-0.5">
                        {client.drivingLicense.yearsExperience} yrs exp • Cat: {client.drivingLicense.categories.join(', ')}
                      </span>
                    </div>
                  </td>

                  {/* Trips & Spend */}
                  <td className="p-4">
                    <div>
                      <span className="font-bold text-sm text-emerald-500">{formatMAD(client.totalSpentMAD)}</span>
                      <span className="block text-[11px] text-neutral-400 mt-0.5">
                        {client.totalBookings} rentals completed
                      </span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-sm">{client.rating}</span>
                      <span className="text-[11px] text-neutral-400">/ 5.0</span>
                    </div>
                  </td>

                  {/* Trust Score */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                      client.trustScore === 'vip' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      client.trustScore === 'verified_good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      client.trustScore === 'under_review' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {client.trustScore === 'vip' && <span>👑</span>}
                      {client.trustScore.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedClient(client)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f95721]/10 hover:bg-[#f95721]/20 text-[#f95721] border border-[#f95721]/20 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dossier */}
      {selectedClient && (
        <AdminClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdateTrustScore={onUpdateTrustScore}
          onViewBooking={onViewBooking}
        />
      )}

    </div>
  );
};
