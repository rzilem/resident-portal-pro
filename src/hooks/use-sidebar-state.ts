
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type SidebarGroupState = Record<string, boolean>;

export function useSidebarState(initialGroups: SidebarGroupState = {}) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<SidebarGroupState>(initialGroups);

  useEffect(() => {
    // More precise route-to-group mapping
    const pathToGroupMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/simple-dashboard': 'Dashboard',
      '/calendar': 'Operations',
      '/communications': 'Operations',
      '/compliance': 'Operations',
      '/workflows': 'Operations',
      '/print-queue': 'Operations',
      '/accounting': 'Accounting',
      '/accounting/dashboard': 'Accounting',
      '/accounting/invoice-queue': 'Accounting',
      '/accounting/transactions': 'Accounting',
      '/accounting/payments': 'Accounting',
      '/accounting/journal-entries': 'Accounting',
      '/accounting/gl-accounts': 'Accounting',
      '/accounting/reports': 'Accounting',
      '/database': 'Records & Reports',
      '/database/records': 'Records & Reports',
      '/documents': 'Records & Reports',
      '/documents/association': 'Records & Reports',
      '/reports': 'Records & Reports',
      '/settings': 'System',
      '/settings/associations': 'System',
      '/settings/permissions': 'System',
      '/integrations': 'System',
      '/properties': 'Community Management',
      '/residents': 'Community Management',
      '/community-hub': 'Community Management',
      '/email-workflows': 'System',
      '/system-uploads': 'System',
      '/resale': 'Resale Management',
      '/resale/certificate': 'Resale Management',
      '/resale/questionnaire': 'Resale Management',
      '/resale/inspection': 'Resale Management',
      '/resale/statements': 'Resale Management',
      '/resale/trec-forms': 'Resale Management',
      '/hoa': 'Community Management',
      '/hoa/dashboard': 'Community Management',
      '/hoa/finances': 'Community Management',
      '/hoa/maintenance': 'Community Management',
      '/hoa/members': 'Community Management',
      '/hoa/events': 'Community Management'
    };

    // Check current path against map
    const newOpenGroups: SidebarGroupState = {};
    
    // Determine which section should be open based on current path
    Object.entries(pathToGroupMap).forEach(([path, group]) => {
      if (location.pathname === path || location.pathname.startsWith(path + '/')) {
        newOpenGroups[group] = true;
      }
    });

    // Update state
    setOpenGroups(prev => ({
      ...prev,
      ...newOpenGroups
    }));
  }, [location.pathname]);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return {
    openGroups,
    setOpenGroups,
    toggleGroup
  };
}
