
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
            variant="default"
            className={cn(
              "flex-1 justify-start font-normal px-3 py-1.5 h-9 text-sm", // Reduced padding and height
              item.active ? "font-medium" : "font-normal"
            )}
            onClick={(e) => item.href && handleNavigate(item.href, e)}
          >
            <span className="flex items-center">
              {item.icon && <span className="mr-2 opacity-70"><Icon className="h-4 w-4" /></span>}
              {item.label}
            </span>
          </Button>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-1.5 w-8 h-9" // Smaller button
              onClick={handleToggle}
              data-chevron="true"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform opacity-60",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="w-full pl-3 pt-0.5 space-y-0.5"> {/* Reduced padding */}
          <SidebarMenu>
            {item.items?.map((subItem) => {
              const SubIcon = subItem.icon;
              return (
                <SidebarMenuItem key={subItem.label}>
                  <SidebarMenuButton
                    variant="default"
                    className={cn(
                      "w-full justify-start text-xs px-2 py-1 h-7", // Smaller text and height
                      subItem.active ? "bg-accent" : "hover:bg-accent/50"
                    )}
                    onClick={() => handleChildClick(subItem.href)}
                  >
                    {subItem.icon && <span className="mr-2 opacity-60"><SubIcon className="h-3.5 w-3.5" /></span>}
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
