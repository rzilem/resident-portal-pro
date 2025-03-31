
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, ArrowDown, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAIChat } from '@/hooks/use-ai-chat';

interface ChatbotWidgetProps {
  cardClass?: string;
  size?: 'small' | 'medium' | 'large';
}

const ChatbotWidget = ({ cardClass, size = 'medium' }: ChatbotWidgetProps) => {
  const { toast } = useToast();
  const { messages, sendMessage, isLoading } = useAIChat();
  const [inputValue, setInputValue] = useState('');
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
    
    sendMessage(inputValue);
    setInputValue('');
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
      
      // Simulate a voice message related to community data
      const simulatedMessages = [
        "Show me recent alerts in my association",
        "Tell me about my association",
        "How many properties are in my association?",
        "Where can I find the community documents?",
        "What's the most recent alert in the system?"
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
              placeholder="Ask about your community..." 
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
