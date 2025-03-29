
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { MessageSquare, Eye, Inbox, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { communicationService, Communication } from '@/services/communicationService';
import ScheduledMessagesDialog from './composer/ScheduledMessagesDialog';
import MessagePreview from './composer/MessagePreview';

const MessageHistory: React.FC = () => {
  const [messages, setMessages] = useState<Communication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isScheduledDialogOpen, setIsScheduledDialogOpen] = useState(false);
  const [messagePreview, setMessagePreview] = useState<{
    open: boolean;
    content: string;
    format: 'plain' | 'html';
    subject?: string;
  }>({
    open: false,
    content: '',
    format: 'plain'
  });
  
  const loadMessages = async () => {
    setLoading(true);
    try {
      const communications = await communicationService.getCommunications();
      setMessages(communications);
    } catch (error) {
      console.error('Error loading message history:', error);
      toast.error('Failed to load message history');
    } finally {
      setLoading(false);
    }
  };
  
  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, []);
  
  const renderDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleRefresh = () => {
    loadMessages();
  };
  
  const handleViewScheduled = () => {
    setIsScheduledDialogOpen(true);
  };
  
  const handlePreviewMessage = (message: Communication) => {
    setMessagePreview({
      open: true,
      content: message.content,
      format: message.format as 'plain' | 'html',
      subject: message.subject
    });
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Inbox className="mr-2 h-6 w-6" />
            Message History
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleViewScheduled}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Scheduled
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading message history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">No messages yet</h3>
            <p>When you send messages, they will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      {renderDate(message.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {message.subject || '(No subject)'}
                    </TableCell>
                    <TableCell>
                      {message.recipients.length} recipient(s)
                    </TableCell>
                    <TableCell>
                      {message.message_type.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(message.status)}`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Preview message" 
                        onClick={() => handlePreviewMessage(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <ScheduledMessagesDialog 
          open={isScheduledDialogOpen}
          onOpenChange={setIsScheduledDialogOpen}
        />
        
        <MessagePreview
          open={messagePreview.open}
          onOpenChange={(open) => setMessagePreview(prev => ({ ...prev, open }))}
          content={messagePreview.content}
          format={messagePreview.format}
          subject={messagePreview.subject}
        />
      </CardContent>
    </Card>
  );
};

export default MessageHistory;
