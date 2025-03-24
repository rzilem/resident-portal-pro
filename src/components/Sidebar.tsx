
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  ChevronDown, 
  Bell, 
  Database,
  MessageCircle,
  Zap
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: NavItem[];
};

export function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Main navigation items
  const NAV_ITEMS: (NavItem | 'separator')[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      isActive: location.pathname === '/dashboard',
    },
    {
      label: "Properties",
      href: "/properties",
      icon: <Building className="h-5 w-5" />,
      isActive: location.pathname === '/properties',
    },
    {
      label: "Residents",
      href: "/residents",
      icon: <Users className="h-5 w-5" />,
      isActive: location.pathname.startsWith('/residents'),
    },
    'separator',
    {
      label: "Accounting",
      href: "#",
      icon: <FileText className="h-5 w-5" />,
      isActive: location.pathname.startsWith('/accounting'),
      items: [
        {
          label: "Dashboard",
          href: "/accounting",
          isActive: location.pathname === '/accounting',
        },
        {
          label: "Transactions",
          href: "/accounting/transactions",
          isActive: location.pathname === '/accounting/transactions',
        },
        {
          label: "Reports",
          href: "/accounting/reports",
          isActive: location.pathname === '/accounting/reports',
        },
        {
          label: "Payments",
          href: "/accounting/payments",
          isActive: location.pathname === '/accounting/payments',
        },
      ],
    },
    {
      label: "Communications",
      href: "#",
      icon: <Bell className="h-5 w-5" />,
      isActive: location.pathname.startsWith('/communications'),
      items: [
        {
          label: "Announcements",
          href: "/communications/announcements",
          isActive: location.pathname === '/communications/announcements',
        },
        {
          label: "Messages",
          href: "/communications/messages",
          isActive: location.pathname === '/communications/messages',
        },
        {
          label: "Email Templates",
          href: "/communications/email-templates",
          isActive: location.pathname === '/communications/email-templates',
        },
      ],
    },
    {
      label: "Database",
      href: "#",
      icon: <Database className="h-5 w-5" />,
      isActive: location.pathname.startsWith('/database'),
      items: [
        {
          label: "Records",
          href: "/database/records",
          isActive: location.pathname === '/database/records',
        },
        {
          label: "Templates",
          href: "/database/templates",
          isActive: location.pathname === '/database/templates',
        },
      ],
    },
    {
      label: "Workflows",
      href: "/workflows",
      icon: <Zap className="h-5 w-5" />,
      isActive: location.pathname === '/workflows',
    },
    {
      label: "Chatbot",
      href: "/chatbot",
      icon: <MessageCircle className="h-5 w-5" />,
      isActive: location.pathname === '/chatbot',
    },
    'separator',
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: location.pathname === '/settings',
    },
  ];

  return (
    <div className={cn("pb-12 border-r min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            HOA Management
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)] px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map((item, i) => {
              // Render a separator
              if (item === 'separator') {
                return <div key={i} className="my-2 h-px bg-muted" />;
              }

              // Render a nav group with dropdown
              if (item.items && item.items.length > 0) {
                return (
                  <Collapsible
                    key={item.label}
                    open={openGroups[item.label]}
                    onOpenChange={() => toggleGroup(item.label)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={item.isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-between font-normal",
                          item.isActive ? "font-medium" : "font-normal"
                        )}
                      >
                        <span className="flex items-center">
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openGroups[item.label] ? "rotate-180" : ""
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 pt-1">
                      {item.items.map((subItem) => (
                        <Button
                          key={subItem.label}
                          variant={subItem.isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            subItem.isActive ? "font-medium" : "font-normal"
                          )}
                          onClick={() => navigate(subItem.href)}
                        >
                          {subItem.label}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              // Render a regular nav item
              return (
                <Button
                  key={item.label}
                  variant={item.isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.isActive ? "font-medium" : "font-normal"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
