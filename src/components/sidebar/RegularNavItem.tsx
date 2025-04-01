
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { NavItem } from "@/data/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RegularNavItemProps {
  item: NavItem;
}

export function RegularNavItem({ item }: RegularNavItemProps) {
  const navigate = useNavigate();
  const Icon = item.icon;

  const button = (
    <Button
      variant={item.active ? "default" : "ghost"}
      className={cn(
        "w-full justify-start font-normal px-2.5 py-1.5 h-8 text-sm max-w-[225px]", // Updated max-width to 225px
        item.active ? "font-medium" : "font-normal"
      )}
      onClick={() => navigate(item.href || '/')}
    >
      <span className="flex items-center truncate">
        {item.icon && <span className="mr-2 opacity-70 shrink-0"><Icon className="h-4 w-4" /></span>}
        <span className="truncate">{item.label}</span>
      </span>
    </Button>
  );

  if (item.tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
