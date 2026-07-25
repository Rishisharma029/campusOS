import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import {
  Network,
  Sparkles,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Bus,
  Clock,
  Wrench,
  Coffee,
  UserCheck,
  Shield,
  Layers,
  Activity,
  Maximize2,
  RefreshCw,
  Compass,
  Building,
  Check,
} from 'lucide-react';

interface ClassroomPin {
  id: string;
  name: string;
  block: string;
  capacity: number;
  occupied: number;
  status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
  cctvActive: boolean;
  activeSubject?: string;
  coordinates: { x: number; y: number };
}

interface LabTelemetry {
  id: string;
  name: string;
  block: string;
  pcsActive: number;
  totalPcs: number;
  equipmentStatus: string;
  coordinates: { x: number; y: number };
}

interface BusTelemetry {
  id: string;
  route: string;
  busNumber: string;
  speedKmH: number;
  currentLocation: string;
  etaGate1: string;
  passengers: number;
  capacity: number;
  positionPercent: number; // 0 to 100 on canvas route
}

interface FacultyStatus {
  id: string;
  name: string;
  department: string;
  status: 'IN_OFFICE' | 'IN_LECTURE' | 'IN_LAB' | 'AWAY';
  location: string;
  officeHours: string;
  avatar: string;
}

interface VisitorMovement {
  id: string;
  visitorName: string;
  hostPerson: string;
  gateEntry: string;
  entryTime: string;
  badgeNumber: string;
  currentZone: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT';
}

export const DigitalTwin: React.FC = () => {
  const { currentRole } = useRole();
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'CLASSROOMS_OCCUPIED' | 'CLASSROOMS_VACANT' | 'LABS' | 'CANTEEN' | 'BUSES' | 'FACULTY' | 'VISITORS'
  >('ALL');

  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [busProgress, setBusProgress] = useState<number>(45);

  // Simulated auto-pulse for live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setBusProgress(prev => (prev >= 95 ? 5 : prev + 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 1. Classrooms Data
  const classrooms: ClassroomPin[] = [
    { id: 'c1', name: 'LHC-101', block: 'Block A', capacity: 60, occupied: 58, status: 'OCCUPIED', cctvActive: true, activeSubject: 'DBMS (CS302)', coordinates: { x: 22, y: 35 } },
    { id: 'c2', name: 'LHC-204', block: 'Block A', capacity: 60, occupied: 0, status: 'VACANT', cctvActive: true, coordinates: { x: 28, y: 48 } },
    { id: 'c3', name: 'B-102', block: 'Block B', capacity: 45, occupied: 41, status: 'OCCUPIED', cctvActive: true, activeSubject: 'Robotics (EC401)', coordinates: { x: 55, y: 30 } },
    { id: 'c4', name: 'B-302', block: 'Block B', capacity: 45, occupied: 0, status: 'VACANT', cctvActive: false, coordinates: { x: 62, y: 42 } },
    { id: 'c5', name: 'A-105', block: 'Block A', capacity: 50, occupied: 0, status: 'VACANT', cctvActive: true, coordinates: { x: 18, y: 55 } },
  ];

  // 2. Labs Telemetry
  const labs: LabTelemetry[] = [
    { id: 'l1', name: 'Computing Lab-2', block: 'Block A', pcsActive: 40, totalPcs: 40, equipmentStatus: 'High Performance GPU Cluster Active', coordinates: { x: 32, y: 25 } },
    { id: 'l2', name: 'Hardware Lab-5', block: 'Block B', pcsActive: 18, totalPcs: 30, equipmentStatus: 'Oscilloscopes & Embedded Kits On', coordinates: { x: 68, y: 35 } },
  ];

  // 3. Live Buses Telemetry
  const buses: BusTelemetry[] = [
    { id: 'b1', route: 'Route 1 (North Express)', busNumber: 'KA-01-EQ-9012', speedKmH: 42, currentLocation: 'Near Ring Road Junction', etaGate1: '6 Mins', passengers: 38, capacity: 50, positionPercent: busProgress },
    { id: 'b2', route: 'Route 2 (South City)', busNumber: 'KA-01-EQ-4411', speedKmH: 36, currentLocation: 'Metro Station Stop', etaGate1: '12 Mins', passengers: 45, capacity: 50, positionPercent: (busProgress + 30) % 100 },
    { id: 'b3', route: 'Route 3 (East Sector)', busNumber: 'KA-01-EQ-8820', speedKmH: 40, currentLocation: 'Central Flyover', etaGate1: '4 Mins', passengers: 22, capacity: 50, positionPercent: (busProgress + 60) % 100 },
  ];

  // 4. Faculty Availability Status
  const facultyMembers: FacultyStatus[] = [
    { id: 'f1', name: 'Dr. Arindam Sen', department: 'Computer Science', status: 'IN_OFFICE', location: 'Block A, Room 204', officeHours: '02:00 PM - 04:00 PM', avatar: 'AS' },
    { id: 'f2', name: 'Prof. Rajesh K. Mehta', department: 'Computer Science', status: 'IN_LECTURE', location: 'LHC-101 (DBMS)', officeHours: '11:00 AM - 01:00 PM', avatar: 'RM' },
    { id: 'f3', name: 'Dr. Sarah Jenkins', department: 'Robotics & AI', status: 'IN_LAB', location: 'Robotics Hall (Block B)', officeHours: '03:00 PM - 05:00 PM', avatar: 'SJ' },
    { id: 'f4', name: 'Dr. Vikramaditya Rao', department: 'Electronics', status: 'AWAY', location: 'Off Campus (Conference)', officeHours: 'Tomorrow 10 AM', avatar: 'VR' },
  ];

  // 5. Visitor Movement & Security
  const visitors: VisitorMovement[] = [
    { id: 'v1', visitorName: 'Rohan Deshmukh (Google Recruiter)', hostPerson: 'Placement Cell', gateEntry: 'Gate 1', entryTime: '09:15 AM', badgeNumber: 'V-1042', currentZone: 'Block A Conference Hall', status: 'CHECKED_IN' },
    { id: 'v2', visitorName: 'Meera Kulkarni (Guest Speaker)', hostPerson: 'Dr. Arindam Sen', gateEntry: 'Gate 1', entryTime: '10:00 AM', badgeNumber: 'V-1043', currentZone: 'Auditorium 2', status: 'CHECKED_IN' },
    { id: 'v3', visitorName: 'Suresh Kumar (Vendor Delivery)', hostPerson: 'Central Store', gateEntry: 'Gate 2', entryTime: '10:30 AM', badgeNumber: 'V-1044', currentZone: 'Service Bay', status: 'CHECKED_IN' },
  ];

  const handleBookVacantClassroom = (roomName: string) => {
    setBookingConfirmed(roomName);
    setTimeout(() => setBookingConfirmed(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
                <Network size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  CampusOS AI Digital Twin
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                    Live Spatial Telemetry Stream
                  </span>
                </h1>
                <p className="text-xs text-slate-300">Real-Time Occupancy, GPS Buses, Lab Telemetry, Canteen Crowd & Visitor Tracking</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-emerald-400 font-mono font-semibold">
              <Activity size={14} className="animate-bounce" />
              SOCKET.IO STREAM ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Toast */}
      {bookingConfirmed && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>Reserved {bookingConfirmed} successfully! Digital pass code sent to your student wallet.</span>
          </div>
        </div>
      )}

      {/* Live Operational Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Occupied:</span>
          <strong className="text-rose-400 font-bold">2 Rooms</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Vacant:</span>
          <strong className="text-emerald-400 font-bold">3 Rooms</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Canteen:</span>
          <strong className="text-amber-400 font-bold">74% Crowd</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">GPS Buses:</span>
          <strong className="text-cyan-400 font-bold">3 Active</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Faculty In-Office:</span>
          <strong className="text-purple-400 font-bold">2 / 4</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Active Visitors:</span>
          <strong className="text-blue-400 font-bold">34 Guests</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">CCTV Nodes:</span>
          <strong className="text-emerald-400 font-bold">48 Online</strong>
        </div>
      </div>

      {/* Interactive Layer Filter Bar */}
      <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-slate-400 font-bold px-2 flex items-center gap-1">
          <Layers size={13} /> Layers:
        </span>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'ALL' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All Layers (7 Telemetry Streams)
        </button>
        <button
          onClick={() => setActiveTab('CLASSROOMS_OCCUPIED')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'CLASSROOMS_OCCUPIED' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Occupied Classrooms (2)
        </button>
        <button
          onClick={() => setActiveTab('CLASSROOMS_VACANT')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'CLASSROOMS_VACANT' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Empty Classrooms (3)
        </button>
        <button
          onClick={() => setActiveTab('LABS')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'LABS' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Labs & Hardware (2)
        </button>
        <button
          onClick={() => setActiveTab('CANTEEN')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'CANTEEN' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Canteen Crowd Meter (74%)
        </button>
        <button
          onClick={() => setActiveTab('BUSES')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'BUSES' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Live Buses GPS (3)
        </button>
        <button
          onClick={() => setActiveTab('FACULTY')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'FACULTY' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Faculty Availability
        </button>
        <button
          onClick={() => setActiveTab('VISITORS')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'VISITORS' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Visitor Security Passes
        </button>
      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 2D Spatial Map Canvas with Pins */}
        <div className="lg:col-span-2 glass-card p-4 space-y-4 border-cyan-500/30 flex flex-col justify-between h-[580px] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Compass size={16} className="text-cyan-400" />
              University 2D/3D Vector Spatial Telemetry Canvas
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              CCTV AI Face Scanner + IoT Sensors Active
            </span>
          </div>

          {/* Interactive Spatial Canvas Backdrop */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden p-4">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

            {/* Campus Buildings Visual Outlines */}
            {/* Block A (Computer Science) */}
            <div className="absolute left-[15%] top-[20%] w-[32%] h-[40%] rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-950/20 p-3">
              <span className="text-[10px] font-bold text-blue-400 font-mono">BLOCK A (CS & AI WING)</span>
            </div>

            {/* Block B (Electronics & Hardware) */}
            <div className="absolute right-[15%] top-[20%] w-[32%] h-[40%] rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-950/20 p-3">
              <span className="text-[10px] font-bold text-purple-400 font-mono">BLOCK B (HARDWARE WING)</span>
            </div>

            {/* Canteen & Mess */}
            <div className="absolute left-[15%] bottom-[15%] w-[30%] h-[20%] rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-950/20 p-3">
              <span className="text-[10px] font-bold text-amber-400 font-mono">CENTRAL MESS & CANTEEN</span>
            </div>

            {/* Bus Depot & Gate 1 */}
            <div className="absolute right-[15%] bottom-[15%] w-[30%] h-[20%] rounded-2xl border-2 border-dashed border-cyan-500/30 bg-cyan-950/20 p-3">
              <span className="text-[10px] font-bold text-cyan-400 font-mono">BUS TERMINAL & GATE 1</span>
            </div>

            {/* Classrooms Pins Rendering */}
            {(activeTab === 'ALL' || activeTab === 'CLASSROOMS_OCCUPIED' || activeTab === 'CLASSROOMS_VACANT') &&
              classrooms.map(c => {
                if (activeTab === 'CLASSROOMS_OCCUPIED' && c.status !== 'OCCUPIED') return null;
                if (activeTab === 'CLASSROOMS_VACANT' && c.status !== 'VACANT') return null;

                const isOccupied = c.status === 'OCCUPIED';

                return (
                  <div
                    key={c.id}
                    style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  >
                    <div
                      className={`p-2 rounded-xl border flex items-center gap-1.5 shadow-lg transition-transform group-hover:scale-110 ${
                        isOccupied
                          ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-rose-500/20 animate-pulse'
                          : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-emerald-500/20'
                      }`}
                    >
                      <MapPin size={14} className={isOccupied ? 'text-rose-400' : 'text-emerald-400'} />
                      <span className="text-[11px] font-extrabold font-mono">{c.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950">
                        {isOccupied ? `${c.occupied}/${c.capacity}` : 'VACANT'}
                      </span>
                    </div>

                    {/* Hover Card */}
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-200 z-30 shadow-2xl space-y-1">
                      <p className="font-bold text-white">{c.name} ({c.block})</p>
                      <p className="text-slate-400">Status: <strong className={isOccupied ? 'text-rose-400' : 'text-emerald-400'}>{c.status}</strong></p>
                      {c.activeSubject && <p className="text-blue-400">Subject: {c.activeSubject}</p>}
                      {c.status === 'VACANT' && (
                        <button
                          onClick={() => handleBookVacantClassroom(c.name)}
                          className="mt-1.5 w-full py-1 rounded bg-emerald-600 text-white font-bold text-[9px]"
                        >
                          1-Click Book Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Live Animated Bus GPS Marker */}
            {(activeTab === 'ALL' || activeTab === 'BUSES') && (
              <div
                style={{ left: `${65 + (busProgress % 20)}%`, bottom: '22%' }}
                className="absolute transition-all duration-1000 z-20"
              >
                <div className="p-2 rounded-xl bg-cyan-600 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 animate-bounce">
                  <Bus size={14} />
                  <span>Bus 1 (42 km/h)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Detailed Telemetry Control Panel */}
        <div className="space-y-4">
          {/* Canteen Crowd Density Meter */}
          {(activeTab === 'ALL' || activeTab === 'CANTEEN') && (
            <div className="glass-card p-4 space-y-3 border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Coffee size={14} /> Canteen Crowd Density Meter
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">74% Capacity</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 w-[74%] transition-all" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Queue Wait Time: <strong className="text-amber-400">14 Mins</strong></span>
                <span>Peak Hour: <strong className="text-white">Lunch (12-2 PM)</strong></span>
              </div>
            </div>
          )}

          {/* Live Buses GPS Telemetry List */}
          {(activeTab === 'ALL' || activeTab === 'BUSES') && (
            <div className="glass-card p-4 space-y-3 border-blue-500/30">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Bus size={14} /> Live GPS Bus Fleet Telemetry
              </span>

              <div className="space-y-2">
                {buses.map(b => (
                  <div key={b.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{b.route}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                        ETA: {b.etaGate1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Speed: <strong className="text-slate-200">{b.speedKmH} km/h</strong></span>
                      <span>Passengers: <strong className="text-slate-200">{b.passengers}/{b.capacity}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Availability Grid */}
          {(activeTab === 'ALL' || activeTab === 'FACULTY') && (
            <div className="glass-card p-4 space-y-3 border-purple-500/30">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck size={14} /> Faculty Live Availability Grid
              </span>

              <div className="space-y-2">
                {facultyMembers.map(f => (
                  <div key={f.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {f.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white">{f.name}</p>
                        <p className="text-[10px] text-slate-400">{f.location}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                        f.status === 'IN_OFFICE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : f.status === 'IN_LECTURE'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : f.status === 'IN_LAB'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visitor Security Movement */}
          {(activeTab === 'ALL' || activeTab === 'VISITORS') && (
            <div className="glass-card p-4 space-y-3 border-pink-500/30">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
                <Shield size={14} /> Visitor Movement & Security Gate Logs
              </span>

              <div className="space-y-2">
                {visitors.map(v => (
                  <div key={v.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{v.visitorName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono font-bold">
                        {v.badgeNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Host: <strong className="text-slate-300">{v.hostPerson}</strong></span>
                      <span>Zone: <strong className="text-slate-300">{v.currentZone}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
