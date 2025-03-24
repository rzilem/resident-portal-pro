
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from "@/components/ui/sidebar";
import { CollapsibleNavItem } from "./sidebar/CollapsibleNavItem";
import { RegularNavItem } from "./sidebar/RegularNavItem";
import { NavSeparator } from "./sidebar/NavSeparator";
import { getNavItems, NavItem } from "@/data/navigation";

export function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Accounting": true,
    "Communications": false,
    "Database": false
  });

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

  const NAV_ITEMS = getNavItems(location.pathname);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("pb-12 border-r min-h-screen", className)}>
        <SidebarContent className="space-y-4 py-4">
          <SidebarHeader className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
              HOA Management
            </h2>
          </SidebarHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] px-3">
            <div className="space-y-1">
              {NAV_ITEMS.map((item, i) => {
                // Render a separator
                if (item === 'separator') {
                  return <NavSeparator key={`sep-${i}`} />;
                }

                // Render a nav group with dropdown
                if (item.items && item.items.length > 0) {
                  return (
                    <CollapsibleNavItem
                      key={item.label}
                      item={item}
                      isOpen={openGroups[item.label]}
                      onToggle={() => toggleGroup(item.label)}
                    />
                  );
                }

                // Render a regular nav item
                return (
                  <RegularNavItem key={item.label} item={item} />
                );
              })}
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
}
