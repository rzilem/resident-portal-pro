
// Define the shared types for the communication system
export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: string;
  communities?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompositionMessage {
  subject: string;
  content: string;
  recipients: string[];
}
