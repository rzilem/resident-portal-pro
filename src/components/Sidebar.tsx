
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
import { useState, useEffect } from "react";
import HoaSidebar from "./HoaSidebar";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { settings } = useCompanySettings();
  
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
  
  // Initialize sidebar with empty state and let the hook handle opening the correct sections
  const { openGroups, toggleGroup } = useSidebarState();

  const NAV_ITEMS = getNavItems(location.pathname);

  // Debug logging to help identify issues
  useEffect(() => {
    console.log("Current path:", location.pathname);
    console.log("Open groups:", openGroups);
  }, [location.pathname, openGroups]);

  // Handler to navigate to logo settings
  const handleLogoClick = () => {
    navigate('/settings');
    // We'll add a session storage flag to open the display tab and branding section automatically
    sessionStorage.setItem('open-display-settings', 'true');
    sessionStorage.setItem('open-branding-tab', 'true');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("pb-12 border-r min-h-screen bg-background", className)}>
        <SidebarContent className="space-y-4 py-4">
          <SidebarHeader className="px-4 py-2">
            <div 
              className="mb-2 px-2 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 group"
              onClick={handleLogoClick}
            >
              {settings.logoUrl ? (
                <>
                  <img 
                    src={settings.logoUrl} 
                    alt={settings.companyName || "Company Logo"} 
                    className="h-10 max-w-full object-contain"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Settings className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit logo in settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : (
                <>
                  <div className="text-xl font-semibold tracking-tight">
                    {settings.companyName || "HOA Management"}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Settings className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add logo in settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
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
                      isOpen={!!openGroups[navItem.label]}
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
