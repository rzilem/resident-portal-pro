
import { 
  Calendar, 
  FileText, 
  Printer, 
  ClipboardCheck, 
  Home, 
  Building,
  Mail,
  BarChart2
} from "lucide-react";
import { NavItem } from "./types";

export const getOperationsSection = (currentPath: string): NavItem => {
  return {
    label: "Operations",
    icon: Home,
    active: currentPath === "/calendar" || 
            currentPath === "/workflows" || 
            currentPath === "/print-queue" ||
            currentPath.startsWith("/vendors") ||
            currentPath === "/letter-templates" ||
            currentPath === "/operations/dashboard",
    href: "/calendar", // Default href for the section
    tooltip: "Operational management tools",
    items: [
      {
        label: "Dashboard",
        icon: BarChart2,
        href: "/operations/dashboard",
        active: currentPath === "/operations/dashboard",
        tooltip: "Operations overview dashboard",
      },
      {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
        active: currentPath === "/calendar",
        tooltip: "Calendar management",
      },
      {
        label: "Vendors",
        icon: Building,
        href: "/vendors",
        active: currentPath.startsWith("/vendors"),
        tooltip: "Vendor management",
      },
      {
        label: "Letter Templates",
        icon: Mail,
        href: "/letter-templates",
        active: currentPath === "/letter-templates",
        tooltip: "Manage letter templates",
      },
      {
        label: "Workflows",
        icon: FileText,
        href: "/workflows",
        active: currentPath === "/workflows",
        tooltip: "Workflow automation tools",
      },
      {
        label: "Print Queue",
        icon: Printer,
        href: "/print-queue",
        active: currentPath === "/print-queue",
        tooltip: "Manage print jobs",
      },
    ],
  };
};
