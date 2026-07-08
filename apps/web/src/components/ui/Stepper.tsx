import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={index}>
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5 flex-1 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all ${
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : isActive
                    ? 'bg-surface border-primary text-primary shadow-md'
                    : 'bg-surface border-main text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold font-display ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[100px] leading-tight mx-auto">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  index < currentStep ? 'bg-primary' : 'bg-main'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
