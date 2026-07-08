import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OTPInput } from '../components/ui/OTPInput';
import { Accordion } from '../components/ui/Accordion';
import { Stepper } from '../components/ui/Stepper';
import { Code } from 'lucide-react';

export const DesignSystemDocs: React.FC = () => {
  const [otpDemo, setOtpDemo] = useState('');
  const [activeStepDemo, setActiveStepDemo] = useState(1);
  const [showCode, setShowCode] = useState<Record<string, boolean>>({});

  const toggleCode = (compKey: string) => {
    setShowCode((prev) => ({ ...prev, [compKey]: !prev[compKey] }));
  };

  const colors = [
    { name: 'Primary (Accent)', class: 'bg-primary', description: 'Interactive buttons, active items, links' },
    { name: 'Success', class: 'bg-success', description: 'Schedules on-time, fully paid fee status, approved leaves' },
    { name: 'Warning', class: 'bg-warning', description: 'Dues warnings, late classes, medium risk default metrics' },
    { name: 'Danger', class: 'bg-danger', description: 'Critical dropout alerts, high dues risk, failing grades' },
  ];

  const typography = [
    { label: 'Display Header 1', spec: 'Poppins, SemiBold, 24px', sample: 'CampusOS Portal' },
    { label: 'Display Header 2', spec: 'Poppins, Bold, 20px', sample: 'Smart Digital Twin' },
    { label: 'Body Text', spec: 'Inter, Regular, 14px', sample: 'The core database tracks active students.' },
    { label: 'Muted Caption', spec: 'Inter, Medium, 11px', sample: 'Created At: 2026-07-08T12:15' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Design System & Style Guide
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Visual documentation of design tokens, color profiles, and reusable UI components.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Token Specs (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Brand Identity Card */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                Brand Details
              </h3>
            </div>
            <CardContent className="p-3.5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow font-black text-white text-base">
                  C
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 m-0">CampusOS ERP</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">"The Operating System for Modern Education"</p>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-main pt-3">
                <strong>Icons:</strong> Lucide-react (Dynamic resolution).<br />
                <strong>Typography:</strong> Google Fonts: Inter (San-Serif body), Poppins (Display headings).
              </div>
            </CardContent>
          </Card>

          {/* Color Palettes Grid */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                HSL Semantic Color Tokens
              </h3>
            </div>
            <CardContent className="p-3.5 space-y-3.5">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg shrink-0 shadow-sm border border-main ${color.class}`} />
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 m-0">{color.name}</h4>
                    <p className="text-[9px] text-slate-450 mt-0.5 leading-normal">{color.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Typography Scale */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                Typography Scale
              </h3>
            </div>
            <CardContent className="p-3.5 space-y-3.5">
              {typography.map((type, i) => (
                <div key={i} className="flex justify-between items-start border-b border-main/50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{type.label}</p>
                    <p className="text-[11px] text-slate-550 dark:text-slate-405 font-mono mt-0.5">{type.spec}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{type.sample}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Component Demos (Right Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stepper Wizard Demo */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                Stepper Progress Indicator
              </h3>
              <button onClick={() => toggleCode('stepper')} className="text-slate-400 hover:text-slate-600"><Code size={14} /></button>
            </div>
            <CardContent className="p-4 space-y-4">
              <Stepper
                steps={[
                  { title: 'Personal Details', description: 'Profile info' },
                  { title: 'Academic Uploads', description: 'Grade card sheets' },
                  { title: 'Hostel Select', description: 'Room slot booking' }
                ]}
                currentStep={activeStepDemo}
              />
              <div className="flex gap-2 justify-center pt-2">
                <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => setActiveStepDemo(prev => Math.max(0, prev - 1))}>Back</Button>
                <Button size="sm" className="text-[10px] h-7" onClick={() => setActiveStepDemo(prev => Math.min(2, prev + 1))}>Next</Button>
              </div>

              {showCode['stepper'] && (
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[9px] font-mono overflow-x-auto leading-normal">
{`<Stepper
  steps={[
    { title: 'Personal Details', description: 'Profile info' },
    { title: 'Academic Uploads', description: 'Grade cards' }
  ]}
  currentStep={${activeStepDemo}}
/>`}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* OTP Digit block input Demo */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                2FA OTP Grid Block Input
              </h3>
              <button onClick={() => toggleCode('otp')} className="text-slate-400 hover:text-slate-600"><Code size={14} /></button>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="max-w-xs mx-auto">
                <OTPInput
                  value={otpDemo}
                  onChange={setOtpDemo}
                />
              </div>
              <p className="text-center text-[10px] text-slate-400">
                Active Code: <strong className="text-primary font-mono">{otpDemo || 'None'}</strong>
              </p>

              {showCode['otp'] && (
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[9px] font-mono overflow-x-auto leading-normal">
{`const [otp, setOtp] = useState('');
return (
  <OTPInput
    length={6}
    value={otp}
    onChange={setOtp}
  />
);`}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Accordion list Demo */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                Collapsible Accordion Group
              </h3>
              <button onClick={() => toggleCode('accordion')} className="text-slate-400 hover:text-slate-600"><Code size={14} /></button>
            </div>
            <CardContent className="p-4 space-y-4">
              <Accordion
                items={[
                  {
                    id: 'faq1',
                    title: 'What databases power the CampusOS portal?',
                    content: 'CampusOS currently runs a highly optimized context-level relational store simulating transactional grids locally. It compiles mock student rows, leaves logs, placement drives, and libraries catalogs.'
                  },
                  {
                    id: 'faq2',
                    title: 'How do I trigger custom HSL themes?',
                    content: 'Navigate to the top header navbar to toggle themes dynamically, or customize CSS profiles via the Settings panel.'
                  }
                ]}
              />

              {showCode['accordion'] && (
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[9px] font-mono overflow-x-auto leading-normal">
{`<Accordion
  items={[
    { id: '1', title: 'Header', content: 'Details here...' }
  ]}
/>`}
                </pre>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};
