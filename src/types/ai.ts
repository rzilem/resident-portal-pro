
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIContext {
  associationId?: string;
  userId?: string;
  currentView?: string;
  accessibleData: string[];
}
