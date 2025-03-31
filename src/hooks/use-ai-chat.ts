
import { useState, useEffect, useCallback } from 'react';
import { aiDataService } from '@/utils/ai/aiDataService';
import { useAssociationStore } from '@/stores/associationStore';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your Community Assistant. I can help with questions about your association, documents, properties, and more.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentAssociation } = useAssociationStore();
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const newUserMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsLoading(true);
    try {
      // Get AI response with association context
      const responseContent = await aiDataService.generateResponse(
        content, 
        currentAssociation?.id
      );
      
      // Add AI response
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: responseContent }
      ]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error while processing your request. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [currentAssociation]);
  
  return {
    messages,
    sendMessage,
    isLoading
  };
}
