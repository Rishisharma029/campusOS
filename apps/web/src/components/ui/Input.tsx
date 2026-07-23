import React, { forwardRef } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', containerClassName = '', type = 'text', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            type={type}
            className={`w-full text-sm px-3.5 py-2.0 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-surface text-main placeholder-slate-400 dark:bg-slate-800 transition-shadow
              ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}
              ${leftIcon ? 'pl-10' : ''} 
              ${rightIcon ? 'pr-10' : ''} 
              ${className}
            `}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-slate-400">{rightIcon}</div>}
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, children, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
        <select
          ref={ref}
          className={`w-full text-sm px-3.5 py-2.0 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-surface text-main dark:bg-slate-800 transition-shadow
            ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}
            ${className}
          `}
          {...props}
        >
          {options ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )) : children}
        </select>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
        <textarea
          ref={ref}
          className={`w-full text-sm px-3.5 py-2.0 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-surface text-main dark:bg-slate-800 transition-shadow min-h-[80px]
            ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
