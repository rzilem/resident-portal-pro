
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Printer, 
  ClipboardCheck, 
  Home 
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
            currentPath.startsWith("/resale"),
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
        active: currentPath === "/communications/messaging" || 
                currentPath === "/communications/announcements",
        submenu: [
          {
            label: "Community Messaging",
            href: "/communications/messaging",
            active: currentPath === "/communications/messaging",
          },
          {
            label: "Announcements",
            href: "/communications/announcements",
            active: currentPath === "/communications/announcements",
          },
        ],
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
      {
        label: "Resale",
        icon: ClipboardCheck,
        href: "/resale",
        active: currentPath.startsWith("/resale"),
      }
    ],
  };
};
