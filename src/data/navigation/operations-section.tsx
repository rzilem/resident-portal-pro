
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
    items: [
      {
        label: "Dashboard",
        icon: BarChart2,
        href: "/operations/dashboard",
        active: currentPath === "/operations/dashboard",
      },
      {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
        active: currentPath === "/calendar",
      },
      {
        label: "Vendors",
        icon: Building,
        href: "/vendors",
        active: currentPath.startsWith("/vendors"),
      },
      {
        label: "Letter Templates",
        icon: Mail,
        href: "/letter-templates",
        active: currentPath === "/letter-templates",
      },
      {
        label: "Workflows",
        icon: FileText,
        href: "/workflows",
        active: currentPath === "/workflows",
      },
      {
        label: "Print Queue",
        icon: Printer,
        href: "/print-queue",
        active: currentPath === "/print-queue",
      },
    ],
  };
};
