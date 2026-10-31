import React, { useState, useRef } from 'react';
import { 
  Car, 
  Calendar, 
  Plus, 
  Share2, 
  Slash, 
  Fuel, 
  Settings2, 
  Check, 
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  X,
  Search,
  MapPin,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Users,
  Globe,
  ExternalLink,
  Copy,
  Star,
  Clock,
  Sparkles,
  Shield,
  Briefcase,
  Wind,
  Lock,
  MessageSquare,
  UploadCloud,
  Upload,
  Layers,
  Image as ImageIcon,
  CheckCheck,
  RefreshCw,
  Hash
} from 'lucide-react';
import { PartnerVehicle, PartnerProfile } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerVehiclesViewProps {
  vehicles: PartnerVehicle[];
  onToggleB2b: (vehicleId: string) => void;
  onAddBlackout: (vehicleId: string, blackout: { start: string; end: string; reason: string }) => void;
  onAddVehicle?: (newVehicle: PartnerVehicle | PartnerVehicle[]) => void;
  onUpdateVehicle?: (updatedVehicle: PartnerVehicle) => void;
  onDeleteVehicle?: (vehicleId: string) => void;
  partnerProfile?: PartnerProfile;
}

const PRESET_CAR_PHOTOS = [
  { name: 'Volkswagen Golf VII', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Audi A6 40 TDI', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Mercedes-Benz AMG GT', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Ford Mustang GT', url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Dacia Duster 4x4', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Range Rover Velar', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80' },
];

export const PartnerVehiclesView: React.FC<PartnerVehiclesViewProps> = ({
  vehicles: initialVehicles,
  onToggleB2b,
  onAddBlackout,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  partnerProfile,
}) => {
  const { isLight, formatPrice, t, currency } = useAccountSettings();
  const [vehicles, setVehicles] = useState<PartnerVehicle[]>(initialVehicles);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'on_trip' | 'blackout'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [viewingVehicle, setViewingVehicle] = useState<PartnerVehicle | null>(null);
  const [viewModalTab, setViewModalTab] = useState<'public' | 'telemetry'>('public');
  const [copiedLink, setCopiedLink] = useState(false);
  const [reserveSimulationToast, setReserveSimulationToast] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<PartnerVehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<PartnerVehicle | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blackoutTargetVehicle, setBlackoutTargetVehicle] = useState<PartnerVehicle | null>(null);

  // Blackout form state
  const [blackoutStart, setBlackoutStart] = useState('');
  const [blackoutEnd, setBlackoutEnd] = useState('');
  const [blackoutReason, setBlackoutReason] = useState('Scheduled maintenance');

  // Add Vehicle Form State
  const [addMake, setAddMake] = useState('Volkswagen');
  const [addModel, setAddModel] = useState('Golf 8');
  const [addYear, setAddYear] = useState<number>(2025);
  const [addPlate, setAddPlate] = useState('6512-B-6');
  const [addCity, setAddCity] = useState('Agadir');
  const [addDailyRate, setAddDailyRate] = useState<number>(550);
  const [addDeposit, setAddDeposit] = useState<number>(2500);
  const [addTransmission, setAddTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [addFuelType, setAddFuelType] = useState<'Diesel' | 'Petrol' | 'Electric' | 'Hybrid'>('Diesel');
  const [addSeats, setAddSeats] = useState<number>(5);
  const [addImage, setAddImage] = useState(PRESET_CAR_PHOTOS[0].url);
  const [addIsB2b, setAddIsB2b] = useState(true);

  // Batch Multi-Car Addition State (Add 3-5 cars with identical specs)
  const [batchQuantity, setBatchQuantity] = useState<number>(1);
  const [batchPlates, setBatchPlates] = useState<string[]>(['6512-B-6', '6513-B-6', '6514-B-6', '6515-B-6', '6516-B-6']);

  // Image Uploading State
  const [uploadedImages, setUploadedImages] = useState<string[]>([PRESET_CAR_PHOTOS[0].url]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to generate sequential Moroccan license plates based on the first plate
  const generateSequentialPlates = (firstPlate: string, count: number): string[] => {
    const plates: string[] = [firstPlate];
    // Check if plate matches pattern like 6512-B-6 or 6512 B 6 or digits
    const match = firstPlate.match(/^(\d+)([-\s/])(.+)$/);
    if (match) {
      const startNum = parseInt(match[1], 10);
      const separator = match[2];
      const rest = match[3];
      const numDigits = match[1].length;
      for (let i = 1; i < count; i++) {
        const nextNum = (startNum + i).toString().padStart(numDigits, '0');
        plates.push(`${nextNum}${separator}${rest}`);
      }
    } else {
      for (let i = 1; i < count; i++) {
        plates.push(`${firstPlate}-${i + 1}`);
      }
    }
    return plates;
  };

  const handleBasePlateChange = (newPlate: string) => {
    setAddPlate(newPlate);
    if (batchQuantity > 1) {
      const seq = generateSequentialPlates(newPlate, Math.max(batchQuantity, 5));
      setBatchPlates(seq);
    }
  };

  const handleSelectBatchCount = (count: number) => {
    setBatchQuantity(count);
    if (count > 1) {
      const seq = generateSequentialPlates(addPlate, Math.max(count, 5));
      setBatchPlates(seq);
    }
  };

  const handleBatchPlateItemChange = (index: number, val: string) => {
    setBatchPlates(prev => {
      const copy = [...prev];
      copy[index] = val;
      if (index === 0) {
        setAddPlate(val);
      }
      return copy;
    });
  };

  const handleAutoSequencePlates = () => {
    const lead = batchPlates[0] || addPlate || '6512-B-6';
    const seq = generateSequentialPlates(lead, Math.max(batchQuantity, 5));
    setBatchPlates(seq);
    showToast(`Sequential plates generated from ${lead}`);
  };

  // Image Upload Handlers
  const handleFilesSelected = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Please select valid image files (PNG, JPG, WEBP)');
      return;
    }

    const readers = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(dataUrls => {
      const filtered = dataUrls.filter(Boolean);
      setUploadedImages(prev => {
        const next = [...filtered, ...prev.filter(img => !filtered.includes(img))];
        return next;
      });
      if (filtered.length > 0) {
        setAddImage(filtered[0]);
      }
      showToast(`${filtered.length} vehicle image${filtered.length > 1 ? 's' : ''} uploaded`);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length > 0) {
        setAddImage(updated[0]);
      } else {
        setAddImage(PRESET_CAR_PHOTOS[0].url);
      }
      return updated;
    });
  };

  const handleSetCoverImage = (imgUrl: string) => {
    setAddImage(imgUrl);
    setUploadedImages(prev => [imgUrl, ...prev.filter(img => img !== imgUrl)]);
    showToast('Cover photo updated');
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch = 
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleToggleB2BLocal = (id: string) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, isB2bEligible: !v.isB2bEligible } : v));
    onToggleB2b(id);
    showToast('B2B Car-Share eligibility updated');
  };

  // Add Vehicle Handler (Single or Batch 3-5 Vehicles)
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = addImage || (uploadedImages.length > 0 ? uploadedImages[0] : PRESET_CAR_PHOTOS[0].url);
    const finalImagesList = uploadedImages.length > 0 ? uploadedImages : [finalImage];

    if (batchQuantity === 1) {
      const newCar: PartnerVehicle = {
        id: `veh-${Date.now()}`,
        make: addMake.trim(),
        model: addModel.trim(),
        year: Number(addYear),
        plate: addPlate.trim(),
        city: addCity,
        dailyRate: Number(addDailyRate),
        depositAmount: Number(addDeposit),
        transmission: addTransmission,
        fuelType: addFuelType,
        seats: Number(addSeats),
        status: 'available',
        isB2bEligible: addIsB2b,
        image: finalImage,
        images: finalImagesList,
        rating: 5.0,
        tripsCount: 0,
        blackoutDates: [],
      };

      setVehicles(prev => [newCar, ...prev]);
      if (onAddVehicle) onAddVehicle(newCar);
      setIsAddModalOpen(false);
      showToast(`${newCar.make} ${newCar.model} (${newCar.plate}) added to fleet!`);
    } else {
      // Validate batch plates
      const finalizedPlates: string[] = [];
      for (let i = 0; i < batchQuantity; i++) {
        const p = batchPlates[i]?.trim();
        if (!p) {
          showToast(`Please enter the license plate for Car #${i + 1}`);
          return;
        }
        finalizedPlates.push(p);
      }

      // Check unique plates in batch
      const plateSet = new Set(finalizedPlates.map(p => p.toLowerCase()));
      if (plateSet.size !== finalizedPlates.length) {
        showToast('All license plates in the batch must be unique');
        return;
      }

      const timestamp = Date.now();
      const newCars: PartnerVehicle[] = finalizedPlates.map((plate, idx) => ({
        id: `veh-${timestamp}-${idx}`,
        make: addMake.trim(),
        model: addModel.trim(),
        year: Number(addYear),
        plate: plate,
        city: addCity,
        dailyRate: Number(addDailyRate),
        depositAmount: Number(addDeposit),
        transmission: addTransmission,
        fuelType: addFuelType,
        seats: Number(addSeats),
        status: 'available',
        isB2bEligible: addIsB2b,
        image: finalImage,
        images: finalImagesList,
        rating: 5.0,
        tripsCount: 0,
        blackoutDates: [],
      }));

      setVehicles(prev => [...newCars, ...prev]);
      if (onAddVehicle) onAddVehicle(newCars);
      setIsAddModalOpen(false);
      showToast(`Batch addition: ${newCars.length} identical ${addMake} ${addModel} vehicles added to fleet!`);
    }
  };

  // Edit Vehicle Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? editingVehicle : v));
    if (onUpdateVehicle) onUpdateVehicle(editingVehicle);
    showToast(`Updated ${editingVehicle.make} ${editingVehicle.model}`);
    setEditingVehicle(null);
  };

  // Delete Vehicle Handler
  const handleConfirmDelete = () => {
    if (!deletingVehicle) return;
    const deletedId = deletingVehicle.id;
    const deletedName = `${deletingVehicle.make} ${deletingVehicle.model}`;
    setVehicles(prev => prev.filter(v => v.id !== deletedId));
    if (onDeleteVehicle) onDeleteVehicle(deletedId);
    setDeletingVehicle(null);
    showToast(`${deletedName} removed from fleet`);
  };

  // Save Blackout
  const handleSaveBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blackoutTargetVehicle || !blackoutStart || !blackoutEnd) return;

    const newBo = {
      id: `bo-${Date.now()}`,
      start: blackoutStart,
      end: blackoutEnd,
      reason: blackoutReason,
    };

    setVehicles(prev => prev.map(v => {
      if (v.id === blackoutTargetVehicle.id) {
        return {
          ...v,
          status: 'blackout',
          blackoutDates: [...(v.blackoutDates || []), newBo],
        };
      }
      return v;
    }));

    onAddBlackout(blackoutTargetVehicle.id, newBo);
    setBlackoutTargetVehicle(null);
    setBlackoutStart('');
    setBlackoutEnd('');
    showToast('Blackout dates saved');
  };

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1e1611] text-white border border-[#f95721]/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#f95721]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {t('fleetVehicles', 'Fleet Management')} ({vehicles.length} Vehicles)
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
            DRF Endpoints: <code className="text-[#f95721] text-[10px]">/listings/?partner_id=me</code> and <code className="text-[#f95721] text-[10px]">/partners/b2b/listings/</code>
          </p>
        </div>

        {/* Action: Add Vehicle */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
          }`} />
          <input
            type="text"
            placeholder="Search by make, model, plate, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full text-xs pl-9 pr-4 py-2 rounded-xl border focus:outline-none focus:border-[#f95721] ${
              isLight 
                ? 'bg-neutral-50 text-neutral-900 border-neutral-200 placeholder-neutral-400' 
                : 'bg-[#241b15] text-[#f5efe8] border-[#382b21] placeholder-[#7d6e63]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {(['all', 'available', 'on_trip', 'blackout'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : isLight
                  ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                  : 'text-[#8d7e73] hover:text-white bg-[#241b15]'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredVehicles.map((car) => {
          const isOnTrip = car.status === 'on_trip';
          const isBlackout = car.status === 'blackout';

          return (
            <div
              key={car.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all shadow-xs group ${
                isLight 
                  ? 'bg-white border-neutral-200 hover:border-[#f95721]/50' 
                  : 'bg-[#1a130f] border-[#2b2018] hover:border-[#3d2e23]'
              }`}
            >
              <div>
                {/* Photo with badges */}
                <div className={`w-full h-44 relative overflow-hidden group/card-img ${
                  isLight ? 'bg-neutral-100' : 'bg-[#261d16]'
                }`}>
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                      isOnTrip
                        ? 'bg-amber-500/90 text-white'
                        : isBlackout
                        ? 'bg-red-500/90 text-white'
                        : 'bg-emerald-500/90 text-white'
                    }`}>
                      {isOnTrip ? 'On Trip' : isBlackout ? 'Blackout / Maint.' : 'Available'}
                    </span>
                  </div>

                  {/* Public View Quick Hover Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setViewingVehicle(car);
                      setViewModalTab('public');
                    }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/card-img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[2px] cursor-pointer"
                  >
                    <span className="p-2 rounded-full bg-[#f95721] text-white shadow-lg transform group-hover/card-img:scale-110 transition-transform">
                      <Globe className="w-4 h-4" />
                    </span>
                    <span className="bg-black/70 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">
                      Open Public View
                    </span>
                  </button>

                  {/* Plate pill */}
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white font-mono font-bold tracking-wider border border-white/10">
                    {car.plate}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-serif-display text-base font-bold ${
                        isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
                      }`}>
                        {car.make} {car.model}
                      </h3>
                      <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>{car.year} • {car.city}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#f95721]">{formatPrice(car.dailyRate)}</span>
                      <span className={`text-[10px] block ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>/ day</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className={`grid grid-cols-3 gap-1.5 py-2 border-y text-[11px] ${
                    isLight ? 'border-neutral-100 text-neutral-600' : 'border-[#261d16] text-[#a89b90]'
                  }`}>
                    <div className="text-center">
                      <span className={`block text-[9px] uppercase font-bold ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>Gearbox</span>
                      {car.transmission}
                    </div>
                    <div className="text-center">
                      <span className={`block text-[9px] uppercase font-bold ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>Fuel</span>
                      {car.fuelType}
                    </div>
                    <div className="text-center">
                      <span className={`block text-[9px] uppercase font-bold ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>Deposit</span>
                      <span className="font-semibold text-[#f95721]">{formatPrice(car.depositAmount)}</span>
                    </div>
                  </div>

                  {/* B2B Sharing Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-xs flex items-center gap-1.5 ${
                      isLight ? 'text-neutral-600' : 'text-[#a89b90]'
                    }`}>
                      <Share2 className="w-3.5 h-3.5 text-[#f95721]" />
                      B2B Car-Share
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleB2BLocal(car.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        car.isB2bEligible ? 'bg-[#f95721]' : isLight ? 'bg-neutral-300' : 'bg-[#2f231b]'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          car.isB2bEligible ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions: Public View, Edit, Delete, Blackout */}
              <div className={`p-3 border-t space-y-2 transition-colors ${
                isLight ? 'bg-neutral-50 border-neutral-100' : 'bg-[#17100c] border-[#261d16]'
              }`}>
                <div className="grid grid-cols-3 gap-1.5">
                  {/* Public View */}
                  <button
                    type="button"
                    onClick={() => {
                      setViewingVehicle(car);
                      setViewModalTab('public');
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isLight
                        ? 'bg-blue-50/80 hover:bg-blue-100 text-blue-700 border-blue-200 shadow-2xs'
                        : 'bg-blue-950/30 hover:bg-blue-900/40 text-blue-400 hover:text-blue-300 border-blue-900/40 shadow-2xs'
                    }`}
                    title="View Public Marketplace Listing"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Public View</span>
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => setEditingVehicle({ ...car })}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isLight
                        ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                        : 'bg-[#221813] hover:bg-[#2c2019] text-[#c9b8ab] hover:text-white border-[#34261e]'
                    }`}
                    title="Edit Vehicle"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Edit</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeletingVehicle(car)}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isLight
                        ? 'bg-white hover:bg-rose-50 text-rose-600 border-neutral-200 hover:border-rose-300'
                        : 'bg-[#221813] hover:bg-rose-950/40 text-[#c9b8ab] hover:text-rose-400 border-[#34261e] hover:border-rose-900/40'
                    }`}
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Blackout dates action */}
                <button
                  type="button"
                  onClick={() => {
                    setBlackoutTargetVehicle(car);
                  }}
                  className="w-full py-1.5 rounded-xl text-[11px] font-semibold bg-[#1e1510] hover:bg-[#281c15] text-[#8d7e73] hover:text-[#f5efe8] border border-[#2b2018] transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Slash className="w-3 h-3 text-[#f95721]" />
                  <span>Blackout Dates {car.blackoutDates && car.blackoutDates.length > 0 && `(${car.blackoutDates.length})`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: VIEW VEHICLE DETAILS (PUBLIC & FLEET VIEW) */}
      {/* ======================================================== */}
      {viewingVehicle && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl border max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-5 overflow-y-auto max-h-[92vh] transition-colors ${
            isLight 
              ? 'bg-white border-neutral-200 text-neutral-900' 
              : 'bg-[#1a130f] border-[#2b2018] text-[#f5efe8]'
          }`}>
            
            {/* Simulation or Copy Toast */}
            {(reserveSimulationToast || copiedLink) && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>
                    {reserveSimulationToast 
                      ? `Customer Reservation Simulated! A test booking request for ${viewingVehicle.make} ${viewingVehicle.model} was processed.`
                      : 'Public vehicle listing URL copied to clipboard!'}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setReserveSimulationToast(false); setCopiedLink(false); }}
                  className="text-emerald-400 hover:text-emerald-200 cursor-pointer text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Modal Header & Navigation Switcher */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
              isLight ? 'border-neutral-200' : 'border-[#261d16]'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30">
                    <Globe className="w-3 h-3" />
                    Public View Preview
                  </span>
                  <span className={`text-[11px] font-medium flex items-center gap-1 ${
                    isLight ? 'text-neutral-500' : 'text-[#8d7e73]'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {partnerProfile?.agencyName || 'Atlas Drive Luxury Cars'}
                  </span>
                </div>
                <h3 className={`font-serif-display text-xl sm:text-2xl font-bold ${
                  isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
                }`}>
                  {viewingVehicle.make} {viewingVehicle.model} ({viewingVehicle.year})
                </h3>
              </div>

              {/* View Switcher Tabs & Actions */}
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-2xl flex items-center border ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#221813] border-[#34261e]'
                }`}>
                  <button
                    type="button"
                    onClick={() => setViewModalTab('public')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewModalTab === 'public'
                        ? 'bg-[#f95721] text-white shadow-xs'
                        : isLight
                        ? 'text-neutral-600 hover:text-neutral-900'
                        : 'text-[#8d7e73] hover:text-[#f5efe8]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewModalTab('telemetry')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewModalTab === 'telemetry'
                        ? 'bg-[#f95721] text-white shadow-xs'
                        : isLight
                        ? 'text-neutral-600 hover:text-neutral-900'
                        : 'text-[#8d7e73] hover:text-[#f5efe8]'
                    }`}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Fleet Admin</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://moroccodrive.ma/vehicles/${viewingVehicle.id}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 3000);
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200' 
                      : 'bg-[#221813] hover:bg-[#2c2019] text-[#c9b8ab] border-[#34261e]'
                  }`}
                  title="Copy Public Link"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewingVehicle(null)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200' 
                      : 'bg-[#221813] hover:bg-[#2c2019] text-[#c9b8ab] border-[#34261e]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: PUBLIC VIEW (CUSTOMER MARKETPLACE VIEW) */}
            {viewModalTab === 'public' && (
              <div className="space-y-6">
                {/* Public Marketplace Banner */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  isLight 
                    ? 'bg-blue-50/70 border-blue-200/80 text-blue-900' 
                    : 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>
                      <strong>Renter Public View</strong>: This is the live listing layout seen by domestic and international travelers browsing Morocco Drive.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono hidden sm:inline px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    moroccodrive.ma/vehicles/{viewingVehicle.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Vehicle Showcase */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Hero Image with customer trust badges */}
                    <div className="w-full h-64 sm:h-72 rounded-3xl overflow-hidden relative border shadow-sm group">
                      <img
                        src={viewingVehicle.image}
                        alt={`${viewingVehicle.make} ${viewingVehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Instant Booking
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/75 text-amber-400 backdrop-blur-md border border-white/10 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          4.9 (38 Reviews)
                        </span>
                      </div>

                      {/* Bottom Overlay Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/80 text-white backdrop-blur-md border border-white/15">
                          {viewingVehicle.dailyRate >= 600 ? 'Premium & Luxury' : viewingVehicle.seats > 5 ? 'Family Carrier' : 'Comfort Tourer'}
                        </span>
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#f95721] text-white shadow-md flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {viewingVehicle.city}, Morocco
                        </span>
                      </div>
                    </div>

                    {/* Specifications Grid for Travelers */}
                    <div className="space-y-2">
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${
                        isLight ? 'text-neutral-500' : 'text-[#8d7e73]'
                      }`}>
                        Vehicle Specifications
                      </h4>
                      <div className={`grid grid-cols-3 sm:grid-cols-6 gap-2 text-center`}>
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e2119]'
                        }`}>
                          <Users className="w-4 h-4 mx-auto mb-1 text-[#f95721]" />
                          <span className={`block text-[10px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Seats</span>
                          <span className="font-bold text-xs">{viewingVehicle.seats || 5} Adults</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e2119]'
                        }`}>
                          <Settings2 className="w-4 h-4 mx-auto mb-1 text-[#f95721]" />
                          <span className={`block text-[10px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Gearbox</span>
                          <span className="font-bold text-xs">{viewingVehicle.transmission}</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e2119]'
                        }`}>
                          <Fuel className="w-4 h-4 mx-auto mb-1 text-[#f95721]" />
                          <span className={`block text-[10px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Fuel</span>
                          <span className="font-bold text-xs">{viewingVehicle.fuelType}</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e2119]'
                        }`}>
                          <Wind className="w-4 h-4 mx-auto mb-1 text-[#f95721]" />
                          <span className={`block text-[10px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Climate</span>
                          <span className="font-bold text-xs">Dual A/C</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e2119]'
                        }`}>
                          <Briefcase className="w-4 h-4 mx-auto mb-1 text-[#f95721]" />
                          <span className={`block text-[10px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Luggage</span>
                          <span className="font-bold text-xs">2 Large Bags</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2e2119]'
                        }`}>
                          <Sparkles className="w-4 h-4 mx-auto mb-1 text-[#f95721]" />
                          <span className={`block text-[10px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Mileage</span>
                          <span className="font-bold text-xs">Unlimited</span>
                        </div>
                      </div>
                    </div>

                    {/* What is Included (Free Perks) */}
                    <div className={`p-4 rounded-3xl border space-y-3 ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2c2019]'
                    }`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLight ? 'text-neutral-800' : 'text-[#f5efe8]'
                      }`}>
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        Included in Public Rental Rate
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Comprehensive CDW Insurance</strong> with third-party liability</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Free Airport Handover</strong> at {viewingVehicle.city} Airport terminal</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>24/7 Roadside Assistance</strong> anywhere in Morocco</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Free Cancellation</strong> up to 48 hours before pickup</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Second Driver</strong> registered at no extra charge</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Sanitized & Full Tank</strong> verified handover policy</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Traveler Feedback Preview */}
                    <div className={`p-4 rounded-3xl border space-y-3 ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2c2019]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isLight ? 'text-neutral-800' : 'text-[#f5efe8]'
                        }`}>
                          <MessageSquare className="w-3.5 h-3.5 text-[#f95721]" />
                          Verified Renter Feedback
                        </h4>
                        <span className="text-[11px] text-amber-500 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500" />
                          4.9 / 5.0 Rating
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className={`p-2.5 rounded-2xl border ${
                          isLight ? 'bg-white border-neutral-200' : 'bg-[#261d16] border-[#382b21]'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-xs">Jean-Paul V. (Paris, France)</span>
                            <span className={`text-[10px] ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>2 weeks ago</span>
                          </div>
                          <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-[#c9b8ab]'}`}>
                            "The {viewingVehicle.make} {viewingVehicle.model} was spotless and ready at the airport. Extremely smooth drive through the Tizi n'Tichka pass. Agency staff was punctual and professional."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Customer Booking Box Simulation */}
                  <div className="space-y-4">
                    <div className={`p-5 rounded-3xl border shadow-lg space-y-4 ${
                      isLight ? 'bg-white border-neutral-200' : 'bg-[#201813] border-[#2e2119]'
                    }`}>
                      <div className="flex items-baseline justify-between border-b pb-3 border-neutral-200 dark:border-[#2b2018]">
                        <div>
                          <span className="text-2xl font-bold text-[#f95721]">
                            {formatPrice(viewingVehicle.dailyRate)}
                          </span>
                          <span className={`text-xs ml-1 ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                            / day
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          Available Today
                        </span>
                      </div>

                      {/* Customer Dates Simulator */}
                      <div className="space-y-2 text-xs">
                        <div className={`p-2.5 rounded-2xl border space-y-1 ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#261d16] border-[#382b21]'
                        }`}>
                          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                            <span>Pickup & Return Location</span>
                          </div>
                          <p className={`text-xs pl-5 ${isLight ? 'text-neutral-700' : 'text-[#e5dcd3]'}`}>
                            {viewingVehicle.city} Menara Airport (Complimentary)
                          </p>
                        </div>

                        <div className={`p-2.5 rounded-2xl border space-y-1 ${
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#261d16] border-[#382b21]'
                        }`}>
                          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>Sample Trip Duration</span>
                          </div>
                          <p className={`text-xs pl-5 ${isLight ? 'text-neutral-700' : 'text-[#e5dcd3]'}`}>
                            3 Days Rental (Weekend Escape)
                          </p>
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className={`pt-3 border-t space-y-2 text-xs ${
                        isLight ? 'border-neutral-100 text-neutral-600' : 'border-[#291e17] text-[#c9b8ab]'
                      }`}>
                        <div className="flex justify-between">
                          <span>3 days rental:</span>
                          <span className="font-semibold">{formatPrice(viewingVehicle.dailyRate * 3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insurance coverage:</span>
                          <span className="text-emerald-500 font-semibold">Included (Free)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Airport delivery fee:</span>
                          <span className="text-emerald-500 font-semibold">0 MAD</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t text-sm border-neutral-200 dark:border-[#2b2018]">
                          <span className={isLight ? 'text-neutral-900' : 'text-white'}>Estimated Total:</span>
                          <span className="text-[#f95721]">{formatPrice(viewingVehicle.dailyRate * 3)}</span>
                        </div>
                        <div className={`text-[11px] p-2.5 rounded-xl border flex items-start gap-2 ${
                          isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                        }`}>
                          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                          <span>
                            <strong>Security Deposit</strong>: {formatPrice(viewingVehicle.depositAmount)} temporary card pre-authorization hold at check-in.
                          </span>
                        </div>
                      </div>

                      {/* Interactive Customer Reservation Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setReserveSimulationToast(true);
                          setTimeout(() => setReserveSimulationToast(false), 4500);
                        }}
                        className="w-full py-3 rounded-2xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Simulate Customer Booking</span>
                      </button>

                      {/* Direct WhatsApp / Phone Contact */}
                      <div className="pt-1">
                        <a
                          href={`https://wa.me/212600000000?text=Hello%20I%20am%20interested%20in%20renting%20the%20${encodeURIComponent(viewingVehicle.make + ' ' + viewingVehicle.model)}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-full py-2.5 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                              : 'bg-[#261d16] hover:bg-[#30241d] text-[#e5dcd3] border-[#382b21]'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Inquire via WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Agency Compliance Badge */}
                    <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1b1410] border-[#2b2018]'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorized Partner Agency</span>
                      </div>
                      <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        Licensed by Morocco Ministry of Transport. All contracts are digitally counter-signed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FLEET TELEMETRY & INTERNAL SPECS */}
            {viewModalTab === 'telemetry' && (
              <div className="space-y-5">
                {/* Vehicle Hero Image */}
                <div className="w-full h-56 rounded-2xl overflow-hidden relative border border-[#2b2018]">
                  <img
                    src={viewingVehicle.image}
                    alt={viewingVehicle.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                      viewingVehicle.status === 'on_trip'
                        ? 'bg-amber-500/90 text-white'
                        : viewingVehicle.status === 'blackout'
                        ? 'bg-red-500/90 text-white'
                        : 'bg-emerald-500/90 text-white'
                    }`}>
                      {viewingVehicle.status === 'on_trip' ? 'Currently On Trip' : viewingVehicle.status === 'blackout' ? 'Blackout / In Shop' : 'Available for Booking'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border border-white/20">
                    {viewingVehicle.plate}
                  </div>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2d2119]'}`}>
                    <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Daily Rate</span>
                    <span className="text-base font-bold text-[#f95721]">{formatPrice(viewingVehicle.dailyRate)}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2d2119]'}`}>
                    <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Security Deposit</span>
                    <span className="text-base font-bold">{formatPrice(viewingVehicle.depositAmount)}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2d2119]'}`}>
                    <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Transmission</span>
                    <span className="text-sm font-semibold">{viewingVehicle.transmission}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#2d2119]'}`}>
                    <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>Fuel Type</span>
                    <span className="text-sm font-semibold">{viewingVehicle.fuelType}</span>
                  </div>
                </div>

                {/* Extra internal details */}
                <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2c2019]'
                }`}>
                  <div className={`flex justify-between py-1 border-b ${isLight ? 'border-neutral-200' : 'border-[#291e17]'}`}>
                    <span className={isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}>Base Fleet Depot:</span>
                    <span className="font-semibold">{viewingVehicle.city}, Morocco</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isLight ? 'border-neutral-200' : 'border-[#291e17]'}`}>
                    <span className={isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}>Official License Plate:</span>
                    <span className="font-mono font-bold">{viewingVehicle.plate}</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isLight ? 'border-neutral-200' : 'border-[#291e17]'}`}>
                    <span className={isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}>B2B Inter-Agency Sharing:</span>
                    <span className={`font-bold ${viewingVehicle.isB2bEligible ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {viewingVehicle.isB2bEligible ? 'Enabled (Shared with partner network)' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className={isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}>Lifetime Trips Completed:</span>
                    <span className="font-semibold">{viewingVehicle.tripsCount || 12} rentals</span>
                  </div>
                </div>

                {/* Blackout summary */}
                {viewingVehicle.blackoutDates && viewingVehicle.blackoutDates.length > 0 && (
                  <div className="space-y-2">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}`}>
                      Scheduled Blackout Dates
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {viewingVehicle.blackoutDates.map((b) => (
                        <div key={b.id} className={`p-2.5 rounded-xl border flex justify-between ${
                          isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#241b15] border-[#34261e]'
                        }`}>
                          <span className="font-semibold">{b.start} → {b.end}</span>
                          <span className={isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}>{b.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className={`flex justify-end gap-3 pt-3 border-t ${
              isLight ? 'border-neutral-200' : 'border-[#261d16]'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setEditingVehicle({ ...viewingVehicle });
                  setViewingVehicle(null);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold border cursor-pointer flex items-center gap-1.5 transition-colors ${
                  isLight 
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200' 
                    : 'bg-[#241b15] hover:bg-[#30241d] text-[#f5efe8] border-[#382b21]'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Edit Vehicle</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingVehicle(null)}
                className="px-6 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white cursor-pointer shadow-sm"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT VEHICLE */}
      {/* ======================================================== */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a130f] rounded-3xl border border-[#2b2018] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#f5efe8] overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
              <div>
                <span className="text-[10px] text-[#f95721] font-bold uppercase tracking-wider block">
                  Modify Fleet Listing
                </span>
                <h3 className="font-serif-display text-xl font-bold text-[#f5efe8]">
                  Edit {editingVehicle.make} {editingVehicle.model}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="p-1.5 rounded-full bg-[#241b15] text-[#8d7e73] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.make}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.model}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Year</label>
                  <input
                    type="number"
                    value={editingVehicle.year}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Plate Number *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.plate}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, plate: e.target.value })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">City</label>
                  <select
                    value={editingVehicle.city}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, city: e.target.value })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="Agadir">Agadir</option>
                    <option value="Azrou">Azrou</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Rabat">Rabat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Daily Rate (MAD) *</label>
                  <input
                    type="number"
                    required
                    value={editingVehicle.dailyRate}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, dailyRate: Number(e.target.value) })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] font-bold focus:border-[#f95721] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Security Deposit (MAD) *</label>
                  <input
                    type="number"
                    required
                    value={editingVehicle.depositAmount}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, depositAmount: Number(e.target.value) })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Status</label>
                  <select
                    value={editingVehicle.status}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value as any })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="on_trip">On Trip</option>
                    <option value="blackout">Blackout</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Transmission</label>
                  <select
                    value={editingVehicle.transmission}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value as any })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8d7e73] mb-1">Fuel Type</label>
                  <select
                    value={editingVehicle.fuelType}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuelType: e.target.value as any })}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#8d7e73] mb-1">Vehicle Image URL</label>
                <input
                  type="url"
                  value={editingVehicle.image}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-[#8d7e73] hover:text-white bg-[#221914] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELETE VEHICLE CONFIRMATION */}
      {/* ======================================================== */}
      {deletingVehicle && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a130f] rounded-3xl border border-rose-900/40 max-w-md w-full p-6 shadow-2xl space-y-4 text-[#f5efe8]">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-[#f5efe8]">
                Delete {deletingVehicle.make} {deletingVehicle.model}?
              </h3>
              <p className="text-xs text-[#9c8e82] mt-1">
                Plate: <span className="font-mono text-[#f5efe8] font-bold">{deletingVehicle.plate}</span>. This will permanently remove this car from your agency fleet listing and cancel its B2B sharing availability.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingVehicle(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#8d7e73] hover:text-white bg-[#221914] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD NEW VEHICLE (WITH IMAGE UPLOAD & BATCH 3-5 CARS) */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`rounded-3xl border max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto transition-colors ${
            isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#1a130f] border-[#2b2018] text-[#f5efe8]'
          }`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-neutral-200' : 'border-[#261d16]'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#f95721] font-bold uppercase tracking-wider block">
                    Fleet Inventory Expansion
                  </span>
                  {batchQuantity > 1 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      Batch Mode: {batchQuantity} Cars
                    </span>
                  )}
                </div>
                <h3 className={`font-serif-display text-xl sm:text-2xl font-bold ${
                  isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
                }`}>
                  Add Vehicle to Fleet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={`p-2 rounded-full cursor-pointer transition-colors ${
                  isLight ? 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200' : 'bg-[#241b15] text-[#8d7e73] hover:text-white hover:bg-[#2e231b]'
                }`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-5 text-xs">
              
              {/* ============================================================ */}
              {/* SECTION 1: ADDITION MODE (SINGLE CAR VS 3-5 CARS BATCH)     */}
              {/* ============================================================ */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-orange-50/50 border-orange-200/70' : 'bg-[#221813] border-[#342419]'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#f95721]" />
                    <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                      Fleet Addition Mode & Quantity
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                    {batchQuantity === 1 ? '1 single vehicle' : `${batchQuantity} identical vehicles`}
                  </span>
                </div>

                {/* Preset Chips: 1 Car, 3 Cars, 4 Cars, 5 Cars */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectBatchCount(1)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 ${
                      batchQuantity === 1
                        ? 'bg-[#f95721] text-white border-[#f95721] shadow-sm'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-700 hover:border-[#f95721]/50'
                        : 'bg-[#1b1410] border-[#382b21] text-[#b8a99d] hover:border-[#f95721]/50'
                    }`}
                  >
                    <span className="font-bold">1 Car</span>
                    <span className="text-[10px] opacity-80">Single Unit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectBatchCount(3)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                      batchQuantity === 3
                        ? 'bg-[#f95721] text-white border-[#f95721] shadow-sm'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-700 hover:border-[#f95721]/50'
                        : 'bg-[#1b1410] border-[#382b21] text-[#b8a99d] hover:border-[#f95721]/50'
                    }`}
                  >
                    <span className="font-bold">3 Cars</span>
                    <span className="text-[10px] opacity-80">Batch Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectBatchCount(4)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 ${
                      batchQuantity === 4
                        ? 'bg-[#f95721] text-white border-[#f95721] shadow-sm'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-700 hover:border-[#f95721]/50'
                        : 'bg-[#1b1410] border-[#382b21] text-[#b8a99d] hover:border-[#f95721]/50'
                    }`}
                  >
                    <span className="font-bold">4 Cars</span>
                    <span className="text-[10px] opacity-80">Batch Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectBatchCount(5)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 ${
                      batchQuantity === 5
                        ? 'bg-[#f95721] text-white border-[#f95721] shadow-sm'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-700 hover:border-[#f95721]/50'
                        : 'bg-[#1b1410] border-[#382b21] text-[#b8a99d] hover:border-[#f95721]/50'
                    }`}
                  >
                    <span className="font-bold">5 Cars</span>
                    <span className="text-[10px] opacity-80">Batch Mode</span>
                  </button>

                  {/* Stepper for custom */}
                  <div className={`py-1 px-2 rounded-xl border flex items-center justify-between gap-1 col-span-2 sm:col-span-1 ${
                    batchQuantity > 5 || (batchQuantity > 1 && batchQuantity !== 3 && batchQuantity !== 4 && batchQuantity !== 5)
                      ? 'border-[#f95721] bg-[#f95721]/10'
                      : isLight
                      ? 'bg-white border-neutral-300'
                      : 'bg-[#1b1410] border-[#382b21]'
                  }`}>
                    <button
                      type="button"
                      onClick={() => handleSelectBatchCount(Math.max(1, batchQuantity - 1))}
                      className="w-6 h-6 rounded-lg bg-neutral-500/20 hover:bg-neutral-500/30 flex items-center justify-center text-xs font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <div className="text-center">
                      <span className="font-bold block text-xs">{batchQuantity}</span>
                      <span className="text-[9px] text-[#8d7e73] block leading-tight">Count</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectBatchCount(Math.min(10, batchQuantity + 1))}
                      className="w-6 h-6 rounded-lg bg-neutral-500/20 hover:bg-neutral-500/30 flex items-center justify-center text-xs font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Batch Mode Explanatory Notice */}
                {batchQuantity > 1 && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                    isLight 
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
                      : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                  }`}>
                    <Sparkles className="w-4 h-4 text-[#f95721] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Batch Fleet Mode ({batchQuantity} Identical Vehicles):</span>
                      <p className="mt-0.5 text-[11px] opacity-90">
                        Saves time when adding multi-car acquisitions (e.g. 3–5 Dacia Logan, Renault Clio, or Golf). All {batchQuantity} vehicles will share the exact same model, year, photos, daily rate ({formatPrice(addDailyRate)}/day), city, and insurance policies. You only need to specify each car&apos;s license plate below.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* SECTION 2: IMAGES UPLOADING (DRAG & DROP + BROWSE + PRESETS) */}
              {/* ============================================================ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`block font-bold text-xs flex items-center gap-1.5 ${
                    isLight ? 'text-neutral-800' : 'text-[#f5efe8]'
                  }`}>
                    <ImageIcon className="w-4 h-4 text-[#f95721]" />
                    <span>Vehicle Photos & Gallery</span>
                    <span className="text-[#f95721]">*</span>
                  </label>
                  <span className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                    {uploadedImages.length} photo{uploadedImages.length !== 1 ? 's' : ''} uploaded
                  </span>
                </div>

                {/* Interactive Drag & Drop Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFilesSelected(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all relative ${
                    isDraggingFile
                      ? 'border-[#f95721] bg-[#f95721]/15 scale-[1.01]'
                      : isLight
                      ? 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-[#f95721]'
                      : 'border-[#3a2c22] bg-[#1d1612] hover:bg-[#231a15] hover:border-[#f95721]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesSelected(e.target.files);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-[#f95721]/15 text-[#f95721]">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className={`font-bold text-xs ${isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}`}>
                    Drag & drop vehicle photos here, or <span className="text-[#f95721] underline">browse files</span>
                  </p>
                  <p className={`text-[10px] mt-1 ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                    Upload high-resolution vehicle photos (PNG, JPG, WEBP) • Select multiple files for front, side, and interior views
                  </p>
                </div>

                {/* Gallery of Uploaded Photos */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
                        Uploaded Gallery ({uploadedImages.length}) — Click any thumbnail to set as primary cover:
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#f95721] hover:underline font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Add More Photos
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {uploadedImages.map((imgUrl, idx) => {
                        const isCover = addImage === imgUrl;
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSetCoverImage(imgUrl)}
                            className={`h-16 rounded-xl overflow-hidden border-2 relative group cursor-pointer transition-all ${
                              isCover
                                ? 'border-[#f95721] ring-2 ring-[#f95721]/30 shadow-md'
                                : 'border-transparent opacity-75 hover:opacity-100 hover:border-neutral-400'
                            }`}
                          >
                            <img src={imgUrl} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                            {isCover && (
                              <span className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold bg-[#f95721] text-white text-center leading-none">
                                Cover
                              </span>
                            )}
                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Preset Photo Quick Picker */}
                <div className={`p-3 rounded-2xl border ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1b1410] border-[#2c2019]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-semibold ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
                      Or choose from popular fleet catalog photos:
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                    {PRESET_CAR_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAddImage(preset.url);
                          setUploadedImages(prev => prev.includes(preset.url) ? prev : [preset.url, ...prev]);
                        }}
                        className={`h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                          addImage === preset.url ? 'border-[#f95721] scale-95 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Direct Image URL input */}
                  <input
                    type="url"
                    placeholder="Or enter direct image URL (https://...)..."
                    value={addImage}
                    onChange={(e) => {
                      setAddImage(e.target.value);
                      if (e.target.value && !uploadedImages.includes(e.target.value)) {
                        setUploadedImages(prev => [e.target.value, ...prev]);
                      }
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#f95721]' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION 3: VEHICLE MAKE, MODEL, YEAR, CITY                  */}
              {/* ============================================================ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volkswagen"
                    value={addMake}
                    onChange={(e) => setAddMake(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Golf 8"
                    value={addModel}
                    onChange={(e) => setAddModel(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Year
                  </label>
                  <input
                    type="number"
                    min={2015}
                    max={2027}
                    value={addYear}
                    onChange={(e) => setAddYear(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION 4: LICENSE PLATES (SINGLE VS BATCH 3-5 CARS)         */}
              {/* ============================================================ */}
              {batchQuantity === 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                      Moroccan Plate Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 6512-B-6"
                      value={addPlate}
                      onChange={(e) => handleBasePlateChange(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono font-bold focus:outline-none transition-colors ${
                        isLight 
                          ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                          : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                      }`}
                    />
                    <span className="text-[10px] text-[#8d7e73] mt-0.5 block">Format: Number-Letter-Region (e.g. 5421-A-6)</span>
                  </div>
                  <div>
                    <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                      Base City
                    </label>
                    <select
                      value={addCity}
                      onChange={(e) => setAddCity(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                        isLight 
                          ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                          : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                      }`}
                    >
                      <option value="Agadir">Agadir</option>
                      <option value="Azrou">Azrou</option>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Tangier">Tangier</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Fes">Fes</option>
                      <option value="Ouarzazate">Ouarzazate</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e2119]'
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className={`font-bold text-xs flex items-center gap-1.5 ${
                        isLight ? 'text-neutral-800' : 'text-[#f5efe8]'
                      }`}>
                        <Hash className="w-3.5 h-3.5 text-[#f95721]" />
                        <span>License Plates for {batchQuantity} Identical Vehicles</span>
                      </h4>
                      <p className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        Each vehicle receives its own unique plate number for rental contracts & telemetry
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoSequencePlates}
                      className="px-3 py-1 rounded-xl text-[11px] font-bold bg-[#f95721]/15 hover:bg-[#f95721]/25 text-[#f95721] border border-[#f95721]/30 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Automatically sequence plates based on Car #1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Auto-Sequence Plates
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {Array.from({ length: Math.max(1, Math.min(10, Math.floor(Number(batchQuantity) || 1))) }).map((_, idx) => (
                      <div key={idx} className="space-y-1">
                        <label className={`block font-semibold text-[11px] flex items-center justify-between ${
                          isLight ? 'text-neutral-600' : 'text-[#8d7e73]'
                        }`}>
                          <span>Car #{idx + 1} {idx === 0 ? '(Lead)' : ''}</span>
                          <span className="text-[10px] font-mono px-1 rounded bg-[#f95721]/10 text-[#f95721]">Unit {idx + 1}</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`e.g. ${6512 + idx}-B-6`}
                          value={batchPlates[idx] || ''}
                          onChange={(e) => handleBatchPlateItemChange(idx, e.target.value)}
                          className={`w-full rounded-xl px-3 py-2 font-mono font-bold text-xs focus:outline-none transition-colors ${
                            isLight 
                              ? 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#f95721]' 
                              : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                      Shared Base City
                    </label>
                    <select
                      value={addCity}
                      onChange={(e) => setAddCity(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                        isLight 
                          ? 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#f95721]' 
                          : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                      }`}
                    >
                      <option value="Agadir">Agadir</option>
                      <option value="Azrou">Azrou</option>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Tangier">Tangier</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Fes">Fes</option>
                      <option value="Ouarzazate">Ouarzazate</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SECTION 5: PRICING & DEPOSIT                                */}
              {/* ============================================================ */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Daily Rental Rate (MAD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={addDailyRate}
                    onChange={(e) => setAddDailyRate(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 font-bold focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  />
                  {batchQuantity > 1 && (
                    <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 block">
                      Total daily yield: {formatPrice(addDailyRate * batchQuantity)}/day ({batchQuantity} units)
                    </span>
                  )}
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Security Deposit (MAD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={addDeposit}
                    onChange={(e) => setAddDeposit(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721] focus:bg-white' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION 6: TRANSMISSION, FUEL, SEATS                         */}
              {/* ============================================================ */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Transmission
                  </label>
                  <select
                    value={addTransmission}
                    onChange={(e) => setAddTransmission(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721]' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Fuel Type
                  </label>
                  <select
                    value={addFuelType}
                    onChange={(e) => setAddFuelType(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721]' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isLight ? 'text-neutral-700' : 'text-[#8d7e73]'}`}>
                    Seats
                  </label>
                  <select
                    value={addSeats}
                    onChange={(e) => setAddSeats(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#f95721]' 
                        : 'bg-[#241b15] border border-[#382b21] text-[#f5efe8] focus:border-[#f95721]'
                    }`}
                  >
                    <option value={2}>2 Seats</option>
                    <option value={4}>4 Seats</option>
                    <option value={5}>5 Seats</option>
                    <option value={7}>7 Seats</option>
                    <option value={9}>9 Seats (Van)</option>
                  </select>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION 7: B2B INTER-AGENCY SHARING                         */}
              {/* ============================================================ */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2c2019]'
              }`}>
                <div>
                  <span className={`font-semibold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                    Enable B2B Inter-Agency Sharing
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                    Make {batchQuantity > 1 ? `all ${batchQuantity} vehicles` : 'vehicle'} discoverable for sub-leases to vetted agencies
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAddIsB2b(!addIsB2b)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    addIsB2b ? 'bg-[#f95721]' : 'bg-[#33261e]'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      addIsB2b ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* ============================================================ */}
              {/* MODAL ACTIONS                                               */}
              {/* ============================================================ */}
              <div className={`flex items-center justify-between pt-4 border-t ${
                isLight ? 'border-neutral-200' : 'border-[#261d16]'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    isLight 
                      ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200' 
                      : 'text-[#8d7e73] hover:text-white bg-[#221914] hover:bg-[#2c2019]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-lg cursor-pointer flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {batchQuantity > 1
                      ? `Add ${batchQuantity} Vehicles to Fleet`
                      : 'Add Vehicle to Fleet'}
                  </span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: BLACKOUT DATES MODAL */}
      {/* ======================================================== */}
      {blackoutTargetVehicle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a130f] rounded-3xl border border-[#2b2018] p-6 max-w-md w-full shadow-xl space-y-4 text-[#f5efe8]">
            <h3 className="font-serif-display text-lg font-bold text-[#f5efe8]">
              Manage Blackout Dates for {blackoutTargetVehicle.make} {blackoutTargetVehicle.model}
            </h3>
            <p className="text-xs text-[#8d7e73]">
              Blocks booking on Airbcar client portal during maintenance or private bookings.
            </p>

            <form onSubmit={handleSaveBlackout} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={blackoutStart}
                  onChange={(e) => setBlackoutStart(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={blackoutEnd}
                  onChange={(e) => setBlackoutEnd(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Reason</label>
                <input
                  type="text"
                  value={blackoutReason}
                  onChange={(e) => setBlackoutReason(e.target.value)}
                  placeholder="e.g. Scheduled oil service, inspection"
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setBlackoutTargetVehicle(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#8d7e73] hover:text-white bg-[#221914] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs cursor-pointer"
                >
                  Save Blackout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
