import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Camera, Upload, CheckCircle2, Eye, Trash2, 
  ShieldCheck, RefreshCw, X, ZoomIn, ZoomOut, RotateCw, 
  AlertCircle, Check, AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';

interface DriverLicenseSectionProps {
  userProfile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onNavigateTab?: (tab: any) => void;
}

interface LicenseSideState {
  file: File | null;
  fileName: string | null;
  fileSize: string | null;
  previewUrl: string | null;
  uploadedAt: string | null;
  rotation: number;
}

export const DriverLicenseSection: React.FC<DriverLicenseSectionProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateTab,
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const initialHasLicense = userProfile?.hasLicenseUploaded !== false;

  // State for front & back licenses
  const [frontLicense, setFrontLicense] = useState<LicenseSideState>({
    file: null,
    fileName: initialHasLicense ? 'permis_conduire_maroc_recto_84291.jpg' : null,
    fileSize: initialHasLicense ? '1.6 MB' : null,
    previewUrl: initialHasLicense 
      ? (userProfile?.licenseFrontUrl || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1000&q=85')
      : null,
    uploadedAt: initialHasLicense ? '14 Sep 2026' : null,
    rotation: 0,
  });

  const [backLicense, setBackLicense] = useState<LicenseSideState>({
    file: null,
    fileName: initialHasLicense ? 'permis_conduire_maroc_verso_84291.jpg' : null,
    fileSize: initialHasLicense ? '1.4 MB' : null,
    previewUrl: initialHasLicense 
      ? (userProfile?.licenseBackUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1000&q=85')
      : null,
    uploadedAt: initialHasLicense ? '14 Sep 2026' : null,
    rotation: 0,
  });

  // Keep synced if userProfile changes externally
  useEffect(() => {
    if (userProfile && userProfile.hasLicenseUploaded === false) {
      setFrontLicense(prev => ({
        ...prev,
        fileName: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
      }));
      setBackLicense(prev => ({
        ...prev,
        fileName: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
      }));
    }
  }, [userProfile?.hasLicenseUploaded]);

  const [isDraggingFront, setIsDraggingFront] = useState(false);
  const [isDraggingBack, setIsDraggingBack] = useState(false);

  // Lightbox Modal state
  const [zoomModal, setZoomModal] = useState<{
    url: string;
    title: string;
    side: 'front' | 'back';
    zoom: number;
    rotation: number;
  } | null>(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const processFile = (file: File, side: 'front' | 'back') => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      showNotification('Please upload an image (JPG, PNG, WebP) or PDF.', 'info');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    if (side === 'front') {
      setFrontLicense({
        file,
        fileName: file.name,
        fileSize: sizeInMb,
        previewUrl,
        uploadedAt: 'Just now',
        rotation: 0,
      });
      showNotification("Front side of driver's license uploaded successfully!");
      if (backLicense.previewUrl) {
        onUpdateProfile?.({
          ...(userProfile || {
            fullName: 'Camille Dubois',
            email: 'camille.d@mail.com',
            phone: '+212 6 12 34 56 78',
            licenceExpiry: '11 Nov 2026',
            daysLeft: 76,
            isVerified: true,
            hasSecondDriver: false,
          }),
          hasLicenseUploaded: true,
          licenseStatus: 'verified',
          isVerified: true,
          drivingLicenceNumber: 'FR-9204812',
          licenseFrontUrl: previewUrl,
        });
      }
    } else {
      setBackLicense({
        file,
        fileName: file.name,
        fileSize: sizeInMb,
        previewUrl,
        uploadedAt: 'Just now',
        rotation: 0,
      });
      showNotification("Back side of driver's license uploaded successfully!");
      if (frontLicense.previewUrl) {
        onUpdateProfile?.({
          ...(userProfile || {
            fullName: 'Camille Dubois',
            email: 'camille.d@mail.com',
            phone: '+212 6 12 34 56 78',
            licenceExpiry: '11 Nov 2026',
            daysLeft: 76,
            isVerified: true,
            hasSecondDriver: false,
          }),
          hasLicenseUploaded: true,
          licenseStatus: 'verified',
          isVerified: true,
          drivingLicenceNumber: 'FR-9204812',
          licenseBackUrl: previewUrl,
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0], side);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    if (side === 'front') setIsDraggingFront(true);
    else setIsDraggingBack(true);
  };

  const handleDragLeave = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    if (side === 'front') setIsDraggingFront(false);
    else setIsDraggingBack(false);
  };

  const handleDrop = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    if (side === 'front') setIsDraggingFront(false);
    else setIsDraggingBack(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0], side);
    }
  };

  const removeLicense = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontLicense({
        file: null,
        fileName: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
        rotation: 0,
      });
      if (frontInputRef.current) frontInputRef.current.value = '';
      showNotification('Front license removed.', 'info');
      onUpdateProfile?.({
        ...(userProfile || {
          fullName: 'Camille Dubois',
          email: 'camille.d@mail.com',
          phone: '+212 6 12 34 56 78',
          licenceExpiry: '',
          daysLeft: 0,
          isVerified: false,
          hasSecondDriver: false,
        }),
        hasLicenseUploaded: false,
        licenseStatus: 'missing',
        isVerified: false,
        licenseFrontUrl: null,
      });
    } else {
      setBackLicense({
        file: null,
        fileName: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
        rotation: 0,
      });
      if (backInputRef.current) backInputRef.current.value = '';
      showNotification('Back license removed.', 'info');
      onUpdateProfile?.({
        ...(userProfile || {
          fullName: 'Camille Dubois',
          email: 'camille.d@mail.com',
          phone: '+212 6 12 34 56 78',
          licenceExpiry: '',
          daysLeft: 0,
          isVerified: false,
          hasSecondDriver: false,
        }),
        hasLicenseUploaded: false,
        licenseStatus: 'missing',
        isVerified: false,
        licenseBackUrl: null,
      });
    }
    if (zoomModal?.side === side) {
      setZoomModal(null);
    }
  };

  const rotateLicense = (side: 'front' | 'back', e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (side === 'front') {
      setFrontLicense(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
    } else {
      setBackLicense(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
    }
  };

  // Helper to load high quality sample verified documents
  const handleLoadSampleDocuments = () => {
    const sampleFront = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1000&q=85';
    const sampleBack = 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1000&q=85';
    setFrontLicense({
      file: null,
      fileName: 'permis_conduire_maroc_recto_84291.jpg',
      fileSize: '1.6 MB',
      previewUrl: sampleFront,
      uploadedAt: '14 Sep 2026',
      rotation: 0,
    });
    setBackLicense({
      file: null,
      fileName: 'permis_conduire_maroc_verso_84291.jpg',
      fileSize: '1.4 MB',
      previewUrl: sampleBack,
      uploadedAt: '14 Sep 2026',
      rotation: 0,
    });
    onUpdateProfile?.({
      ...(userProfile || {
        fullName: 'Camille Dubois',
        email: 'camille.d@mail.com',
        phone: '+212 6 12 34 56 78',
        licenceExpiry: '11 Nov 2026',
        daysLeft: 76,
        isVerified: true,
        hasSecondDriver: false,
      }),
      hasLicenseUploaded: true,
      licenseStatus: 'verified',
      isVerified: true,
      drivingLicenceNumber: 'FR-9204812',
      licenseFrontUrl: sampleFront,
      licenseBackUrl: sampleBack,
    });
    showNotification('Sample front and back driving licence loaded successfully.');
  };

  const handleClearLicense = () => {
    setFrontLicense({
      file: null,
      fileName: null,
      fileSize: null,
      previewUrl: null,
      uploadedAt: null,
      rotation: 0,
    });
    setBackLicense({
      file: null,
      fileName: null,
      fileSize: null,
      previewUrl: null,
      uploadedAt: null,
      rotation: 0,
    });
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (backInputRef.current) backInputRef.current.value = '';
    onUpdateProfile?.({
      ...(userProfile || {
        fullName: 'Camille Dubois',
        email: 'camille.d@mail.com',
        phone: '+212 6 12 34 56 78',
        licenceExpiry: '',
        daysLeft: 0,
        isVerified: false,
        hasSecondDriver: false,
      }),
      hasLicenseUploaded: false,
      licenseStatus: 'missing',
      isVerified: false,
      drivingLicenceNumber: '',
      licenseFrontUrl: null,
      licenseBackUrl: null,
    });
    showNotification('Driver license cleared. Testing unuploaded renter state.', 'info');
  };

  const isComplete = Boolean(frontLicense.previewUrl && backLicense.previewUrl);
  const isPartial = Boolean(frontLicense.previewUrl || backLicense.previewUrl) && !isComplete;

  return (
    <div className="w-full bg-[#1a130f] text-[#f5efe8] rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-9 border border-[#2b2018] shadow-xl relative overflow-hidden">
      
      {/* Airbcar subtle ambient warm glow in the top right */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#f95721]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header matching authentic Airbcar design system */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-7 border-b border-[#261d16] relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721] shrink-0 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#f5efe8] tracking-tight">
                Driver's License Documents
              </h3>
              {isComplete && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full shadow-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Complete & Verified
                </span>
              )}
              {isPartial && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full shadow-xs">
                  <AlertCircle className="w-3.5 h-3.5" /> 1 of 2 Uploaded
                </span>
              )}
              {!isComplete && !isPartial && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Not Uploaded (Action Required)
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#9c8e82] mt-1 max-w-2xl leading-relaxed">
              Upload both sides of your driver's license for verification purposes. These documents are recognized by all Moroccan agencies and unlock seamless car pick-up.
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={handleClearLicense}
            className="text-xs font-semibold text-[#a89b90] hover:text-white bg-[#241b15] hover:bg-[#30241d] border border-[#382b21] px-3.5 py-2.5 rounded-full transition-all duration-150 flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Clear license to test the unuploaded renter profile state"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset / Test No License</span>
          </button>
          <button
            type="button"
            onClick={handleLoadSampleDocuments}
            className="text-xs font-semibold text-[#f5efe8] hover:text-white bg-[#241b15] hover:bg-[#30241d] border border-[#382b21] px-4 py-2.5 rounded-full transition-all duration-150 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#f95721]" />
            <span>Load Sample Licences</span>
          </button>
        </div>
      </div>

      {/* Warning banner if renter hasn't uploaded a license */}
      {!isComplete && (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="text-white font-semibold block sm:inline">
                Driver's License Required by Moroccan Transport Law:
              </strong>{' '}
              <span>
                {isPartial
                  ? 'Please upload the second side of your license to unlock rental pick-up and instant bookings.'
                  : 'You cannot sign rental contracts or collect vehicles without uploading both front and back sides.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadSampleDocuments}
            className="text-[11px] font-semibold text-white bg-[#f95721] hover:bg-[#e04816] px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Auto-fill Sample License
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="mt-5 bg-[#201813] border border-[#f95721]/50 text-[#f5efe8] text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-[#f95721] shrink-0" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Two side-by-side cards: License Front & License Back in Airbcar warm charcoal theme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-7 relative z-10">
        
        {/* CARD 1: License Front */}
        <div className="bg-[#201813] rounded-3xl p-6 sm:p-7 border border-[#2c2019] shadow-xs flex flex-col justify-between hover:border-[#3d2e23] transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base sm:text-lg font-bold text-[#f5efe8] tracking-tight">
                License Front
              </h4>
              <span className="text-[11px] font-semibold text-[#a89b90] bg-[#291f18] px-3 py-1 rounded-full border border-[#382a20] shadow-xs">
                Recto / Front Side
              </span>
            </div>

            {/* Choose File Button & Filename Row */}
            <div className="flex items-center gap-3.5 mb-4">
              <input
                ref={frontInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                id="front-licence-input"
                onChange={(e) => handleFileChange(e, 'front')}
              />
              <button
                type="button"
                onClick={() => frontInputRef.current?.click()}
                className="bg-[#f95721] hover:bg-[#e04a17] text-white font-semibold text-xs px-5 py-2 rounded-full shadow-xs transition-all duration-150 cursor-pointer shrink-0"
              >
                Choose File
              </button>
              <span className="text-xs text-[#8d7e73] truncate max-w-[200px] sm:max-w-[260px] font-mono" title={frontLicense.fileName || 'No file chosen'}>
                {frontLicense.fileName || 'No file chosen'}
              </span>
            </div>

            {/* Dashed Box Dropzone */}
            <div 
              onDragOver={(e) => handleDragOver(e, 'front')}
              onDragLeave={(e) => handleDragLeave(e, 'front')}
              onDrop={(e) => handleDrop(e, 'front')}
              className={`w-full h-64 sm:h-72 rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all duration-200 p-4 flex flex-col items-center justify-center relative overflow-hidden group ${
                isDraggingFront 
                  ? 'border-[#f95721] bg-[#f95721]/10 scale-[1.01] shadow-lg' 
                  : frontLicense.previewUrl
                  ? 'border-[#382b21] bg-[#16100c]'
                  : 'border-[#382b21] bg-[#1a130f] hover:border-[#f95721] hover:bg-[#241b15]'
              }`}
            >
              {frontLicense.previewUrl ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black/40">
                  <img
                    src={frontLicense.previewUrl}
                    alt="Driver License Front Preview"
                    style={{ transform: `rotate(${frontLicense.rotation}deg)` }}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300"
                  />

                  {/* Corner Authentic Licence Watermark */}
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-[10px] text-white font-medium px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Kingdom of Morocco • Permis B</span>
                  </div>

                  {/* Hover Overlay with Action Toolbar */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setZoomModal({
                        url: frontLicense.previewUrl!,
                        title: 'Driver License - Front View (Recto)',
                        side: 'front',
                        zoom: 1,
                        rotation: frontLicense.rotation,
                      })}
                      className="p-2.5 rounded-full bg-[#241b15] text-[#f5efe8] hover:bg-[#34271e] hover:text-white border border-[#3d2e23] shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Inspect Full Screen"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => rotateLicense('front', e)}
                      className="p-2.5 rounded-full bg-[#241b15] text-[#f5efe8] hover:bg-[#34271e] hover:text-white border border-[#3d2e23] shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => frontInputRef.current?.click()}
                      className="p-2.5 rounded-full bg-[#241b15] text-[#f5efe8] hover:bg-[#34271e] hover:text-white border border-[#3d2e23] shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Replace File"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLicense('front')}
                      className="p-2.5 rounded-full bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800 shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom bar inside preview */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md text-white text-[11px] px-3.5 py-2 rounded-xl flex items-center justify-between border border-white/15">
                    <span className="truncate max-w-[200px] font-mono text-[#d5c7bc]">{frontLicense.fileName}</span>
                    <span className="shrink-0 text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                      <Check className="w-3.5 h-3.5" /> Ready for verification
                    </span>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => frontInputRef.current?.click()}
                  className="flex flex-col items-center justify-center cursor-pointer text-center p-4 select-none group-hover:scale-102 transition-transform duration-200"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#281e18] border border-[#3a2c22] flex items-center justify-center shadow-xs mb-3 text-[#f95721] group-hover:shadow-sm group-hover:scale-105 transition-all">
                    <Camera className="w-6 h-6 text-[#f95721]" />
                  </div>
                  <span className="text-sm font-bold text-[#f5efe8] group-hover:text-[#f95721] transition-colors">
                    No document uploaded
                  </span>
                  <span className="text-xs text-[#8d7e73] mt-1 font-normal">
                    Click to browse or drop front photo
                  </span>
                  <span className="mt-3 text-[10px] font-semibold text-[#8d7e73] bg-[#241b15] px-3 py-1 rounded-full border border-[#382b21] uppercase tracking-wider">
                    Drag & Drop File
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#2c2019] flex items-center justify-between text-[11px] text-[#8d7e73]">
            <span>Accepted formats: JPG, PNG, PDF</span>
            <span className="font-semibold text-[#c9b8ab]">Max 10 MB</span>
          </div>
        </div>

        {/* CARD 2: License Back */}
        <div className="bg-[#201813] rounded-3xl p-6 sm:p-7 border border-[#2c2019] shadow-xs flex flex-col justify-between hover:border-[#3d2e23] transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base sm:text-lg font-bold text-[#f5efe8] tracking-tight">
                License Back
              </h4>
              <span className="text-[11px] font-semibold text-[#a89b90] bg-[#291f18] px-3 py-1 rounded-full border border-[#382a20] shadow-xs">
                Verso / Back Side
              </span>
            </div>

            {/* Choose File Button & Filename Row */}
            <div className="flex items-center gap-3.5 mb-4">
              <input
                ref={backInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                id="back-licence-input"
                onChange={(e) => handleFileChange(e, 'back')}
              />
              <button
                type="button"
                onClick={() => backInputRef.current?.click()}
                className="bg-[#f95721] hover:bg-[#e04a17] text-white font-semibold text-xs px-5 py-2 rounded-full shadow-xs transition-all duration-150 cursor-pointer shrink-0"
              >
                Choose File
              </button>
              <span className="text-xs text-[#8d7e73] truncate max-w-[200px] sm:max-w-[260px] font-mono" title={backLicense.fileName || 'No file chosen'}>
                {backLicense.fileName || 'No file chosen'}
              </span>
            </div>

            {/* Dashed Box Dropzone */}
            <div 
              onDragOver={(e) => handleDragOver(e, 'back')}
              onDragLeave={(e) => handleDragLeave(e, 'back')}
              onDrop={(e) => handleDrop(e, 'back')}
              className={`w-full h-64 sm:h-72 rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all duration-200 p-4 flex flex-col items-center justify-center relative overflow-hidden group ${
                isDraggingBack 
                  ? 'border-[#f95721] bg-[#f95721]/10 scale-[1.01] shadow-lg' 
                  : backLicense.previewUrl
                  ? 'border-[#382b21] bg-[#16100c]'
                  : 'border-[#382b21] bg-[#1a130f] hover:border-[#f95721] hover:bg-[#241b15]'
              }`}
            >
              {backLicense.previewUrl ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black/40">
                  <img
                    src={backLicense.previewUrl}
                    alt="Driver License Back Preview"
                    style={{ transform: `rotate(${backLicense.rotation}deg)` }}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300"
                  />

                  {/* Corner Category B Endorsement Watermark */}
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-[10px] text-white font-medium px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Catégories A / B • Date d'expiration</span>
                  </div>

                  {/* Hover Overlay with Action Toolbar */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setZoomModal({
                        url: backLicense.previewUrl!,
                        title: 'Driver License - Back View (Verso)',
                        side: 'back',
                        zoom: 1,
                        rotation: backLicense.rotation,
                      })}
                      className="p-2.5 rounded-full bg-[#241b15] text-[#f5efe8] hover:bg-[#34271e] hover:text-white border border-[#3d2e23] shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Inspect Full Screen"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => rotateLicense('back', e)}
                      className="p-2.5 rounded-full bg-[#241b15] text-[#f5efe8] hover:bg-[#34271e] hover:text-white border border-[#3d2e23] shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => backInputRef.current?.click()}
                      className="p-2.5 rounded-full bg-[#241b15] text-[#f5efe8] hover:bg-[#34271e] hover:text-white border border-[#3d2e23] shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Replace File"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLicense('back')}
                      className="p-2.5 rounded-full bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800 shadow-md transition-all hover:scale-110 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom bar inside preview */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md text-white text-[11px] px-3.5 py-2 rounded-xl flex items-center justify-between border border-white/15">
                    <span className="truncate max-w-[200px] font-mono text-[#d5c7bc]">{backLicense.fileName}</span>
                    <span className="shrink-0 text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                      <Check className="w-3.5 h-3.5" /> Ready for verification
                    </span>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => backInputRef.current?.click()}
                  className="flex flex-col items-center justify-center cursor-pointer text-center p-4 select-none group-hover:scale-102 transition-transform duration-200"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#281e18] border border-[#3a2c22] flex items-center justify-center shadow-xs mb-3 text-[#f95721] group-hover:shadow-sm group-hover:scale-105 transition-all">
                    <Camera className="w-6 h-6 text-[#f95721]" />
                  </div>
                  <span className="text-sm font-bold text-[#f5efe8] group-hover:text-[#f95721] transition-colors">
                    No document uploaded
                  </span>
                  <span className="text-xs text-[#8d7e73] mt-1 font-normal">
                    Click to browse or drop reverse photo
                  </span>
                  <span className="mt-3 text-[10px] font-semibold text-[#8d7e73] bg-[#241b15] px-3 py-1 rounded-full border border-[#382b21] uppercase tracking-wider">
                    Drag & Drop File
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#2c2019] flex items-center justify-between text-[11px] text-[#8d7e73]">
            <span>Ensure categories B & dates are clearly legible</span>
            <span className="font-semibold text-[#c9b8ab]">High Resolution</span>
          </div>
        </div>

      </div>

      {/* Verification footer notice */}
      <div className="mt-8 pt-6 border-t border-[#261d16] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8d7e73] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#f95721]/15 flex items-center justify-center text-[#f95721] shrink-0 border border-[#f95721]/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span>Compliant with Moroccan Ministry of Transport & CNDP data privacy guidelines. 256-bit encrypted storage.</span>
        </div>
        
        <div className="text-xs flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <span className="text-[#8d7e73] font-medium">Status:</span>
          {isComplete ? (
            <span className="text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ready for agency check
            </span>
          ) : isPartial ? (
            <span className="text-[#f95721] font-bold bg-[#f95721]/15 border border-[#f95721]/30 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" /> 1 of 2 sides uploaded
            </span>
          ) : (
            <span className="text-[#8d7e73] font-medium bg-[#241b15] px-3.5 py-1.5 rounded-full">
              Pending upload
            </span>
          )}
        </div>
      </div>

      {/* Lightbox / Zoom Inspection Modal in Airbcar dark style */}
      {zoomModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-[#1a130f] border border-[#2b2018] rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] text-[#f5efe8]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#261d16] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721]">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-serif-display text-lg font-bold text-[#f5efe8] tracking-tight">
                  {zoomModal.title}
                </h4>
              </div>

              {/* Zoom & Rotation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomModal(prev => prev ? ({ ...prev, zoom: Math.max(0.7, prev.zoom - 0.2) }) : null)}
                  className="p-2 text-[#8d7e73] hover:text-white hover:bg-[#241b15] rounded-xl transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-[#a89b90] font-mono w-12 text-center font-semibold">
                  {Math.round(zoomModal.zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomModal(prev => prev ? ({ ...prev, zoom: Math.min(2.5, prev.zoom + 0.2) }) : null)}
                  className="p-2 text-[#8d7e73] hover:text-white hover:bg-[#241b15] rounded-xl transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomModal(prev => prev ? ({ ...prev, rotation: (prev.rotation + 90) % 360 }) : null)}
                  className="p-2 text-[#8d7e73] hover:text-white hover:bg-[#241b15] rounded-xl transition-colors cursor-pointer"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-[#2b2018] mx-1" />
                <button
                  type="button"
                  onClick={() => setZoomModal(null)}
                  className="p-2 text-[#8d7e73] hover:text-white hover:bg-[#241b15] rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Body with Zoom & Rotation */}
            <div className="mt-4 rounded-2xl overflow-auto flex-1 flex items-center justify-center bg-black/60 p-4 border border-[#2b2018] min-h-[350px]">
              <img
                src={zoomModal.url}
                alt="Enlarged Document"
                style={{
                  transform: `scale(${zoomModal.zoom}) rotate(${zoomModal.rotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-h-[60vh] w-auto object-contain rounded-lg shadow-2xl origin-center"
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-[#261d16] flex items-center justify-between text-xs text-[#8d7e73] shrink-0">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legible 300 DPI Document</span>
              </span>
              <button
                type="button"
                onClick={() => setZoomModal(null)}
                className="bg-[#f95721] hover:bg-[#e04a17] text-white font-semibold px-5 py-2.5 rounded-full text-xs transition-all shadow-md cursor-pointer"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
