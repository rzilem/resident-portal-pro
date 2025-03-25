
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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          variant="default"
          className={cn(
            "w-full justify-start",
            item.active ? "font-medium" : "font-normal"
          )}
          onClick={() => navigate(item.href)}
        >
          {item.icon && <span className="mr-2">{React.createElement(item.icon)}</span>}
          {item.label}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
