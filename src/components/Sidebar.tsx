import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import NavigationMenu from './layout/NavigationMenu';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useCompanySettings } from '@/hooks/use-company-settings';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { settings } = useCompanySettings();
  
  return (
    <div
      className={cn(
        'h-screen fixed top-0 left-0 z-20 bg-card border-r border-border transition-all duration-300',
        isOpen ? 'w-64' : 'w-0 -translate-x-full sm:translate-x-0 sm:w-16'
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          'h-16 flex items-center border-b border-border px-4',
          isOpen ? 'justify-between' : 'justify-center'
        )}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <span className="text-lg font-semibold">{settings.companyName || "ResidentPro"}</span>
                )}
              </div>
              <button
                onClick={toggleSidebar}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isOpen ? (
            <NavigationMenu />
          ) : (
            <div className="py-4">
              {/* Collapsed sidebar icons only version */}
              {/* We could implement icons-only navigation here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
