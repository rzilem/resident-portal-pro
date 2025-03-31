
import { Bell, Send, MessageSquare, MegaphoneIcon } from 'lucide-react';
import { NavItem } from './types';

export const getCommunicationSection = (currentPath: string): NavItem => ({
  label: "Communications",
  icon: MessageSquare,
  active: currentPath.startsWith("/communications"),
  href: "/communications/messaging", // Default href
  items: [
    {
      label: "Messaging",
      icon: Send,
      href: "/communications/messaging",
      active: currentPath === "/communications/messaging"
    },
    {
      label: "Announcements",
      icon: Bell,
      href: "/communications/announcements",
      active: currentPath === "/communications/announcements"
    }
  ]
});
