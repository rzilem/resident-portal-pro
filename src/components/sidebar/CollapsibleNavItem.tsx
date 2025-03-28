
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

  // Handle both toggle and navigation in a single function
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    // Check if the click is on the chevron or its parent
    const target = e.target as HTMLElement;
    const isChevronClick = target.tagName === 'svg' || 
                         target.tagName === 'path' ||
                         target.closest('button[data-chevron="true"]') !== null;
    
    if (isChevronClick) {
      // If clicking on the chevron, just toggle the menu
      e.stopPropagation();
      onToggle();
      console.log('Chevron click - toggling menu:', item.label, 'Current state:', isOpen, 'New state:', !isOpen);
    } else {
      // If clicking elsewhere on the button, navigate and optionally toggle
      if (item.href) {
        console.log('Navigating to:', item.href);
        navigate(item.href);
      }
      
      // Only toggle open if it's currently closed
      if (!isOpen) {
        console.log('Auto-opening menu on navigation:', item.label);
        onToggle();
      }
      // We don't auto-close on navigation
    }
  };

  // Handle child item click
  const handleChildClick = (href: string) => {
    console.log('Navigating to child item:', href);
    navigate(href);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="default"
          className={cn(
            "w-full justify-between font-normal",
            item.active ? "font-medium" : "font-normal"
          )}
          onClick={handleButtonClick}
        >
          <span className="flex items-center">
            {item.icon && <span className="mr-2"><Icon className="h-4 w-4" /></span>}
            {item.label}
          </span>
          <ChevronDown
            data-chevron="true"
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "rotate-180" : ""
            )}
          />
        </Button>
      </CollapsibleTrigger>
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
