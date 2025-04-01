
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { NavItem } from "@/data/navigation";

interface RegularNavItemProps {
  item: NavItem;
}

export function RegularNavItem({ item }: RegularNavItemProps) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <Button
      variant={item.active ? "default" : "ghost"}
      className={cn(
        "w-full justify-start font-normal px-2.5 py-1.5 h-8 text-sm max-w-[210px]", // Added max-width to match
        item.active ? "font-medium" : "font-normal"
      )}
      onClick={() => navigate(item.href)}
    >
      <span className="flex items-center truncate">
        {item.icon && <span className="mr-2 opacity-70 shrink-0"><Icon className="h-4 w-4" /></span>}
        <span className="truncate">{item.label}</span>
      </span>
    </Button>
  );
}
