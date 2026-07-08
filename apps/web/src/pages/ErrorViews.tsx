import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldAlert, Search, RefreshCw, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ErrorViews: React.FC = () => {
  const navigate = useNavigate();
  const [activeError, setActiveError] = useState<'403' | '404' | '500' | 'maintenance'>('403');

  const renderActiveError = () => {
    switch (activeError) {
      case '403':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/20 text-red-600 flex items-center justify-center shadow-sm">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">403: Forbidden</h2>
              <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                Access Denied. Your active user role permissions do not authorize access to this administrative database module.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        );
      case '404':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center shadow-sm">
              <Search size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">404: Not Found</h2>
              <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                Page Not Found. The resource may have been relocated or you might have input an invalid URL route.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/')}>
                Back Home
              </Button>
            </div>
          </div>
        );
      case '500':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center shadow-sm">
              <RefreshCw size={32} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">500: Server Error</h2>
              <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                Internal Server Error. Connection to the database collapsed or timed out. Please try refreshing.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                Retry Connection
              </Button>
            </div>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/20 text-purple-600 flex items-center justify-center shadow-sm">
              <Construction size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">System Maintenance</h2>
              <p className="text-xs text-slate-450 mt-2 leading-relaxed">
                CampusOS is currently performing planned database schema migrations. Back-up operations are underway.
              </p>
            </div>
            <p className="text-[9px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded">
              ETA: 45 minutes
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Illustrated Error & Empty States
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Template structures for Forbidden access, Not Found, Internal Server Failures, and System Maintenance.
        </p>
      </div>

      {/* Simulator Switcher Controls */}
      <div className="flex justify-center gap-2 p-2 border border-main rounded-2xl bg-surface shadow-sm max-w-md mx-auto">
        <button
          onClick={() => setActiveError('403')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            activeError === '403' ? 'bg-primary text-white border-primary' : 'border-main text-slate-500 hover:bg-slate-50 bg-surface'
          }`}
        >
          403
        </button>
        <button
          onClick={() => setActiveError('404')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            activeError === '404' ? 'bg-primary text-white border-primary' : 'border-main text-slate-500 hover:bg-slate-50 bg-surface'
          }`}
        >
          404
        </button>
        <button
          onClick={() => setActiveError('500')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            activeError === '500' ? 'bg-primary text-white border-primary' : 'border-main text-slate-500 hover:bg-slate-50 bg-surface'
          }`}
        >
          500
        </button>
        <button
          onClick={() => setActiveError('maintenance')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            activeError === 'maintenance' ? 'bg-primary text-white border-primary' : 'border-main text-slate-500 hover:bg-slate-50 bg-surface'
          }`}
        >
          Maint
        </button>
      </div>

      {/* Visual Canvas Display */}
      <Card className="shadow-premium border border-main bg-surface max-w-xl mx-auto w-full py-12">
        <CardContent>{renderActiveError()}</CardContent>
      </Card>
    </div>
  );
};
