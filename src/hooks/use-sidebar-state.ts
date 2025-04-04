
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type SidebarGroupState = Record<string, boolean>;

export function useSidebarState(initialGroups: SidebarGroupState = {}) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<SidebarGroupState>(initialGroups);

  useEffect(() => {
    // Debug logging to help identify issues
    console.log("Current path:", location.pathname);
    console.log("Current open groups:", openGroups);
    
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
      
      // HOA routes
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
      '/vendors': 'Operations',
      
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
      '/resale/queue': 'Resale Management',
      
      // System routes
      '/settings': 'System',
      '/settings/associations': 'System',
      '/settings/permissions': 'System',
      '/integrations': 'System',
      '/email-workflows': 'System',
      '/system-uploads': 'System',
    };

    // Initialize the new state object with the current state to avoid losing open groups
    const newOpenGroups = { ...openGroups };
    
    // Match current path with exact routes
    if (pathToGroupMap[location.pathname]) {
      newOpenGroups[pathToGroupMap[location.pathname]] = true;
      console.log(`Setting group ${pathToGroupMap[location.pathname]} open for path ${location.pathname}`);
    } else {
      // If no exact match, check for parent path matches
      const pathParts = location.pathname.split('/').filter(Boolean);
      
      // Try matching with increasingly shorter paths
      for (let i = pathParts.length; i > 0; i--) {
        const testPath = '/' + pathParts.slice(0, i).join('/');
        if (pathToGroupMap[testPath]) {
          newOpenGroups[pathToGroupMap[testPath]] = true;
          console.log(`Setting group ${pathToGroupMap[testPath]} open for partial path ${testPath}`);
          break;
        }
      }
    }
    
    // Only update state if there are actual changes
    if (JSON.stringify(newOpenGroups) !== JSON.stringify(openGroups)) {
      console.log("Updating open groups:", newOpenGroups);
      setOpenGroups(newOpenGroups);
    }
  }, [location.pathname]);  // Remove openGroups from dependency array to prevent infinite updates

  // Function to toggle a specific group
  const toggleGroup = (group: string) => {
    console.log(`Toggling group: ${group}, current state:`, openGroups[group]);
    setOpenGroups(prev => {
      const newState = {
        ...prev,
        [group]: !prev[group]
      };
      console.log(`New state for ${group}:`, newState[group]);
      return newState;
    });
  };

  return {
    openGroups,
    setOpenGroups,
    toggleGroup
  };
}
