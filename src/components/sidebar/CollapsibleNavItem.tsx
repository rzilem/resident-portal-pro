
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { NavItem } from "@/data/navigation";
import React from 'react';

interface CollapsibleNavItemProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleNavItem({ item, isOpen, onToggle }: CollapsibleNavItemProps) {
  const navigate = useNavigate();
  const Icon = item.icon;

  // Handle navigation when clicking on the main button
  const handleNavigation = (e: React.MouseEvent) => {
    if (item.href) {
      navigate(item.href);
    }
  };
  
  // Handle toggle separately to avoid navigation conflicts
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onToggle();
  };

  // Handle child item click
  const handleChildClick = (href: string) => {
    console.log('Navigating to:', href);
    navigate(href);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <div className="flex w-full">
        <Button
          variant="default"
          className={cn(
            "flex-1 justify-start font-normal",
            item.active ? "font-medium" : "font-normal"
          )}
          onClick={handleNavigation}
        >
          <span className="flex items-center">
            {item.icon && <span className="mr-2"><Icon className="h-4 w-4" /></span>}
            {item.label}
          </span>
        </Button>
        <CollapsibleTrigger asChild>
          <Button 
            variant="default" 
            size="icon" 
            className="px-2"
            onClick={handleToggle}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen ? "rotate-180" : ""
              )}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="w-full pl-4 pt-1 space-y-1">
        <SidebarMenu>
          {item.items?.map((subItem) => {
            const SubIcon = subItem.icon;
            return (
              <SidebarMenuItem key={subItem.label}>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    "w-full justify-start text-sm px-2 py-1.5 h-8",
                    subItem.active ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleChildClick(subItem.href)}
                >
                  {subItem.icon && <span className="mr-2"><SubIcon className="h-4 w-4" /></span>}
                  {subItem.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
}
