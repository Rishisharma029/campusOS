import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Drawer } from '../ui/Drawer';
import { CommandPalette } from '../CommandPalette';
import { useDatabase } from '../../context/DatabaseContext';
import { DynamicIcon } from '../DynamicIcon';
import { Check, MailOpen, AlertTriangle, CloudOff, RefreshCw, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { AIChatbot } from './AIChatbot';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDatabase();

  // Listen for Ctrl+K global shortcut
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

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'fee':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-450';
      case 'exam':
        return 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-450';
      case 'placement':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-450';
      case 'academic':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-450';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'fee':
        return 'CreditCard';
      case 'exam':
        return 'FileSpreadsheet';
      case 'placement':
        return 'Briefcase';
      case 'academic':
        return 'GraduationCap';
      default:
        return 'Bell';
    }
  };

  const handleNotificationClick = (notif: any) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }
    
    // Close drawer
    setIsNotificationsOpen(false);

    // Route dynamically based on category
    switch (notif.category) {
      case 'fee':
        navigate('/fees');
        break;
      case 'exam':
        navigate('/examinations');
        break;
      case 'placement':
        navigate('/placement');
        break;
      case 'academic':
        navigate('/courses');
        break;
      default:
        break;
    }
  };

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isOffline, toggleOffline, isSessionWarningOpen, extendSession, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-red-600 text-white py-1.5 px-4 text-xs font-semibold flex items-center justify-between animate-fade-in z-50">
          <span className="flex items-center gap-2">
            <CloudOff size={14} className="animate-pulse" />
            Workspace running in simulated PWA Offline Mode. Running from local database state.
          </span>
          <button onClick={toggleOffline} className="underline text-[10px] hover:text-red-100 focus:outline-none">
            Reconnect Sync
          </button>
        </div>
      )}

      {/* Inactivity lock popup */}
      {isSessionWarningOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-main rounded-2xl p-6 max-w-md w-full mx-4 shadow-premium-lg animate-scale-in text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto dark:bg-amber-900/20 dark:text-amber-455">
              <AlertTriangle size={24} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">Session Expiring Soon</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have been inactive for a while. For security reasons, your active CampusOS portal session will lock soon.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button variant="outline" className="flex-1 text-xs" onClick={logout}>
                <LogOut size={13} className="mr-1.5" /> Log Out
              </Button>
              <Button className="flex-1 text-xs" onClick={extendSession}>
                <RefreshCw size={13} className="mr-1.5" /> Keep Active
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Content Area */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto max-w-full">
          <Outlet />
        </main>
      </div>

      {/* Floating AI chatbot trigger */}
      <button
        onClick={() => setIsChatbotOpen((prev) => !prev)}
        aria-label="Open AI assistant"
        className="fixed bottom-4 right-4 z-40 w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-premium-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 focus:outline-none cursor-pointer"
      >
        <MessageSquare size={18} />
      </button>

      {/* AIChatbot Drawer */}
      <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {/* Ctrl+K Search Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="In-App Notifications"
      >
        <div className="flex flex-col gap-4 h-full">
          {notifications.length > 0 && (
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs text-slate-500 font-medium">
                {notifications.filter((n) => !n.read).length} Unread notifications
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] h-7 px-2"
                onClick={markAllNotificationsRead}
              >
                <MailOpen size={12} className="mr-1.5" /> Mark all read
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[75vh] pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 border rounded-xl flex gap-3 items-start transition-all relative cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-800/20
                    ${notif.read
                      ? 'bg-surface border-slate-200 dark:border-slate-800/80'
                      : 'bg-blue-50/20 border-blue-200 dark:border-blue-900/30'
                    }
                  `}
                >
                  {/* Unread dot indicator */}
                  {!notif.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-600 rounded-full" />
                  )}

                  {/* Icon Circle */}
                  <div className={`p-2 rounded-lg shrink-0 ${getCategoryColor(notif.category)}`}>
                    <DynamicIcon name={getCategoryIcon(notif.category)} size={16} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal text-balance">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 block">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>

                    {/* Mark read button */}
                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationRead(notif.id);
                        }}
                        className="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={10} /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No notifications to display.
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};
