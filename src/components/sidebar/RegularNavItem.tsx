
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { NavItem } from "@/data/navigation";

interface RegularNavItemProps {
  item: NavItem;
}

export function RegularNavItem({ item }: RegularNavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const Icon = item.icon;
  
  // Check if this is the active route
  const isActive = item.active || (item.href && location.pathname === item.href);

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start font-normal px-2.5 py-1.5 h-8 text-sm max-w-[225px]", 
        isActive ? "font-medium bg-accent text-accent-foreground" : "font-normal",
        "transition-transform duration-200 hover:scale-[1.02]" // Modified to only use transform transition
      )}
      onClick={() => navigate(item.href || '/')}
    >
      <span className="flex items-center truncate">
        {item.icon && <span className={cn("mr-2 shrink-0", isActive ? "opacity-100" : "opacity-70")}><Icon className="h-4 w-4" /></span>}
        <span className="truncate">{item.label}</span>
      </span>
    </Button>
  );
}
