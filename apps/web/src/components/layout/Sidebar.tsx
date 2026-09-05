import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, LogOut, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { DynamicIcon } from '../DynamicIcon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { allowedModules, currentRole } = useRole();
  const { logout } = useAuth();

  const coreModules = allowedModules.filter((m) => m.section === 'Core');
  const careerModules = allowedModules.filter((m) => m.section === 'CAREER & INDUSTRY');
  const innovationModules = allowedModules.filter((m) => m.section === 'GENOVA INNOVATION');

  const renderNavLink = (mod: typeof allowedModules[0], highlightDotColor?: string) => (
    <NavLink
      key={mod.name}
      to={mod.path}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold shadow-xs ring-1 ring-blue-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span className={`transition-colors shrink-0 ${
            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
          }`}>
            <DynamicIcon name={mod.icon} size={16} />
          </span>
          <span className={`truncate transition-opacity duration-200 flex-1 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            {mod.name}
          </span>
          {highlightDotColor && isOpen && (
            <span className={`w-1.5 h-1.5 rounded-full ${highlightDotColor} shrink-0 opacity-80 group-hover:opacity-100`} />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <aside
      className={`fixed md:sticky top-[60px] left-0 h-[calc(100vh-60px)] z-30 bg-surface dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-premium
        ${isOpen ? 'w-64' : 'w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Top Section: Brand Header and Links */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sidebar Header showing GENOVA brand info */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-hidden shrink-0">
          <div className={`flex flex-col min-w-0 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-500 font-black text-xs">◆</span>
              <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white font-display">
                GENOVA
              </span>
              <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-medium">
              Engineering Next Gen • {currentRole}
            </span>
          </div>

          <button
            onClick={onToggle}
            aria-label={isOpen ? "Collapse navigation sidebar" : "Expand navigation sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden md:block cursor-pointer shrink-0"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Scrollable Navigation links strictly matching requested layout */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* 1. Core Platform */}
          <div className="space-y-1">
            {coreModules.map((mod) => renderNavLink(mod))}
          </div>

          {/* 2. CAREER & INDUSTRY */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {isOpen && (
              <div className="px-2 pt-1 pb-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>CAREER & INDUSTRY</span>
              </div>
            )}
            {careerModules.map((mod) => renderNavLink(mod))}
          </div>

          {/* 3. GENOVA INNOVATION */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {isOpen && (
              <div className="px-2 pt-1 pb-1 text-[9px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>GENOVA INNOVATION</span>
              </div>
            )}
            {innovationModules.map((mod) =>
              renderNavLink(
                mod,
                mod.name.includes('Land') ? 'bg-emerald-400' : 'bg-cyan-400'
              )
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="p-3 border-t border-slate-150 dark:border-slate-850 space-y-1 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer
            ${isActive
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
            }
          `}
        >
          <SettingsIcon size={16} className="shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          <span className={`truncate transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            Settings & Vitals
          </span>
        </NavLink>

        <button
          type="button"
          aria-label="Logout from CampusOS"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer overflow-hidden"
        >
          <LogOut size={16} className="shrink-0" />
          <span className={`truncate transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            Logout Session
          </span>
        </button>
      </div>
    </aside>
  );
};
