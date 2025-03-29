
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Printer, 
  ClipboardCheck, 
  Home, 
  Building
} from "lucide-react";
import { NavItem } from "./types";

export const getOperationsSection = (currentPath: string): NavItem => {
  return {
    label: "Operations",
    icon: Home,
    active: currentPath === "/calendar" || 
            currentPath.startsWith("/communications") || 
            currentPath === "/workflows" || 
            currentPath === "/print-queue" ||
            currentPath.startsWith("/vendors"),
    href: "/calendar", // Default href for the section
    items: [
      {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
        active: currentPath === "/calendar",
      },
      {
        label: "Communications",
        icon: MessageSquare,
        href: "/communications/messaging",
        active: currentPath.startsWith("/communications"),
      },
      {
        label: "Vendors",
        icon: Building,
        href: "/vendors",
        active: currentPath.startsWith("/vendors"),
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
