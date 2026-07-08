import React, { useEffect, useState } from 'react';
import { CloudLightning, CloudOff, RefreshCw, RotateCcw, X } from 'lucide-react';
import { useToast } from './Toast';

interface AutosaveIndicatorProps {
  isSaving: boolean;
  onUndo?: () => void;
  lastSavedAt?: Date | null;
}

export const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({
  isSaving,
  onUndo,
  lastSavedAt,
}) => {
  const { toast } = useToast();
  const [showUndoBanner, setShowUndoBanner] = useState(false);

  useEffect(() => {
    if (isSaving) {
      setShowUndoBanner(false);
    } else if (lastSavedAt) {
      // Show undo banner floating for 5 seconds when save finishes
      setShowUndoBanner(true);
      const timer = setTimeout(() => {
        setShowUndoBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSavedAt]);

  const handleUndoClick = () => {
    if (onUndo) {
      onUndo();
      toast('Changes Restored', 'The action was successfully undone.', 'info');
      setShowUndoBanner(false);
    }
  };

  return (
    <>
      {/* Small status tracker, fits in settings sub-headers */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
        {isSaving ? (
          <>
            <RefreshCw size={11} className="animate-spin text-primary" />
            <span>Autosaving changes...</span>
          </>
        ) : lastSavedAt ? (
          <>
            <CloudLightning size={11} className="text-emerald-500" />
            <span>Saved to cloud</span>
          </>
        ) : (
          <>
            <CloudOff size={11} className="text-slate-300" />
            <span>Draft</span>
          </>
        )}
      </div>

      {/* Floating Action Undo Notification */}
      {showUndoBanner && onUndo && (
        <div className="fixed bottom-4 right-4 z-[999] animate-slide-in-right flex items-center gap-3 p-3 bg-slate-900 text-white rounded-xl shadow-premium-lg border border-slate-800 text-xs">
          <span>Changes saved automatically</span>
          <button
            onClick={handleUndoClick}
            className="flex items-center gap-1 font-semibold text-primary hover:text-primary-light transition-colors px-2 py-1 rounded bg-slate-800 border border-slate-700 focus:outline-none"
          >
            <RotateCcw size={12} /> Undo
          </button>
          <button
            onClick={() => setShowUndoBanner(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
};
