
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { NavItem } from "@/data/navigation";
import React from 'react';

interface CollapsibleNavItemProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleNavItem({ item, isOpen, onToggle }: CollapsibleNavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const Icon = item.icon;
  
  // Check if this is the active route or if any child is active
  const isActive = item.active || 
    (item.href && location.pathname === item.href) || 
    (item.items?.some(subItem => subItem.active || (subItem.href && location.pathname === subItem.href)));

  const handleNavigate = (href: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(href);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleChildClick = (href: string) => {
    navigate(href);
  };

  return (
    <Collapsible open={isOpen} className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <Button
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "flex-1 justify-start font-normal px-2.5 py-1.5 h-8 text-sm max-w-[225px]",
              isActive ? "font-medium bg-accent text-accent-foreground" : "font-normal",
              "transition-all duration-200 hover:scale-[1.02]" // Add subtle scale animation on hover
            )}
            onClick={(e) => item.href && handleNavigate(item.href, e)}
          >
            <span className="flex items-center truncate">
              {item.icon && <span className={cn("mr-2 shrink-0", isActive ? "opacity-100" : "opacity-70")}><Icon className="h-4 w-4" /></span>}
              <span className="truncate">{item.label}</span>
            </span>
          </Button>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-1 w-7 h-8", // Further reduced width
                "transition-colors duration-200"
              )}
              onClick={handleToggle}
              data-chevron="true"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300 opacity-60",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="w-full pl-3 pt-0.5 space-y-0.5 animate-accordion-down">
          <SidebarMenu>
            {item.items?.map((subItem) => {
              const SubIcon = subItem.icon;
              const isSubItemActive = subItem.active || (subItem.href && location.pathname === subItem.href);
              
              return (
                <SidebarMenuItem key={subItem.label}>
                  <SidebarMenuButton
                    variant="default"
                    className={cn(
                      "w-full justify-start text-xs px-2 py-1 h-7 max-w-[225px]",
                      isSubItemActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 font-normal",
                      "transition-all duration-200 hover:scale-[1.02]" // Add subtle scale animation on hover
                    )}
                    onClick={() => handleChildClick(subItem.href)}
                  >
                    <span className="flex items-center truncate">
                      {subItem.icon && <span className={cn("mr-2 shrink-0", isSubItemActive ? "opacity-100" : "opacity-60")}><SubIcon className="h-3.5 w-3.5" /></span>}
                      <span className="truncate">{subItem.label}</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
