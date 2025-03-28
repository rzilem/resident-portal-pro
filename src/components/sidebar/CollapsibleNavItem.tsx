
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

  // Handle navigation to the default page of the section
  const handleNavigate = (href: string) => {
    console.log('Navigating to:', href);
    navigate(href);
  };

  // Handle the toggle action separately
  const handleToggle = (e: React.MouseEvent) => {
    // Prevent event bubbling to parent components
    e.stopPropagation();
    console.log(`Manual toggle for ${item.label}, current state:`, isOpen, 'new state:', !isOpen);
    onToggle();
  };

  // Handle child item click
  const handleChildClick = (href: string) => {
    console.log('Navigating to child item:', href);
    navigate(href);
  };

  return (
    <Collapsible open={isOpen} className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          {/* Main section button for navigation */}
          <Button
            variant="default"
            className={cn(
              "flex-1 justify-start font-normal",
              item.active ? "font-medium" : "font-normal"
            )}
            onClick={() => item.href && handleNavigate(item.href)}
          >
            <span className="flex items-center">
              {item.icon && <span className="mr-2"><Icon className="h-4 w-4" /></span>}
              {item.label}
            </span>
          </Button>

          {/* Toggle button at the end */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="px-2"
              onClick={handleToggle}
              data-chevron="true"
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
      </div>
    </Collapsible>
  );
}
