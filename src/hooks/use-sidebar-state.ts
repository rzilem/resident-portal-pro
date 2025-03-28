
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type SidebarGroupState = Record<string, boolean>;

export function useSidebarState(initialGroups: SidebarGroupState = {}) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<SidebarGroupState>(initialGroups);

  useEffect(() => {
    // More comprehensive route-to-group mapping with nested paths
    const pathToGroupMap: Record<string, string> = {
      // Dashboard routes
      '/dashboard': 'Dashboard',
      '/simple-dashboard': 'Dashboard',
      
      // Community Management routes
      '/properties': 'Community Management',
      '/residents': 'Community Management',
      '/compliance': 'Community Management',
      '/community-hub': 'Community Management',
      '/hoa': 'Community Management',
      '/hoa/dashboard': 'Community Management',
      '/hoa/finances': 'Community Management',
      '/hoa/maintenance': 'Community Management',
      '/hoa/members': 'Community Management',
      '/hoa/events': 'Community Management',
      
      // Accounting routes
      '/accounting': 'Accounting',
      '/accounting/dashboard': 'Accounting',
      '/accounting/invoice-queue': 'Accounting',
      '/accounting/transactions': 'Accounting',
      '/accounting/payments': 'Accounting',
      '/accounting/journal-entries': 'Accounting',
      '/accounting/gl-accounts': 'Accounting',
      '/accounting/reports': 'Accounting',
      
      // Operations routes
      '/calendar': 'Operations',
      '/communications': 'Operations',
      '/communications/messaging': 'Operations',
      '/communications/announcements': 'Operations',
      '/workflows': 'Operations',
      '/print-queue': 'Operations',
      
      // Records & Reports routes
      '/database': 'Records & Reports',
      '/database/records': 'Records & Reports',
      '/documents': 'Records & Reports',
      '/documents/association': 'Records & Reports',
      '/reports': 'Records & Reports',
      
      // Resale Management routes
      '/resale': 'Resale Management',
      '/resale/certificate': 'Resale Management',
      '/resale/questionnaire': 'Resale Management',
      '/resale/inspection': 'Resale Management',
      '/resale/statements': 'Resale Management',
      '/resale/trec-forms': 'Resale Management',
      
      // System routes
      '/settings': 'System',
      '/settings/associations': 'System',
      '/settings/permissions': 'System',
      '/integrations': 'System',
      '/email-workflows': 'System',
      '/system-uploads': 'System',
    };

    // Initialize an empty groups object
    const newOpenGroups: SidebarGroupState = {};
    
    // Match current path with exact routes
    if (pathToGroupMap[location.pathname]) {
      newOpenGroups[pathToGroupMap[location.pathname]] = true;
    } else {
      // If no exact match, check for parent path matches
      const pathParts = location.pathname.split('/').filter(Boolean);
      
      // Try matching with increasingly shorter paths
      for (let i = pathParts.length; i > 0; i--) {
        const testPath = '/' + pathParts.slice(0, i).join('/');
        if (pathToGroupMap[testPath]) {
          newOpenGroups[pathToGroupMap[testPath]] = true;
          break;
        }
      }
    }

    // Update sidebar group state
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
