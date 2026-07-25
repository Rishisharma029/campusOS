import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Lock, AlertTriangle, KeyRound } from 'lucide-react';
import { SessionSecurityEngine } from '../../lib/sessionSecurityEngine';

interface StepUpAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle: string;
  actionDescription: string;
}

export const StepUpAuthModal: React.FC<StepUpAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle,
  actionDescription,
}) => {
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const code = SessionSecurityEngine.generateStepUpOtp();
      setGeneratedOtp(code);
      setInputOtp('');
      setError('');
    }
  }, [isOpen]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    setTimeout(() => {
      if (SessionSecurityEngine.verifyStepUpOtp(inputOtp, generatedOtp)) {
        setVerifying(false);
        onSuccess();
        onClose();
      } else {
        setVerifying(false);
        setError('Invalid Security OTP Code. Please re-enter the 6-digit challenge code.');
      }
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zero-Trust Step-Up 2FA Security Challenge">
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle size={14} className="text-amber-400" />
            High-Risk Action Authorization Required
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            <strong>{actionTitle}</strong>: {actionDescription}
          </p>
        </div>

        {/* Dynamic Demo Security OTP Display */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
            Security Challenge OTP (Time-based Key)
          </span>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 tracking-widest">
            {generatedOtp || '******'}
          </div>
          <p className="text-[9px] text-slate-400 italic">Enter the 6-digit key above to authorize this operation.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <KeyRound size={14} className="text-emerald-400" />
            Enter 6-Digit Verification Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. 849201"
            value={inputOtp}
            onChange={(e) => setInputOtp(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-cyan-500"
            autoFocus
          />
          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={verifying}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-5 py-2 flex items-center gap-1.5"
          >
            <ShieldCheck size={15} /> Authorize High-Risk Action
          </Button>
        </div>
      </form>
    </Modal>
  );
};
