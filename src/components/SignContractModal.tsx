import React, { useRef, useState } from 'react';
import { X, Check, FileCheck, ShieldAlert, PenTool, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignComplete: () => void;
}

export const SignContractModal: React.FC<SignContractModalProps> = ({
  isOpen,
  onClose,
  onSignComplete,
}) => {
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('draw');
  const [typedName, setTypedName] = useState('Camille Dubois');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedDeposit, setAgreedDeposit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#181311';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSignature = () => {
    if (!agreedTerms || !agreedDeposit) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSignComplete();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f95721', '#181311', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        // fallback
      }
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#f95721] uppercase">
              LEGAL CONTRACT SIGNING
            </div>
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
              Review & Sign Agreement AC-2418
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Key Summary */}
        <div className="mt-5 bg-[#FAF8F5] rounded-2xl p-4 border border-neutral-200/80 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Vehicle</span>
            <span className="font-bold text-neutral-900">2025 Volkswagen Golf (Plate 4218-A-6)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Rental Agency</span>
            <span className="font-bold text-neutral-900">Mayache Cars · Agadir (Reg. #MA-AGA-489)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Pick-up & Return</span>
            <span className="font-semibold text-neutral-800">3 Sep 10:00 – 8 Sep 10:00 (Terminal 1 Arrivals)</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200/60 pt-2 font-semibold">
            <span className="text-neutral-700">Total Rental</span>
            <span className="text-[#f95721] font-bold text-sm">2,450 MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Security Deposit Hold</span>
            <span className="font-bold text-neutral-900">2,000 MAD (Pre-authorized, released on return)</span>
          </div>
        </div>

        {/* Signature Pad */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Renter Signature</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSignatureMode('draw')}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  signatureMode === 'draw' ? 'bg-[#181311] text-white font-medium' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Draw
              </button>
              <button
                type="button"
                onClick={() => setSignatureMode('type')}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  signatureMode === 'type' ? 'bg-[#181311] text-white font-medium' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Type
              </button>
              {signatureMode === 'draw' && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[11px] text-[#f95721] hover:underline ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {signatureMode === 'draw' ? (
            <div className="border border-neutral-300 rounded-2xl bg-neutral-50/50 p-2 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={480}
                height={120}
                className="w-full h-[120px] bg-white rounded-xl touch-none cursor-crosshair shadow-inner"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-neutral-400 font-medium">
                  Draw your digital signature here using mouse or fingertip
                </div>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Full legal name"
              className="w-full font-serif-display italic text-lg px-4 py-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-[#f95721]"
            />
          )}
        </div>

        {/* Checkbox agreements */}
        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-2.5 text-xs text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#f95721] focus:ring-[#f95721] w-4 h-4 cursor-pointer"
            />
            <span>
              I accept the standard Moroccan car rental terms, third-party + CDW coverage (with 4,000 MAD excess), and fuel policy (Full to full).
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedDeposit}
              onChange={(e) => setAgreedDeposit(e.target.checked)}
              className="mt-0.5 rounded text-[#f95721] focus:ring-[#f95721] w-4 h-4 cursor-pointer"
            />
            <span>
              I authorize the temporary pre-authorization hold of <strong>2,000 MAD</strong> on Visa ending 4218, to be fully released upon vehicle return inspection.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-7 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSignature}
            disabled={!agreedTerms || !agreedDeposit || isSubmitting}
            className="bg-[#f95721] hover:bg-[#e04816] disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Recording signature...' : 'Confirm & Sign Agreement'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
