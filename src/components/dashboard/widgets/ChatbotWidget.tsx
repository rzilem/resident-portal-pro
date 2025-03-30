
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, ArrowDown, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatbotWidgetProps {
  cardClass?: string;
  size?: 'small' | 'medium' | 'large';
}

const ChatbotWidget = ({ cardClass, size = 'medium' }: ChatbotWidgetProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you with your community management system today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message with proper type annotation
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: inputValue }];
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
      
      // Add AI response with proper type annotation
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
    }, 1000);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        startRecording(stream);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive"
        });
      }
    }
  };

  const startRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      // In a real implementation, we would send the audio to a speech-to-text service
      // and use the transcript as input. For now, we'll simulate this behavior.
      setIsRecording(false);
      
      toast({
        title: "Speech processed",
        description: "Voice input converted to text",
      });
      
      // Simulate a voice message (in a real app, this would be the transcript)
      const simulatedMessages = [
        "Show me recent maintenance requests",
        "What's the status of my recent payment?",
        "When is the next community meeting?",
        "Where can I find the community guidelines?",
        "How do I submit a maintenance request?"
      ];
      const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
      setInputValue(randomMessage);
      
      // Clean up the stream tracks
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    // Automatically stop recording after 5 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }, 5000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
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
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleRecording}
              className="flex-shrink-0"
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Ask me anything..." 
              className="flex-1"
              disabled={isLoading || isRecording}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading || isRecording || !inputValue.trim()}
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
