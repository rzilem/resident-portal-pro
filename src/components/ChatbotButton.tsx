
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAIChat } from '@/hooks/use-ai-chat';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useAIChat();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
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

  const toggleVoiceRecording = async () => {
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
      setIsRecording(false);
      
      toast({
        title: "Processing voice command",
        description: "Converting your voice to text...",
      });
      
      setTimeout(() => {
        // Generate possible action commands
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
    
    // Automatically stop after 8 seconds
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
    <>
      {/* Mobile: Sheet for full screen chatbot on mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Bot className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Community Assistant</SheetTitle>
              <SheetDescription>
                Ask questions or request actions like sending emails and creating alerts
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto py-4 space-y-4">
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
                          "max-w-[80%] rounded-lg px-4 py-2",
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
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t pt-4">
                <div className="flex gap-2">
                  <div className="relative">
                    <Button 
                      type="button" 
                      variant={isRecording ? "destructive" : "outline"} 
                      size="icon"
                      onClick={toggleVoiceRecording}
                      className={cn(
                        isRecording && "animate-pulse"
                      )}
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
                    placeholder="Type your question or command..." 
                    className="flex-1"
                    disabled={isLoading || isRecording}
                  />
                  <Button type="submit" disabled={isLoading || isRecording || !inputValue.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
                {!isRecording && (
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    Try: "Send email to residents" or "Create an alert for..."
                  </div>
                )}
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop: Popover for desktop chatbot */}
      <div className="hidden md:block fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Bot className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" side="top" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <h3 className="font-medium">Community Assistant</h3>
                <div className="ml-auto text-xs text-muted-foreground">
                  Actions & Answers
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Ask questions or request actions like sending emails and creating alerts
              </p>
            </div>
            
            <div className="h-[350px] overflow-auto p-4 space-y-4">
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
                        "max-w-[80%] rounded-lg px-4 py-2",
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
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <div className="relative">
                  <Button 
                    type="button" 
                    variant={isRecording ? "destructive" : "outline"} 
                    size="icon"
                    onClick={toggleVoiceRecording}
                    className={cn(
                      isRecording && "animate-pulse"
                    )}
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
                  placeholder="Type your question or command..." 
                  className="flex-1"
                  disabled={isLoading || isRecording}
                />
                <Button type="submit" disabled={isLoading || isRecording || !inputValue.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
              {!isRecording && (
                <div className="mt-1.5 text-xs text-muted-foreground">
                  Try: "Send email to residents" or "Create an alert for..."
                </div>
              )}
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default ChatbotButton;
