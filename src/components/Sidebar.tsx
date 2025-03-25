
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from "@/components/ui/sidebar";
import { CollapsibleNavItem } from "./sidebar/CollapsibleNavItem";
import { RegularNavItem } from "./sidebar/RegularNavItem";
import { NavSeparator } from "./sidebar/NavSeparator";
import { getNavItems, NavItem } from "@/data/navigation";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useState } from "react";
import HoaSidebar from "./HoaSidebar";

export function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check if we're on one of the HOA management pages
  const isHoaPage = 
    location.pathname === '/hoa/dashboard' || 
    location.pathname === '/hoa/finances' || 
    location.pathname === '/hoa/maintenance' || 
    location.pathname === '/hoa/members' || 
    location.pathname === '/hoa/events';

  // Use HOA sidebar for HOA routes
  if (isHoaPage) {
    return <HoaSidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} className={className} />;
  }
  
  // Initialize sidebar groups with relevant sections expanded
  const { openGroups, toggleGroup } = useSidebarState({
    "Community Management": location.pathname.startsWith('/properties') || 
                   location.pathname.startsWith('/residents') ||
                   location.pathname.startsWith('/community-hub'),
    "Operations": location.pathname.startsWith('/calendar') ||
              location.pathname.startsWith('/accounting') ||
              location.pathname.startsWith('/communications') ||
              location.pathname.startsWith('/workflows'),
    "Records & Reports": location.pathname.startsWith('/database') ||
                  location.pathname.startsWith('/documents') ||
                  location.pathname.startsWith('/reports'),
    "System": location.pathname.startsWith('/settings') || 
           location.pathname.startsWith('/integrations')
  });

  const NAV_ITEMS = getNavItems(location.pathname);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("pb-12 border-r min-h-screen bg-background", className)}>
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

                // Now we know item is a NavItem, not a string
                const navItem = item as NavItem;
                
                // Render a nav group with dropdown
                if (navItem.items && navItem.items.length > 0) {
                  return (
                    <CollapsibleNavItem
                      key={navItem.label}
                      item={navItem}
                      isOpen={openGroups[navItem.label]}
                      onToggle={() => toggleGroup(navItem.label)}
                    />
                  );
                }

                // Render a regular nav item
                return (
                  <RegularNavItem key={navItem.label} item={navItem} />
                );
              })}
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
}
