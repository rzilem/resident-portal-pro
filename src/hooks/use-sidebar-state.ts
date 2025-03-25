
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type SidebarGroupState = Record<string, boolean>;

export function useSidebarState(initialGroups: SidebarGroupState = {}) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<SidebarGroupState>(initialGroups);

  useEffect(() => {
    // Auto-open groups based on current path with more consistent logic
    const newOpenGroups: SidebarGroupState = {};
    
    const pathToGroupMap: Record<string, string> = {
      '/accounting/dashboard': 'Operations',
      '/accounting': 'Operations',
      '/calendar': 'Operations',
      '/communications': 'Operations',
      '/workflows': 'Operations',
      '/database': 'Records & Reports',
      '/documents': 'Records & Reports',
      '/reports': 'Records & Reports',
      '/settings': 'System',
      '/integrations': 'System'
    };

    // Check for exact matches and starts-with matches
    Object.entries(pathToGroupMap).forEach(([path, group]) => {
      if (location.pathname === path || location.pathname.startsWith(path)) {
        newOpenGroups[group] = true;
      }
    });

    // Merge with existing state to preserve user interactions
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
