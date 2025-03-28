
import React from 'react';
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { NavItem } from "@/data/navigation";

interface RegularNavItemProps {
  item: NavItem;
}

export function RegularNavItem({ item }: RegularNavItemProps) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          variant="default"
          className={cn(
            "w-full justify-start",
            item.active ? "font-medium" : "font-normal"
          )}
          onClick={() => item.href && navigate(item.href)}
        >
          {item.icon && <Icon className="h-4 w-4 mr-2" />}
          {item.label}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
