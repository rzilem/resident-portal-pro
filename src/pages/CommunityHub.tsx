
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Mic, Search, Book, FilePlus, HelpCircle, Bookmark, PlusCircle, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAssociations } from '@/hooks/use-associations';

// Define types for our chat messages
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type ResourceItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'document' | 'link' | 'video';
};

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'system', 
      content: 'Welcome to the Community Hub! How can I assist you today?', 
      timestamp: new Date() 
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { associations } = useAssociations();
  
  // Sample FAQ data
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I pay my HOA dues?',
      answer: 'You can pay your HOA dues through the Payments section under Accounting. We accept credit cards, bank transfers, and checks.',
      category: 'Payments'
    },
    {
      id: '2',
      question: 'What is the process for submitting a maintenance request?',
      answer: 'Navigate to the Properties section, select your property, and click on "Submit Maintenance Request". Fill out the form with all relevant details.',
      category: 'Maintenance'
    },
    {
      id: '3',
      question: 'How do I reserve community amenities?',
      answer: 'Go to the Calendar section and click on "Reserve Amenity". Select the amenity, date, and time you wish to reserve.',
      category: 'Amenities'
    },
    {
      id: '4',
      question: 'Where can I find community announcements?',
      answer: 'All announcements are posted in the Communications > Announcements section. You can also subscribe to receive email notifications.',
      category: 'Communications'
    },
    {
      id: '5',
      question: 'How do I update my contact information?',
      answer: 'You can update your contact information in the Settings > Profile section.',
      category: 'Account'
    }
  ];
  
  // Sample resources data
  const resourceItems: ResourceItem[] = [
    {
      id: '1',
      title: 'HOA Bylaws',
      description: 'Official bylaws and regulations for the association',
      url: '#',
      type: 'document'
    },
    {
      id: '2',
      title: 'Resident Handbook',
      description: 'Guide for new and existing residents',
      url: '#',
      type: 'document'
    },
    {
      id: '3',
      title: 'Architectural Guidelines',
      description: 'Standards for property modifications and improvements',
      url: '#',
      type: 'document'
    },
    {
      id: '4',
      title: 'Community Map',
      description: 'Interactive map of the community and amenities',
      url: '#',
      type: 'link'
    },
    {
      id: '5',
      title: 'HOA Board Meeting Recording - May 2023',
      description: 'Video recording of the latest board meeting',
      url: '#',
      type: 'video'
    }
  ];
  
  // Filter FAQ items based on search query
  const filteredFAQs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter resource items based on search query
  const filteredResources = resourceItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response (In a real application, this would call an API)
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateBotResponse(inputValue, associations || []),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  const generateBotResponse = (query: string, associations: any[]): string => {
    // Simple response logic based on query keywords
    query = query.toLowerCase();
    
    if (query.includes('pay') && (query.includes('dues') || query.includes('fee'))) {
      return 'You can pay your HOA dues through the Accounting > Payments section. We accept various payment methods including credit card and bank transfer.';
    }
    
    if (query.includes('maintenance') || query.includes('repair')) {
      return 'To submit a maintenance request, go to the Properties section, select your property, and click on the "Maintenance" tab. From there you can create a new maintenance ticket.';
    }
    
    if (query.includes('amenity') || query.includes('reserve') || query.includes('pool')) {
      return 'To reserve community amenities, navigate to the Calendar section and click on "Add Event". You can specify which amenity you want to reserve and for what time period.';
    }
    
    if (query.includes('document') || query.includes('bylaws') || query.includes('rules')) {
      return 'You can find all community documents in the Records > Association Records section. This includes bylaws, rules & regulations, and architectural guidelines.';
    }
    
    if (query.includes('board') || query.includes('meeting')) {
      return 'Board meeting information can be found in the Calendar section. Past meeting minutes are available in the Records section.';
    }
    
    if (associations.length > 0) {
      return `I understand you're asking about "${query}". I can provide general information about your ${associations.length} associations. For specific assistance, please check the FAQ tab or be more specific with your question.`;
    }
    
    return `I understand you're asking about "${query}". For more specific assistance, please try the FAQ section or rephrase your question with more details.`;
  };
  
  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast.info('Voice recording started');
      // In a real implementation, this would use the Web Speech API
      setTimeout(() => {
        setInputValue('How do I submit a maintenance request?');
        setIsRecording(false);
        toast.success('Voice recording completed');
      }, 2000);
    } else {
      toast.info('Voice recording cancelled');
    }
  };
  
  const handleFAQClick = (faq: FAQItem) => {
    setActiveTab('chat');
    setInputValue(faq.question);
    
    // Auto send after a short delay
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: faq.question,
        timestamp: new Date()
      };
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: faq.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage, botResponse]);
    }, 500);
  };
  
  const handleResourceClick = (resource: ResourceItem) => {
    // In a real app, this would open the resource
    toast.success(`Opening ${resource.title}`);
  };
  
  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FilePlus className="w-4 h-4" />;
      case 'link':
        return <Book className="w-4 h-4" />;
      case 'video':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <FilePlus className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="grid gap-4 md:gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Community Hub</h2>
          <p className="text-muted-foreground">Get assistance, find resources, and connect with your community</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main content area - 3/4 width on large screens */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="px-4 py-3 border-b">
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>FAQ</span>
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    <span>Resources</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
              <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 h-full">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role !== 'user' && msg.role !== 'system' && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="/placeholder.svg" alt="Bot" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : msg.role === 'system'
                                ? 'bg-muted/50 text-foreground border'
                                : 'bg-muted text-foreground'
                          }`}
                        >
                          {msg.content}
                          {msg.role !== 'system' && (
                            <div className="text-[10px] opacity-70 text-right mt-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                        
                        {msg.role === 'user' && (
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>Me</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <form onSubmit={handleSendMessage} className="border-t p-4">
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
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="faq" className="flex-1 flex flex-col p-0 m-0 h-full">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search FAQs..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq) => (
                        <Card key={faq.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => handleFAQClick(faq)}>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base flex items-start gap-2">
                              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>{faq.question}</span>
                            </CardTitle>
                            <CardDescription className="text-xs">Category: {faq.category}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm">{faq.answer}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-8">
                        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No FAQs Found</h3>
                        <p className="text-muted-foreground mt-2">
                          Try a different search term or browse the resources tab.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="resources" className="flex-1 flex flex-col p-0 m-0 h-full">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search resources..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => (
                        <Card key={resource.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => handleResourceClick(resource)}>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base flex items-start gap-2">
                              {renderResourceIcon(resource.type)}
                              <span>{resource.title}</span>
                            </CardTitle>
                            <CardDescription className="text-xs">Type: {resource.type}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm">{resource.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-8">
                        <Book className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No Resources Found</h3>
                        <p className="text-muted-foreground mt-2">
                          Try a different search term or check back later.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Request New Resource
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar area - 1/4 width on large screens */}
        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Popular community resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { title: 'Community Rules', icon: <Book className="h-4 w-4" /> },
                  { title: 'Upcoming Events', icon: <CalendarIcon className="h-4 w-4" /> },
                  { title: 'Maintenance Requests', icon: <FilePlus className="h-4 w-4" /> },
                  { title: 'Message Board', icon: <MessageSquare className="h-4 w-4" /> },
                  { title: 'Saved Resources', icon: <Bookmark className="h-4 w-4" /> }
                ].map((link, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => toast.info(`Navigating to ${link.title}`)}
                  >
                    {link.icon}
                    {link.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Popular Questions</CardTitle>
              <CardDescription>Frequently asked by residents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {faqItems.slice(0, 3).map((faq) => (
                  <Button 
                    key={faq.id} 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-left h-auto py-2"
                    onClick={() => handleFAQClick(faq)}
                  >
                    <HelpCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    <span className="truncate">{faq.question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
