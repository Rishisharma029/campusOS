import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Bus, Phone, Navigation } from 'lucide-react';

export const Transport: React.FC = () => {
  const routes = [
    { route: 'Route 12 (North Campus)', driver: 'Mr. Devendra Singh', contact: '+91 91223 34455', source: 'Sector-15 Metro', dest: 'Main Campus', status: 'On Route' },
    { route: 'Route 4 (South Campus)', driver: 'Mr. Hardik Lal', contact: '+91 91223 99887', source: 'Koramangala Hub', dest: 'Main Campus', status: 'On Route' },
    { route: 'Route 7 (East Sector)', driver: 'Mr. K. R. Prasad', contact: '+91 91223 77665', source: 'Whitefield Stn', dest: 'Main Campus', status: 'Parked' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Transport fleet
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor college transit routes, driver logs, and review mock GPS real-time bus locations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPS map tracker (Mocked with animation) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Route GPS Monitor</span>
              </CardTitle>
              <CardDescription>Real-time location of Bus Route 12</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 p-5">
            {/* GPS map container */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl h-[180px] bg-slate-900 overflow-hidden relative flex flex-col justify-between p-5 text-white shadow-premium">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

              <div className="flex items-center justify-between z-10 text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  <Navigation size={13} className="text-blue-500" /> Currently Heading: Main Gate (LHC)
                </span>
                <Badge variant="success" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                  On Schedule
                </Badge>
              </div>

              {/* Animated Path */}
              <div className="relative w-full z-10 flex flex-col gap-3 py-6 justify-center">
                {/* Horizontal line */}
                <div className="absolute left-0 right-0 h-1 bg-slate-800 rounded-full" />
                {/* Progress highlighted line */}
                <div className="absolute left-0 h-1 bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '65%' }} />

                {/* Markers */}
                <div className="flex justify-between items-center relative text-[9px] font-mono font-semibold text-slate-500">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
                    <span>Sector-15</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
                    <span>HSR Ring</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <span>Main Gate</span>
                  </div>
                </div>

                {/* Animated Bus Icon */}
                <div
                  className="absolute -top-1.5 p-1 bg-blue-600 rounded-full shadow-premium text-white animate-bounce pointer-events-none"
                  style={{ left: 'calc(65% - 12px)' }}
                >
                  <Bus size={12} />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 z-10">
                <span>Speed: 38 km/h</span>
                <span>Est. Arrival: 4 mins (2.4 km remaining)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bus list */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {routes.map((r, idx) => (
            <Card key={idx} hoverable>
              <CardContent className="p-4 flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Bus size={14} className="text-slate-400" /> {r.route}
                  </h4>
                  <Badge variant={r.status === 'On Route' ? 'success' : 'secondary'}>{r.status}</Badge>
                </div>

                <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
                  <span>Source: {r.source}</span>
                  <span>Destination: {r.dest}</span>
                  <div className="flex items-center gap-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 pt-2 text-[11px]">
                    <Phone size={11} className="text-slate-400 shrink-0" />
                    <span>Driver: {r.driver} ({r.contact})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
