
import React, { useState } from 'react';
import { Bot, Send, Mic } from 'lucide-react';
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

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useAIChat();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };

  const toggleVoiceRecording = () => {
    // This is a placeholder for voice recognition functionality
    // In a real implementation, you would use the Web Speech API or a similar service
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulating voice recognition
      setTimeout(() => {
        setInputValue('Tell me about recent alerts');
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
              <SheetTitle>Community Assistant</SheetTitle>
              <SheetDescription>
                Ask me anything about your community and its data
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
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant={isRecording ? "destructive" : "outline"} 
                    size="icon"
                    onClick={toggleVoiceRecording}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Input 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Type your question..." 
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
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
              <h3 className="font-medium">Community Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your community data
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
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={isRecording ? "destructive" : "outline"} 
                  size="icon"
                  onClick={toggleVoiceRecording}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Input 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  placeholder="Type your question..." 
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default ChatbotButton;
