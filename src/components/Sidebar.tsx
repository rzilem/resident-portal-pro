
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
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
  className
}: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    settings
  } = useCompanySettings();

  const isHoaPage = location.pathname === '/hoa/dashboard' || location.pathname === '/hoa/finances' || location.pathname === '/hoa/maintenance' || location.pathname === '/hoa/members' || location.pathname === '/hoa/events';

  if (isHoaPage) {
    return <HoaSidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} className={className} />;
  }

  const {
    openGroups,
    toggleGroup
  } = useSidebarState();
  const NAV_ITEMS = getNavItems(location.pathname);

  useEffect(() => {
    console.log("Current path:", location.pathname);
    console.log("Open groups:", openGroups);
    console.log("Navigation items:", NAV_ITEMS);
  }, [location.pathname, openGroups, NAV_ITEMS]);

  const handleLogoClick = () => {
    navigate('/settings');
    sessionStorage.setItem('open-display-settings', 'true');
    sessionStorage.setItem('open-branding-tab', 'true');
  };

  return <SidebarProvider defaultOpen={true}>
      <div className={cn("pb-12 border-r min-h-screen bg-background w-[260px]", className)}>
        <SidebarContent className="space-y-2 py-3">
          <SidebarHeader className="py-1 px-4 my-0">
            <div className="mb-2 px-2 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 group" onClick={handleLogoClick}>
              {settings.logoUrl ? (
                <>
                  <img 
                    src={settings.logoUrl} 
                    alt={settings.companyName || "Company Logo"} 
                    className="h-12 max-w-[200px] object-contain" 
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
                  <div className="text-lg font-semibold tracking-tight">
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
          <ScrollArea className="h-[calc(100vh-7rem)] px-2">
            <div className="space-y-1">
              {NAV_ITEMS.map((item, i) => {
                if (item === 'separator') {
                  return <NavSeparator key={`sep-${i}`} />;
                }

                const navItem = item as NavItem;
                console.log(`Rendering nav item: ${navItem.label}, isOpen: ${!!openGroups[navItem.label]}`);

                if (navItem.items && navItem.items.length > 0) {
                  return <CollapsibleNavItem key={navItem.label} item={navItem} isOpen={!!openGroups[navItem.label]} onToggle={() => toggleGroup(navItem.label)} />;
                }

                return <RegularNavItem key={navItem.label} item={navItem} />;
              })}
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
    </SidebarProvider>;
}

export default Sidebar;
