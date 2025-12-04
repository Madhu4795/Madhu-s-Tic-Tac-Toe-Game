import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '', position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      role="tooltip"
    >
      {children}
      <div 
        className={`
          absolute left-1/2 -translate-x-1/2 px-3 py-1.5 
          bg-slate-800 text-slate-200 text-xs font-medium 
          rounded-lg border border-slate-700 shadow-xl 
          whitespace-nowrap z-50 pointer-events-none
          transition-all duration-200 transform
          ${position === 'top' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'}
          ${isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : `opacity-0 scale-95 ${position === 'top' ? 'translate-y-1' : '-translate-y-1'}`
          }
        `}
      >
        {content}
        {/* Arrow */}
        <div 
            className={`
                absolute left-1/2 -translate-x-1/2 border-4 border-transparent
                ${position === 'top' ? 'top-full border-t-slate-800' : 'bottom-full border-b-slate-800'}
            `}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;