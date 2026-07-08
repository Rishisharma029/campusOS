import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenId,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const handleToggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="flex flex-col border border-main rounded-xl overflow-hidden divide-y divide-main bg-surface">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        
        return (
          <div key={item.id} className="flex flex-col">
            <button
              onClick={() => handleToggle(item.id)}
              className="flex items-center justify-between p-4 text-left w-full hover:bg-surface-hover transition-colors focus:outline-none"
            >
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-205 font-display">
                {item.title}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Collapsible Content */}
            <div
              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[500px] border-t border-main' : 'max-h-0'
              }`}
            >
              <div className="p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
