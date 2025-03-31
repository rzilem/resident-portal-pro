
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { communicationService, Communication } from '@/services/communicationService';
import MessageHistoryActions from './MessageHistoryActions';
import NoMessages from './NoMessages';

const MessageHistory: React.FC = () => {
  const [messages, setMessages] = useState<Communication[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Communication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  useEffect(() => {
    loadMessages();
  }, []);
  
  useEffect(() => {
    filterMessages(activeTab, searchQuery);
  }, [messages, activeTab, searchQuery]);
  
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await communicationService.getCommunications();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load message history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterMessages = (tab: string, query: string) => {
    let filtered = [...messages];
    
    // Filter by tab
    if (tab !== 'all') {
      filtered = filtered.filter(msg => {
        if (tab === 'sent') return msg.status === 'sent';
        if (tab === 'scheduled') return msg.status === 'scheduled';
        if (tab === 'drafts') return msg.status === 'draft';
        if (tab === 'email') return msg.message_type === 'email';
        if (tab === 'sms') return msg.message_type === 'sms';
        return true;
      });
    }
    
    // Filter by search query
    if (query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.subject?.toLowerCase().includes(lowerQuery) ||
        msg.content.toLowerCase().includes(lowerQuery) ||
        msg.recipients.some(r => r.recipient_email.toLowerCase().includes(lowerQuery))
      );
    }
    
    setFilteredMessages(filtered);
  };
  
  const handleCancelScheduled = async (messageId: string) => {
    const success = await communicationService.cancelScheduledCommunication(messageId);
    if (success) {
      toast({
        title: 'Success',
        description: 'Scheduled message has been canceled',
      });
      loadMessages();
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const renderMessageIcon = (messageType: 'email' | 'sms') => {
    return messageType === 'email' 
      ? <Mail className="h-4 w-4 text-primary" /> 
      : <MessageSquare className="h-4 w-4 text-primary" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message History</CardTitle>
        <CardDescription>View and manage your sent and scheduled messages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button 
              variant="outline" 
              onClick={loadMessages}
              className="self-start"
            >
              Refresh
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMessages.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-24 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            {renderMessageIcon(message.message_type)}
                          </TableCell>
                          <TableCell>
                            {message.subject || <span className="text-muted-foreground italic">SMS Message</span>}
                          </TableCell>
                          <TableCell>
                            {message.recipients.length} recipient{message.recipients.length !== 1 ? 's' : ''}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${message.status === 'sent' ? 'bg-green-100 text-green-800' : 
                                message.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {message.status === 'scheduled' ? 
                              formatDate(message.scheduled_for || '') :
                              formatDate(message.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <MessageHistoryActions 
                              message={message} 
                              onCancelScheduled={handleCancelScheduled}
                              onRefresh={loadMessages}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <NoMessages searchQuery={searchQuery} tab={activeTab} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageHistory;
