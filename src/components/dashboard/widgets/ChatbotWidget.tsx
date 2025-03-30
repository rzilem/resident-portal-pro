
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatbotWidgetProps {
  cardClass?: string;
  size?: 'small' | 'medium' | 'large';
}

const ChatbotWidget = ({ cardClass, size = 'medium' }: ChatbotWidgetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you with your community management system today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response (In a real implementation, this would connect to an AI backend)
    setTimeout(() => {
      setIsLoading(false);
      
      // Sample responses based on common queries
      let responseText = '';
      const userInput = inputValue.toLowerCase();
      
      if (userInput.includes('dashboard') || userInput.includes('widgets')) {
        responseText = 'The dashboard is customizable! You can add, remove, and resize widgets based on your preferences. Click the "Customize Dashboard" button to get started.';
      } else if (userInput.includes('resident') || userInput.includes('member') || userInput.includes('people')) {
        responseText = 'You can manage all your community residents in the Residents section. View details, contact information, and account status from there.';
      } else if (userInput.includes('payment') || userInput.includes('bill') || userInput.includes('due')) {
        responseText = 'Payments can be managed in the Finances section. You can view payment history, outstanding balances, and set up automatic payments.';
      } else if (userInput.includes('maintenance') || userInput.includes('repair')) {
        responseText = 'Maintenance requests can be submitted and tracked in the Maintenance section. You can view status updates and communicate with service providers.';
      } else if (userInput.includes('document') || userInput.includes('file')) {
        responseText = 'You can find all community documents in the Documents section. Important files like bylaws, meeting minutes, and announcements are stored there.';
      } else if (userInput.includes('settings') || userInput.includes('preference')) {
        responseText = 'You can customize your account and system preferences in the Settings section. Adjust notifications, display options, and security settings there.';
      } else {
        responseText = 'I understand your question about "' + inputValue + '". In a production environment, I would connect to our knowledge base to provide a detailed answer. Is there something specific about the community management system you\'d like to know?';
      }
      
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
    }, 1000);
  };

  return (
    <Card className={cn("flex flex-col h-full", cardClass)}>
      <CardContent className="flex flex-col p-3 h-full">
        <div className="flex items-center mb-3">
          <div className="bg-primary/10 p-1.5 rounded-full mr-2">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium text-sm">Community AI Assistant</h3>
        </div>
        
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[85%] rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="mt-3">
          <div className="flex gap-2">
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Ask me anything..." 
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? <ArrowDown className="h-4 w-4 animate-bounce" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatbotWidget;
