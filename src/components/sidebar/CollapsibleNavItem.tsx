
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

  // Handle click on the collapsible trigger button
  const handleButtonClick = (e: React.MouseEvent) => {
    // If the item has a href, navigate to it
    if (item.href) {
      navigate(item.href);
    }
    // We don't call onToggle here because the CollapsibleTrigger will handle that
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
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "rotate-180" : ""
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 pt-1 space-y-1">
        {item.items?.map((subItem) => (
          <Button
            key={subItem.label}
            variant="ghost"
            className={cn(
              "w-full justify-start text-sm px-2 py-1.5 h-8", // Made button smaller and more compact
              subItem.active ? "bg-accent" : "hover:bg-accent/50"
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
