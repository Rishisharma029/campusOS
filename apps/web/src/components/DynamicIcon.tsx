import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 18, className = '' }) => {
  // Resolve icon component dynamically
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon
    return <Icons.HelpCircle size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};
