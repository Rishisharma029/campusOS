import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldAlert, Zap, Search, Info } from 'lucide-react';

interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  floors: number;
  category: 'Academic' | 'Hostel' | 'Admin' | 'Facility' | 'Emergency';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  description: string;
  emergencyExits: string[];
}

const BUILDINGS: CampusBuilding[] = [
  {
    id: 'b-1',
    name: 'Computer Science Wing & AI Labs',
    code: 'Block A',
    floors: 5,
    category: 'Academic',
    x: 60,
    y: 80,
    width: 180,
    height: 120,
    color: 'from-blue-600 to-cyan-600',
    description: 'Houses Lab 1 to Lab 8, Server Room, Quantum Computing Center',
    emergencyExits: ['North Exit A', 'Staircase 2 South'],
  },
  {
    id: 'b-2',
    name: 'Mechanical & Robotics Block',
    code: 'Block B',
    floors: 4,
    category: 'Academic',
    x: 280,
    y: 80,
    width: 160,
    height: 140,
    color: 'from-purple-600 to-indigo-600',
    description: 'CAD/CAM Workshop, Mechatronics Lab 4, Heavy Machinery Hall',
    emergencyExits: ['East Ground Exit', 'Ramp Exit B'],
  },
  {
    id: 'b-3',
    name: 'Central Library 2.0 & Digital Hub',
    code: 'Block L',
    floors: 3,
    category: 'Facility',
    x: 480,
    y: 90,
    width: 140,
    height: 110,
    color: 'from-emerald-600 to-teal-600',
    description: '20,000+ E-books, RFID Counter, Quiet Study Pods',
    emergencyExits: ['Main Gate Exit'],
  },
  {
    id: 'b-4',
    name: 'Administrative HQ & Registrar',
    code: 'Admin Hall',
    floors: 2,
    category: 'Admin',
    x: 100,
    y: 260,
    width: 150,
    height: 100,
    color: 'from-amber-600 to-orange-600',
    description: 'Vice Chancellor Office, Fee Payment Counters, Admissions',
    emergencyExits: ['Front Porch', 'Back Stairwell'],
  },
  {
    id: 'b-5',
    name: 'Boys Hostel Complex (A-Block)',
    code: 'Hostel 1',
    floors: 6,
    category: 'Hostel',
    x: 300,
    y: 260,
    width: 160,
    height: 120,
    color: 'from-pink-600 to-rose-600',
    description: 'Capacity: 450 Students. Mess Ground Floor, Gym 1st Floor',
    emergencyExits: ['Fire Escape North', 'Fire Escape South'],
  },
  {
    id: 'b-6',
    name: 'Girls Hostel Complex (B-Block)',
    code: 'Hostel 2',
    floors: 6,
    category: 'Hostel',
    x: 500,
    y: 250,
    width: 150,
    height: 130,
    color: 'from-violet-600 to-fuchsia-600',
    description: 'Capacity: 400 Students. 24/7 Security Desk & Visitor Room',
    emergencyExits: ['Security Outpost Exit'],
  },
  {
    id: 'b-7',
    name: 'Campus Medical & First Aid Station',
    code: 'Emergency 1',
    floors: 1,
    category: 'Emergency',
    x: 670,
    y: 120,
    width: 100,
    height: 80,
    color: 'from-red-600 to-rose-700',
    description: '24/7 Doctor on duty, Ambulance Bay, Oxygen Supplies',
    emergencyExits: ['Direct Ambulance Bay'],
  },
];

export const CampusMap3D: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(BUILDINGS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState<'all' | 'academic' | 'hostel' | 'emergency'>('all');
  const [navPath, setNavPath] = useState<string | null>('Navigating: Admin Hall → Lab 4 (Block B)');

  const filteredBuildings = BUILDINGS.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeLayer === 'academic') return matchesSearch && b.category === 'Academic';
    if (activeLayer === 'hostel') return matchesSearch && b.category === 'Hostel';
    if (activeLayer === 'emergency') return matchesSearch && (b.category === 'Emergency' || b.category === 'Admin');
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="text-blue-400" size={26} />
            Interactive 3D Campus Map & Navigation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time spatial visualization of departments, labs, hostels, parking, and emergency exits.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Buildings
          </button>
          <button
            onClick={() => setActiveLayer('academic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'academic' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Academic / Labs
          </button>
          <button
            onClick={() => setActiveLayer('hostel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'hostel' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hostels & Mess
          </button>
          <button
            onClick={() => setActiveLayer('emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'emergency' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Emergency & SOS
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Visualizer */}
        <div className="lg:col-span-2 glass-card p-4 relative overflow-hidden flex flex-col min-h-[460px]">
          {/* Top Control Overlay */}
          <div className="flex items-center justify-between mb-4 z-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search building, Lab 4, hostel..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
            {navPath && (
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                <Navigation size={14} />
                <span>{navPath}</span>
              </div>
            )}
          </div>

          {/* Interactive Vector / Canvas Representation */}
          <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-800/80 relative p-4 overflow-auto min-h-[360px]">
            {/* Grid Backdrop Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* Campus Pathways SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="150" y1="140" x2="360" y2="150" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
              <line x1="360" y1="150" x2="550" y2="145" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
              <line x1="175" y1="310" x2="380" y2="320" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            </svg>

            {/* Render Buildings as Interactive Floating 3D-styled Nodes */}
            {filteredBuildings.map(building => {
              const isSelected = selectedBuilding.id === building.id;
              return (
                <div
                  key={building.id}
                  onClick={() => setSelectedBuilding(building)}
                  style={{
                    left: `${building.x}px`,
                    top: `${building.y}px`,
                    width: `${building.width}px`,
                    height: `${building.height}px`,
                  }}
                  className={`absolute rounded-2xl p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-xl flex flex-col justify-between border ${
                    isSelected
                      ? 'border-blue-400 ring-4 ring-blue-500/30 bg-gradient-to-br ' + building.color
                      : 'border-slate-700/80 bg-slate-900/90 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-slate-200">
                      {building.code}
                    </span>
                    {building.category === 'Emergency' && (
                      <ShieldAlert size={14} className="text-red-400 animate-ping" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{building.name}</h4>
                    <p className="text-[10px] text-slate-300 opacity-80">{building.floors} Floors</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Building Details Sidebar */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {selectedBuilding.category}
              </span>
              <span className="text-xs text-slate-400">{selectedBuilding.code}</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-100">{selectedBuilding.name}</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedBuilding.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-red-400" />
                Emergency Exits & Evacuation Routes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedBuilding.emergencyExits.map((exit, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-red-950/40 text-red-300 border border-red-800/40"
                  >
                    {exit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-6">
            <button
              onClick={() => setNavPath(`Route Active: Current Location → ${selectedBuilding.name}`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <Navigation size={14} />
              Set Navigation Destination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
