
import React from 'react';
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { NavItem } from "@/data/navigation";
import { isPathActive } from "@/data/navigation/utils";

interface RegularNavItemProps {
  item: NavItem;
}

export function RegularNavItem({ item }: RegularNavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const Icon = item.icon;
  
  // Check if current path is active
  const active = item.href ? isPathActive(item.href, location.pathname) : false;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          variant="default"
          className={cn(
            "w-full justify-start",
            active ? "bg-accent text-accent-foreground font-medium" : "font-normal"
          )}
          onClick={() => item.href && navigate(item.href)}
        >
          {item.icon && <Icon className={cn("h-4 w-4 mr-2", active && "text-accent-foreground")} />}
          {item.label}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
