import React from 'react';
import { Bell, Command, Menu, Moon, Search, Sun, Compass, Leaf, Wifi, WifiOff } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useTheme } from '../../context/ThemeContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenNotifications,
  onOpenSearch,
}) => {
  const { currentRole, setRole, allRoles } = useRole();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useDatabase();
  const { isOffline, toggleOffline } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200 dark:border-slate-800/80 px-4 py-2.5 flex items-center justify-between shadow-premium">
      {/* Left Area: Hamburger and Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar navigation"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors md:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
            Ω
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100 font-display hidden sm:inline-block">
            ACADEMIA ERP
          </span>
        </div>
      </div>

      {/* Middle Area: Global Search Button */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between text-xs px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-850/50 dark:hover:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search size={14} />
            <span>Search modules (Ctrl+K)...</span>
          </div>
          <div className="flex items-center gap-0.5 bg-slate-250 dark:bg-slate-800 border border-slate-250 dark:border-slate-750 px-1.5 py-0.2 rounded text-[9px] font-mono text-slate-400">
            <Command size={9} />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Area: Controls and Profile */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          aria-label="Open global search"
          className="p-2.0 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 md:hidden cursor-pointer"
        >
          <Search size={18} />
        </button>

        {/* Portal Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden lg:inline-block">
            Portal Role:
          </span>
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value as any)}
            className="text-xs font-semibold px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-premium"
          >
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Offline Simulator Switch */}
        <button
          onClick={toggleOffline}
          aria-label={isOffline ? "Connect Network Sync" : "Disconnect simulated network"}
          title={isOffline ? "Connect Network Sync" : "Disconnect simulated network"}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isOffline ? <WifiOff size={18} className="text-red-500" /> : <Wifi size={18} className="text-slate-400" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch Theme (Current: ${theme})`}
          title={`Switch Theme (Current: ${theme})`}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Moon size={18} className="text-blue-400" />
          ) : theme === 'ocean' ? (
            <Compass size={18} className="text-teal-500" />
          ) : theme === 'forest' ? (
            <Leaf size={18} className="text-emerald-500" />
          ) : (
            <Sun size={18} className="text-amber-500" />
          )}
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          aria-label={`Open notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          className="p-2.0 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative cursor-pointer"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-surface">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
          <Avatar name={currentRole} size="sm" />
        </div>
      </div>
    </header>
  );
};
