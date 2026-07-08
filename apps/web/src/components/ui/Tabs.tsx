import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (val: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '', onValueChange }) => {
  const [activeTab, setActiveTabState] = useState(defaultValue);

  const setActiveTab = (val: string) => {
    setActiveTabState(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-slate-200 dark:border-slate-800 gap-6 w-full ${className}`}>
      {children}
    </div>
  );
};

interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={`py-2 px-1 text-sm font-medium transition-all border-b-2 -mb-[2px] cursor-pointer
        ${isActive
          ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabContent must be used within Tabs');

  if (context.activeTab !== value) return null;

  return <div className={`pt-4 animate-fade-in ${className}`}>{children}</div>;
};
