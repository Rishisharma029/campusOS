import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Thermometer, Users, Home, Bus, RefreshCw, Zap } from 'lucide-react';

interface ClassroomTwin {
  id: string;
  name: string;
  subject: string;
  occupied: number;
  capacity: number;
  temp: string;
  seats: boolean[]; // true = occupied, false = empty
}

export const DigitalTwin: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Classroom Twin status
  const [classrooms, setClassrooms] = useState<ClassroomTwin[]>([
    {
      id: 'c1',
      name: 'LHC-101 (Lecture Hall)',
      subject: 'Advanced Software Architectures (CS-401)',
      occupied: 42,
      capacity: 50,
      temp: '22.8°C',
      seats: [
        true, true, true, false, true, true, false, true, true, true,
        true, false, true, true, true, true, true, false, true, true,
        true, true, true, true, false, true, true, true, false, true,
        true, true, false, true, true, true, true, true, true, true,
        false, true, true, true, true, false, true, true, false, false
      ]
    },
    {
      id: 'c2',
      name: 'LHC-204 (Mini Theater)',
      subject: 'Data Mining and Analysis (CS-403)',
      occupied: 28,
      capacity: 40,
      temp: '24.1°C',
      seats: [
        true, false, true, true, false, true, true, false, true, true,
        false, true, true, false, true, true, false, true, true, false,
        true, true, false, true, true, false, true, true, false, true,
        true, false, true, true, false, true, true, false, false, false
      ]
    },
    {
      id: 'c3',
      name: 'Lab 3 (Computer Labs)',
      subject: 'Human Computer Interaction (CS-405)',
      occupied: 18,
      capacity: 30,
      temp: '21.5°C',
      seats: [
        true, true, true, true, true, true, true, true, true, true,
        true, true, true, true, true, true, true, true, false, false,
        false, false, false, false, false, false, false, false, false, false
      ]
    }
  ]);

  // Handle simulated sensor refresh
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Jiggle some room temperatures and occupied seat counts
      setClassrooms(prev =>
        prev.map(c => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newOccupied = Math.max(10, Math.min(c.capacity, c.occupied + change));
          // Regulate seats mapping matching new count
          const newSeats = [...c.seats];
          let diff = newOccupied - c.occupied;
          while (diff !== 0) {
            const idx = Math.floor(Math.random() * c.capacity);
            if (diff > 0 && !newSeats[idx]) {
              newSeats[idx] = true;
              diff--;
            } else if (diff < 0 && newSeats[idx]) {
              newSeats[idx] = false;
              diff++;
            }
          }
          const tVal = parseFloat(c.temp) + (Math.random() * 0.4 - 0.2);
          return {
            ...c,
            occupied: newOccupied,
            temp: `${tVal.toFixed(1)}°C`,
            seats: newSeats
          };
        })
      );
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      triggerRefresh();
    }, 15000); // refresh every 15s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Campus Digital Twin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time IoT telemetry, classroom seat mapping utilization, and transport fleet coordinate relays.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-450 dark:text-slate-550 font-semibold font-mono">
            Sensor Feed: Active | Refreshed: {lastRefreshed.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={triggerRefresh}
            className="flex items-center gap-1.5 h-8 text-[11px]"
            disabled={isRefreshing}
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Grid Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-premium border border-main">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shrink-0">
              <Zap size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider m-0">IoT Sensors Online</p>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">142 / 145</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium border border-main">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shrink-0">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider m-0">Total Active Readers</p>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">88 Students</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium border border-main">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 shrink-0">
              <Home size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider m-0">Hostel Bed occupancy</p>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">92% Capacity</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium border border-main">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 shrink-0">
              <Bus size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider m-0">Buses En Route</p>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">3 Routes Active</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classroom Heatmap visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {classrooms.map(c => {
          const utilPct = Math.round((c.occupied / c.capacity) * 100);
          return (
            <Card key={c.id} className="shadow-premium border border-main bg-surface flex flex-col h-full">
              <CardHeader className="p-4 border-b border-main flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0 leading-tight">
                    {c.name}
                  </h3>
                  <Badge variant={utilPct > 80 ? 'danger' : utilPct > 50 ? 'warning' : 'success'}>
                    {utilPct}% Utilized
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 font-medium m-0 truncate">
                  Active: {c.subject}
                </p>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Visual Seat map Grid */}
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Classroom Seat Grid Map</p>
                  <div className="grid grid-cols-10 gap-1.5 p-3.5 bg-slate-100 dark:bg-slate-900/30 rounded-xl justify-center">
                    {c.seats.map((seat, i) => (
                      <div
                        key={i}
                        title={`Seat ${i + 1}: ${seat ? 'Occupied' : 'Vacant'}`}
                        className={`aspect-square w-full rounded transition-all duration-300 ${
                          seat
                            ? 'bg-primary dark:bg-blue-600 shadow-sm border border-blue-500/20'
                            : 'bg-slate-250 dark:bg-slate-800 border border-main/50'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 text-[9px] text-slate-450 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-primary dark:bg-blue-600 inline-block" /> Occupied
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-slate-250 dark:bg-slate-800 border border-main/50 inline-block" /> Vacant
                    </span>
                  </div>
                </div>

                {/* Telemetry metadata footer */}
                <div className="grid grid-cols-2 gap-2 border-t border-main pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-slate-400" />
                    <span>Count: <strong>{c.occupied} / {c.capacity}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Thermometer size={12} className="text-slate-400" />
                    <span>Temp: <strong>{c.temp}</strong></span>
                  </div>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hostel & Transport Twin Relays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostel blocks occupancies & dining checks */}
        <Card className="shadow-premium border border-main bg-surface">
          <CardHeader className="p-4 border-b border-main">
            <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display flex items-center gap-2">
              <Home size={15} className="text-purple-500" /> Hostel Dorms & Dining Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span>Block A (Boys Dormitory)</span>
                  <span>184 / 200 Beds (92%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span>Block B (Girls Dormitory)</span>
                  <span>145 / 150 Beds (96%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span>Mess Hall Queue Congestion</span>
                  <span className="text-amber-500 font-bold">Moderate Queue Load</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-xl text-[10px] text-slate-600 dark:text-slate-400">
              <span className="font-bold text-purple-700 dark:text-purple-400">Hostel Warden Alert:</span> Dinner checkout gates open in 45 minutes. Water tanks heating grids are currently active and stabilized at 48°C.
            </div>
          </CardContent>
        </Card>

        {/* Transport Fleet Relays */}
        <Card className="shadow-premium border border-main bg-surface">
          <CardHeader className="p-4 border-b border-main">
            <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display flex items-center gap-2">
              <Bus size={15} className="text-amber-500" /> Active Bus Transit Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start p-2.5 border border-main rounded-xl bg-slate-50/30 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 m-0">Bus Route 12 (North Campus)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Location: Crossing Sector-15 Metro Station</p>
                </div>
                <div className="text-right">
                  <Badge variant="success">On Time</Badge>
                  <p className="text-[9px] text-slate-450 font-bold mt-1">Speed: 42 km/h</p>
                </div>
              </div>

              <div className="flex justify-between items-start p-2.5 border border-main rounded-xl bg-slate-50/30 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 m-0">Bus Route 4 (South Campus)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Location: Koramangala Flyover (Heavy Traffic)</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">5m Delay</Badge>
                  <p className="text-[9px] text-slate-450 font-bold mt-1">Speed: 18 km/h</p>
                </div>
              </div>

              <div className="flex justify-between items-start p-2.5 border border-main rounded-xl bg-slate-50/30 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 m-0">Bus Route 7 (East Sector)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Location: Main Campus Parking Lot</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Parked</Badge>
                  <p className="text-[9px] text-slate-450 font-bold mt-1">Engine Off</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
