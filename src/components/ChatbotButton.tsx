
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
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

// Define a type for our chat messages
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message - explicitly typed as 'user'
    const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    
    // Simulate AI response (In a real application, this would call an API)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          role: 'assistant' as const, 
          content: `I understand you're asking about "${inputValue}". This is a simulated response. In a production environment, this would connect to an AI backend service.`
        }
      ]);
    }, 1000);
  };

  const toggleVoiceRecording = () => {
    // This is a placeholder for voice recognition functionality
    // In a real implementation, you would use the Web Speech API or a similar service
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulating voice recognition
      setTimeout(() => {
        setInputValue('Show me property reports');
        setIsRecording(false);
      }, 2000);
    }
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
              <SheetTitle>AI Assistant</SheetTitle>
              <SheetDescription>
                Ask me anything about your community management system
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant={isRecording ? "destructive" : "outline"} 
                    size="icon"
                    onClick={toggleVoiceRecording}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  </Button>
                  <Input 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Type your question..." 
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </div>
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
          <PopoverContent className="w-80 sm:w-96 p-0" side="top" align="end">
            <div className="p-4 border-b">
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your community management system
              </p>
            </div>
            
            <div className="h-[300px] overflow-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={isRecording ? "destructive" : "outline"} 
                  size="icon"
                  onClick={toggleVoiceRecording}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </Button>
                <Input 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  placeholder="Type your question..." 
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default ChatbotButton;
