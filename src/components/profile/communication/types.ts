
import { z } from "zod";

export interface Topic {
  id: string;
  label: string;
}

export const communicationFormSchema = z.object({
  allowEmailNotifications: z.boolean(),
  allowSmsNotifications: z.boolean(),
  allowPushNotifications: z.boolean(),
  emailFrequency: z.enum(["immediate", "daily", "weekly"]),
  subscribedTopics: z.array(z.string()).optional(),
});

export type CommunicationFormValues = z.infer<typeof communicationFormSchema>;

export const NOTIFICATION_TOPICS: Topic[] = [
  { id: "maintenance", label: "Maintenance Updates" },
  { id: "events", label: "Community Events" },
  { id: "announcements", label: "Announcements" },
  { id: "board", label: "Board Communications" },
  { id: "financial", label: "Financial Notifications" },
  { id: "emergencies", label: "Emergency Alerts" },
];
