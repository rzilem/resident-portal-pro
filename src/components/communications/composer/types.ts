
/**
 * Shared types for message composer components
 */

export interface MessageData {
  subject: string;
  content: string;
  recipients: string[];
  format?: 'plain' | 'html';
  scheduledDate?: string;
}

export interface RecipientGroup {
  id: string;
  name: string;
  description: string;
}

