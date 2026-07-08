import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { DynamicIcon } from '../DynamicIcon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { allowedModules, currentRole } = useRole();

  return (
    <aside
      className={`fixed md:sticky top-[60px] left-0 h-[calc(100vh-60px)] z-30 bg-surface dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-premium
        ${isOpen ? 'w-64' : 'w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Top Section: Role Header and Links */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sidebar Header showing role */}
        <div className={`p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2 overflow-hidden shrink-0`}>
          <div className={`flex flex-col min-w-0 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {currentRole}
            </span>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden md:block cursor-pointer shrink-0"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Scrollable Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {allowedModules.map((mod) => (
            <NavLink
              key={mod.name}
              to={mod.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer
                ${isActive
                  ? 'bg-blue-50 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 font-semibold shadow-premium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/20 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-colors shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350'}`}>
                    <DynamicIcon name={mod.icon} size={16} />
                  </span>
                  <span className={`truncate transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                    {mod.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Footer Info */}
      <div className="p-3 border-t border-slate-150 dark:border-slate-850 shrink-0">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer overflow-hidden`}
        >
          <LogOut size={16} className="text-slate-400 shrink-0" />
          <span className={`truncate transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            Logout Session
          </span>
        </div>
      </div>
    </aside>
  );
};
