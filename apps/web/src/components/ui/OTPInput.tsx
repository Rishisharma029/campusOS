import React, { useRef, useState } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value: _value,
  onChange,
  error,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    const newDigits = [...digits];
    
    // Take the last character entered
    newDigits[index] = val.substring(val.length - 1);
    setDigits(newDigits);
    
    const combinedValue = newDigits.join('');
    onChange(combinedValue);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move focus back on delete
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().substring(0, length);
    if (!/^\d+$/.test(pasteData)) return; // numbers only

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);
    onChange(newDigits.join(''));
    
    // Focus last filled or next input
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {Array(length)
          .fill(null)
          .map((_, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={1}
              value={digits[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-12 h-12 text-center text-lg font-bold border rounded-xl bg-surface text-slate-800 dark:text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                error ? 'border-danger focus:ring-danger' : 'border-main'
              }`}
            />
          ))}
      </div>
      {error && <span className="text-center text-xs text-danger font-medium">{error}</span>}
    </div>
  );
};
