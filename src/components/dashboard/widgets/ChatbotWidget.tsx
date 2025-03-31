
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, ArrowDown, Mic, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer effect for recording duration
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

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
      
      // Show a toast to simulate processing
      toast({
        title: "Processing voice command",
        description: "Converting your voice to text...",
      });
      
      // Simulate a slight delay for "processing"
      setTimeout(() => {
        // Generate possible action commands rather than just random messages
        const actionCommands = [
          "Send an email to residents about the upcoming community event",
          "Create an alert for the broken fence in the north area",
          "Start a violation workflow for property 1234",
          "Schedule a board meeting for next Tuesday at 7 PM",
          "Send a maintenance notification to all residents"
        ];
        
        const randomCommand = actionCommands[Math.floor(Math.random() * actionCommands.length)];
        setInputValue(randomCommand);
        
        toast({
          title: "Voice command recognized",
          description: randomCommand,
        });
      }, 1500);
      
      // Clean up the stream tracks
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    // In a real implementation, we might want to automatically stop after some time
    // or when silence is detected. For now, we'll use a fixed timeout of 8 seconds.
    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }, 8000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Format recording time as MM:SS
  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("flex flex-col h-full", cardClass)}>
      <CardContent className="flex flex-col p-3 h-full">
        <div className="flex items-center mb-3">
          <div className="bg-primary/10 p-1.5 rounded-full mr-2">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium text-sm">Community AI Assistant</h3>
          <div className="ml-auto text-xs text-muted-foreground">
            Can perform actions & answer questions
          </div>
        </div>
        
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : 
                  msg.role === 'system' ? "justify-center" : "justify-start"
                )}
              >
                {msg.role === 'system' ? (
                  <div className="bg-amber-100 dark:bg-amber-900/30 max-w-[85%] rounded-lg px-3 py-1.5 text-xs flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    {msg.content}
                  </div>
                ) : (
                  <div 
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    {msg.content.startsWith('✅') ? (
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>{msg.content.substring(2)}</span>
                      </div>
                    ) : msg.content.startsWith('❌') ? (
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>{msg.content.substring(2)}</span>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                )}
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
            <div className="relative flex-shrink-0">
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
                className={cn(
                  "flex-shrink-0",
                  isRecording && "animate-pulse"
                )}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                <Mic className="h-4 w-4" />
              </Button>
              {isRecording && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground text-xs py-1 px-2 rounded whitespace-nowrap">
                  {formatRecordingTime()}
                </span>
              )}
            </div>
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Ask or command (e.g., 'send email to...')" 
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
          {!isRecording && (
            <div className="mt-1.5 text-xs text-muted-foreground">
              Try: "Send email to residents" or "Create an alert for..."
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatbotWidget;
