
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { NavItem } from "@/data/navigation";
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface CollapsibleNavItemProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleNavItem({ item, isOpen, onToggle }: CollapsibleNavItemProps) {
  const navigate = useNavigate();
  const Icon = item.icon;

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

  const mainButton = (
    <Button
      variant="default"
      className={cn(
        "flex-1 justify-start font-normal px-2.5 py-1.5 h-8 text-sm max-w-[225px]", // Updated max-width to 225px
        item.active ? "font-medium" : "font-normal"
      )}
      onClick={(e) => item.href && handleNavigate(item.href, e)}
    >
      <span className="flex items-center truncate">
        {item.icon && <span className="mr-2 opacity-70 shrink-0"><Icon className="h-4 w-4" /></span>}
        <span className="truncate">{item.label}</span>
      </span>
    </Button>
  );

  const mainButtonWithTooltip = item.tooltip ? (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {mainButton}
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50">
          <p>{item.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : mainButton;

  return (
    <Collapsible open={isOpen} className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          {mainButtonWithTooltip}

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-1 w-7 h-8" // Further reduced width
              onClick={handleToggle}
              data-chevron="true"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform opacity-60",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="w-full pl-3 pt-0.5 space-y-0.5">
          <SidebarMenu>
            {item.items?.map((subItem) => {
              const SubIcon = subItem.icon;
              
              const subButton = (
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    "w-full justify-start text-xs px-2 py-1 h-7 max-w-[225px]", // Updated max-width to 225px for sub-items
                    subItem.active ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleChildClick(subItem.href)}
                >
                  <span className="flex items-center truncate">
                    {subItem.icon && <span className="mr-2 opacity-60 shrink-0"><SubIcon className="h-3.5 w-3.5" /></span>}
                    <span className="truncate">{subItem.label}</span>
                  </span>
                </SidebarMenuButton>
              );
              
              const subButtonWithTooltip = subItem.tooltip ? (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {subButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-50">
                      <p>{subItem.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : subButton;
              
              return (
                <SidebarMenuItem key={subItem.label}>
                  {subButtonWithTooltip}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
