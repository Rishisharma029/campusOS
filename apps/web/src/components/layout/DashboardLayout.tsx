import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Drawer } from '../ui/Drawer';
import { CommandPalette } from '../CommandPalette';
import { useDatabase } from '../../context/DatabaseContext';
import { useRealtime } from '../../context/RealtimeContext';
import { Check, ShieldAlert, Bot, X, Wifi } from 'lucide-react';
import { AIAssistantModal } from '../AIAssistantModal';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [pwaBannerVisible, setPwaBannerVisible] = useState(true);

  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDatabase();
  const { emergencyAlerts } = useRealtime();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveSOS = emergencyAlerts.some(a => a.status === 'ACTIVE');

  return (
    <div className="min-h-screen bg-app text-main flex flex-col relative overflow-x-hidden">
      {/* Ambient Aurora Gradient Background */}
      <div className="aurora-bg" />

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* PWA Offline / Install Banner */}
      {pwaBannerVisible && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white text-xs px-4 py-2 flex items-center justify-between z-40 border-b border-blue-500/30">
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-emerald-400 animate-pulse" />
            <span><strong>CampusOS PWA Mode:</strong> App ready for offline use. Simulated push notifications & biometric login active.</span>
          </div>
          <button onClick={() => setPwaBannerVisible(false)} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Active SOS Emergency Banner Alert */}
      {hasActiveSOS && (
        <div
          onClick={() => navigate('/emergency')}
          className="bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-2 font-bold flex items-center justify-between z-40 cursor-pointer animate-pulse shadow-lg"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>CRITICAL SOS ALERT ACTIVE: Emergency Dispatch Response in Progress. Click to open Emergency Operations Desk.</span>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex items-stretch">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 transition-all duration-300">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Voice Assistant Button */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all border border-white/20 flex items-center gap-2 group"
      >
        <Bot size={24} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">
          Ask CampusOS AI
        </span>
      </button>

      {/* AI Assistant Modal */}
      <AIAssistantModal isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Campus Notifications"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400">All alerts & announcements</span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Check size={14} /> Mark all read
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  n.read
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-slate-800/90 border-blue-500/40 text-slate-100 font-semibold shadow-sm'
                }`}
              >
                <h4 className="font-bold text-xs">{n.title}</h4>
                <p className="text-[11px] opacity-80 mt-1">{n.message}</p>
                <span className="block text-[10px] text-right text-slate-500 mt-1">{n.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      {/* Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
