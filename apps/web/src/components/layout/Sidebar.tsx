import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { DynamicIcon } from '../DynamicIcon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { allowedModules, currentRole } = useRole();
  const { logout } = useAuth();

  const layerOrder = [
    'Layer 3: Autonomous Agents',
    'Layer 2: Executive Intelligence',
    'Layer 1: Daily Operations',
  ] as const;

  const groupedModules = layerOrder.reduce((acc, layerName) => {
    const mods = allowedModules.filter((m) => m.layer === layerName);
    if (mods.length > 0) {
      acc.push({ layerName, modules: mods });
    }
    return acc;
  }, [] as { layerName: string; modules: typeof allowedModules }[]);

  // Catch any unlayered modules
  const unlayeredMods = allowedModules.filter((m) => !m.layer);
  if (unlayeredMods.length > 0) {
    groupedModules.push({ layerName: 'Layer 1: Daily Operations', modules: unlayeredMods });
  }

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
              CampusOS Control Panel
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

        {/* Scrollable Navigation links grouped by 3 Architecture Layers */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {groupedModules.map((group) => (
            <div key={group.layerName} className="space-y-1">
              {isOpen && (
                <div className="px-2 pt-2 pb-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    group.layerName.includes('Layer 3') ? 'bg-purple-400' : group.layerName.includes('Layer 2') ? 'bg-blue-400' : 'bg-emerald-400'
                  }`} />
                  {group.layerName}
                </div>
              )}

              {group.modules.map((mod) => (
                <NavLink
                  key={mod.name}
                  to={mod.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer
                    ${isActive
                      ? 'bg-blue-50 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/20 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`transition-colors shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350'}`}>
                        <DynamicIcon name={mod.icon} size={15} />
                      </span>
                      <span className={`truncate transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                        {mod.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Footer Info */}
      <div className="p-3 border-t border-slate-150 dark:border-slate-850 shrink-0">
        <button
          type="button"
          aria-label="Logout from CampusOS"
          onClick={() => logout()}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer overflow-hidden`}
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
