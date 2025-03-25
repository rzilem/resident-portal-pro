
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type SidebarGroupState = Record<string, boolean>;

export function useSidebarState(initialGroups: SidebarGroupState = {}) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<SidebarGroupState>(initialGroups);

  useEffect(() => {
    // Auto-open groups based on current path
    const newOpenGroups = { ...openGroups };
    
    if (location.pathname.startsWith('/accounting')) {
      newOpenGroups["Accounting"] = true;
    }
    
    if (location.pathname.startsWith('/communications')) {
      newOpenGroups["Communications"] = true;
    }
    
    if (location.pathname.startsWith('/database')) {
      newOpenGroups["Records"] = true;
    }
    
    if (location.pathname.startsWith('/documents')) {
      newOpenGroups["Documents"] = true;
    }
    
    if (location.pathname.startsWith('/settings')) {
      newOpenGroups["Settings"] = true;
    }
    
    if (location.pathname.startsWith('/calendar') || location.pathname === '/settings/calendar') {
      newOpenGroups["Calendar"] = true;
    }
    
    setOpenGroups(newOpenGroups);
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
