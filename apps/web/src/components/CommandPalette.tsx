import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Sun, UserCheck } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { DynamicIcon } from './DynamicIcon';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { currentRole, setRole, allowedModules, allRoles } = useRole();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close palette on escape key, listen for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Compute all command items
  const items = React.useMemo(() => {
    const list: {
      category: string;
      label: string;
      icon: React.ReactNode;
      action: () => void;
    }[] = [];

    // Modules
    allowedModules.forEach((mod) => {
      list.push({
        category: 'Navigation',
        label: `Go to ${mod.name}`,
        icon: <DynamicIcon name={mod.icon} size={16} />,
        action: () => {
          navigate(mod.path);
          onClose();
        },
      });
    });

    // Theme controls
    list.push({
      category: 'Preferences',
      label: 'Toggle Dark / Light Theme',
      icon: <Sun size={16} className="text-amber-500" />,
      action: () => {
        toggleTheme();
        onClose();
      },
    });

    // Role Switching
    allRoles.forEach((role) => {
      if (role !== currentRole) {
        list.push({
          category: 'Switch Role Portal',
          label: `Switch to ${role} Portal`,
          icon: <UserCheck size={16} className="text-blue-500" />,
          action: () => {
            setRole(role);
            navigate('/');
            onClose();
          },
        });
      }
    });

    // Filter by query
    if (!query) return list;
    return list.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allowedModules, currentRole, allRoles, navigate, toggleTheme, setRole, onClose]);

  // Handle arrow navigation
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, items, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs dark:bg-slate-950/60"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.25 }}
            ref={containerRef}
            className="w-full max-w-xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium-lg rounded-2xl overflow-hidden z-10 flex flex-col max-h-[50vh]"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4.5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="text-slate-400 shrink-0" size={18} />
              <input
                autoFocus
                placeholder="Type a command or search modules..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none text-main placeholder-slate-400 focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-y-auto p-2">
              {items.length > 0 ? (
                (() => {
                  let lastCategory = '';
                  return items.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const showCategory = item.category !== lastCategory;
                    lastCategory = item.category;

                    return (
                      <React.Fragment key={index}>
                        {showCategory && (
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-3 py-2 mt-2 first:mt-0">
                            {item.category}
                          </div>
                        )}
                        <button
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer
                            ${isSelected
                              ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-slate-700 dark:text-slate-300'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'}>
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          {isSelected && <ArrowRight size={14} className="text-blue-500" />}
                        </button>
                      </React.Fragment>
                    );
                  });
                })()
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No commands match your search query.
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="bg-slate-50/50 dark:bg-slate-800/20 px-4.5 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex gap-3">
                <span>↑↓ navigate</span>
                <span>enter select</span>
                <span>esc close</span>
              </div>
              <div className="font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Active Portal: {currentRole}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
