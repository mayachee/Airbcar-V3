import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Star, 
  Eye, 
  Flag, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { AdminVehicle } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface AdminFleetViewProps {
  vehicles: AdminVehicle[];
  selectedAgencyFilter?: string;
  onClearAgencyFilter?: () => void;
  onToggleFeatureVehicle: (vehicleId: string) => void;
  onToggleFlagVehicle: (vehicleId: string, reason?: string) => void;
}

export const AdminFleetView: React.FC<AdminFleetViewProps> = ({
  vehicles,
  selectedAgencyFilter,
  onClearAgencyFilter,
  onToggleFeatureVehicle,
  onToggleFlagVehicle,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'on_trip' | 'flagged'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'compliant' | 'inspection_due' | 'flagged'>('all');
  const [previewVehicle, setPreviewVehicle] = useState<AdminVehicle | null>(null);

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.agencyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAgency = !selectedAgencyFilter || v.agencyId === selectedAgencyFilter;
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesCity = cityFilter === 'all' || v.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesCompliance = complianceFilter === 'all' || v.complianceStatus === complianceFilter;

    return matchesSearch && matchesAgency && matchesStatus && matchesCity && matchesCompliance;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            National Fleet Registry
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Master Fleet Inventory & Vehicle Governance
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Auditing {vehicles.length} partner-listed vehicles across Morocco for insurance, roadworthiness, and listing quality.
          </p>
        </div>

        {selectedAgencyFilter && onClearAgencyFilter && (
          <button
            type="button"
            onClick={onClearAgencyFilter}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30 hover:bg-[#f95721]/25 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Filtering by Agency</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
      }`}>
        {/* Search */}
        <div className={`relative w-full md:max-w-md rounded-2xl border flex items-center ${
          isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#221813] border-[#36271e]'
        }`}>
          <Search className="w-4 h-4 text-[#8d7e73] ml-3.5" />
          <input
            type="text"
            placeholder="Search by plate (e.g. 4218-A-6), make, model, agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-2 text-xs focus:outline-none placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mr-3 text-xs text-[#8d7e73] hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {/* Status Tabs */}
          {(['all', 'available', 'on_trip', 'flagged'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : isLight
                  ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  : 'bg-[#241a14] text-[#8d7e73] hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Status' : st === 'available' ? 'Available' : st === 'on_trip' ? 'On Trip' : 'Flagged'}
            </button>
          ))}

          {/* Compliance Filter */}
          <select
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none ${
              isLight ? 'bg-white border-neutral-300 text-neutral-800' : 'bg-[#201813] border-[#36271e] text-[#f5efe8]'
            }`}
          >
            <option value="all">All Compliance</option>
            <option value="compliant">Compliant</option>
            <option value="inspection_due">Inspection Due</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const isFlagged = vehicle.status === 'flagged' || vehicle.complianceStatus === 'flagged';
          const isInspectionDue = vehicle.complianceStatus === 'inspection_due';

          return (
            <div
              key={vehicle.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                isFlagged 
                  ? isLight ? 'bg-rose-50/50 border-rose-300' : 'bg-rose-950/20 border-rose-800/50'
                  : isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#1a130f] border-[#2b2018]'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                />
                
                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    vehicle.status === 'available' ? 'bg-emerald-600 text-white' :
                    vehicle.status === 'on_trip' ? 'bg-blue-600 text-white' :
                    vehicle.status === 'maintenance' ? 'bg-amber-600 text-white' :
                    'bg-rose-600 text-white'
                  }`}>
                    {vehicle.status.replace('_', ' ').toUpperCase()}
                  </span>

                  {vehicle.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f95721] text-white flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Moroccan License Plate on image */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 font-mono font-bold text-xs text-white">
                  {vehicle.plate}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{vehicle.rating.toFixed(2)}</span>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm truncate">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </h3>
                    <span className="font-bold font-mono text-[#f95721]">
                      {formatPrice(vehicle.dailyRate)}/d
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#8d7e73] text-[11px]">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{vehicle.agencyName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {vehicle.city}
                    </span>
                  </div>
                </div>

                {/* Compliance info */}
                <div className={`p-2.5 rounded-xl border space-y-1 text-[11px] ${
                  isFlagged ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                  isInspectionDue ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-[#221813] border-[#31241a] text-[#8d7e73]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>Insurance Expiry:</span>
                    <span className="font-mono font-semibold">{vehicle.insuranceExpiry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Technical Inspection:</span>
                    <span className="font-mono font-semibold">{vehicle.technicalInspectionDate}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-500/15">
                    <span>Audit Status:</span>
                    <span className={`font-bold uppercase text-[9px] ${
                      vehicle.complianceStatus === 'compliant' ? 'text-emerald-500' :
                      vehicle.complianceStatus === 'inspection_due' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {vehicle.complianceStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-500/15">
                  {/* Feature Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleFeatureVehicle(vehicle.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                      vehicle.isFeatured 
                        ? 'bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30'
                        : 'bg-neutral-500/15 text-[#8d7e73] hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{vehicle.isFeatured ? 'Featured' : 'Feature'}</span>
                  </button>

                  {/* Flag / Unflag */}
                  <button
                    type="button"
                    onClick={() => onToggleFlagVehicle(vehicle.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                      isFlagged
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'text-rose-500 hover:bg-rose-500/10'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>{isFlagged ? 'Clear Flag' : 'Flag Listing'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
