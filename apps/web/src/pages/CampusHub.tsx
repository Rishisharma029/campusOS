import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Network, 
  Home, 
  Bus, 
  ShieldAlert, 
  Bell, 
  Zap, 
  Trophy, 
  LifeBuoy, 
  ArrowRight, 
  Building2,
  CheckCircle2,
  Users
} from 'lucide-react';

export const CampusHub: React.FC = () => {
  const navigate = useNavigate();

  const campusModules = [
    {
      title: '3D Campus Map',
      description: 'Interactive real-time three-dimensional spatial campus visualization and navigation.',
      path: '/map',
      icon: Compass,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Live GIS',
      metric: '42 Geo-Nodes'
    },
    {
      title: 'Campus Digital Twin',
      description: 'Virtual sensor replica monitoring occupancy, IoT endpoints, and infrastructure health.',
      path: '/twin',
      icon: Network,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Realtime Twin',
      metric: '99.4% Sync'
    },
    {
      title: 'Energy & Sustainability',
      description: 'Solar grid telemetry, smart HVAC monitoring, and net-zero carbon analytics.',
      path: '/energy',
      icon: Zap,
      color: 'from-amber-500 to-emerald-600',
      badge: 'Eco Smart',
      metric: '14.2 MWh/day'
    },
    {
      title: 'Emergency Operations & SOS',
      description: 'Central campus dispatch, rapid crisis response, and broadcast alarm routing.',
      path: '/emergency',
      icon: ShieldAlert,
      color: 'from-red-500 to-rose-600',
      badge: 'Level 1 Ready',
      metric: 'Instant Dispatch'
    },
    {
      title: 'Fleet & Transport Hub',
      description: 'Campus shuttle tracking, route scheduling, driver manifests, and transit alerts.',
      path: '/transport',
      icon: Bus,
      color: 'from-cyan-500 to-blue-600',
      badge: 'GPS Active',
      metric: '18 Shuttles'
    },
    {
      title: 'Hostel & Residence Life',
      description: 'Room allocation, maintenance work orders, warden logs, and mess food ratings.',
      path: '/hostel',
      icon: Home,
      color: 'from-violet-500 to-purple-600',
      badge: '98% Occupancy',
      metric: '6 Residence Halls'
    },
    {
      title: 'Notice Board & Broadcasts',
      description: 'Official administrative bulletins, circulars, and role-filtered push announcements.',
      path: '/noticeboard',
      icon: Bell,
      color: 'from-amber-500 to-orange-600',
      badge: 'Verified',
      metric: '8 New Circulars'
    },
    {
      title: 'Student Clubs & Activities',
      description: 'Student governance, collegiate societies, engineering hackathons, and point boards.',
      path: '/clubs',
      icon: Trophy,
      color: 'from-emerald-500 to-teal-600',
      badge: '34 Chapters',
      metric: '1,420 Members'
    },
    {
      title: 'Grievance & Help Desk',
      description: 'Automated ticket tracking, facility work orders, and SLA escalation matrix.',
      path: '/complaints',
      icon: LifeBuoy,
      color: 'from-slate-600 to-slate-800',
      badge: 'SLA 4.2h',
      metric: '92% Resolved'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <Building2 size={14} />
            <span>GENOVA Campus Operations Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Campus Infrastructure & Living Ecosystem
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Unified operational command for physical grounds, digital twins, residence life, transit logistics, and sustainable campus utilities.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Campus Grid: Operational</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Users size={14} className="text-blue-400" />
              <span>Active Population: 8,450+</span>
            </div>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid of Campus Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campusModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.title}
              onClick={() => navigate(mod.path)}
              className="group relative rounded-xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {mod.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-mono">
                  {mod.metric}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Launch <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
