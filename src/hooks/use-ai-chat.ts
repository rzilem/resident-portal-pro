
import { useState, useEffect, useCallback } from 'react';
import { aiDataService } from '@/utils/ai/aiDataService';
import { useAssociationStore } from '@/stores/associationStore';
import { toast } from 'sonner';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isAction?: boolean;
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your Community Assistant. I can help with questions about your association, documents, properties, and more. I can also perform actions like sending emails, creating alerts, and starting workflows.' 
    }
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
      // Check if this is potentially an action request
      const actionRequest = aiDataService.detectActionRequest(content);
      
      if (actionRequest.isActionRequest) {
        // Add a system message indicating action detection
        setMessages(prev => [
          ...prev, 
          { 
            role: 'system', 
            content: `Detected potential action request: ${actionRequest.actionType}`,
            isAction: true
          }
        ]);
      }
      
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
      
      // If an action was performed, show a toast notification
      if (actionRequest.isActionRequest && responseContent.startsWith('✅')) {
        toast.success('Action Completed', {
          description: responseContent.replace('✅ ', '')
        });
      }
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
