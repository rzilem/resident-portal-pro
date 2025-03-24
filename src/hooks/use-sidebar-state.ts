
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type SidebarGroupState = Record<string, boolean>;

export function useSidebarState(initialGroups: SidebarGroupState = {}) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<SidebarGroupState>(initialGroups);

  useEffect(() => {
    // Auto-open groups based on current path
    const newOpenGroups = { ...openGroups };
    
    if (location.pathname.includes('/accounting')) {
      newOpenGroups["Accounting"] = true;
    }
    
    if (location.pathname.includes('/communications')) {
      newOpenGroups["Communications"] = true;
    }
    
    if (location.pathname.includes('/database')) {
      newOpenGroups["Database"] = true;
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
