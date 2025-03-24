
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Search, Copy, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  subject: string;
  date: string;
  recipients: string;
  status: 'sent' | 'scheduled' | 'draft';
  opens: number;
  content: string;
}

const MESSAGES: Message[] = [
  {
    id: '1',
    subject: 'Community Pool Opening Next Week',
    date: '2023-06-10 14:30',
    recipients: 'All Residents',
    status: 'sent',
    opens: 142,
    content: '<h1>Pool Opening Announcement</h1><p>We are pleased to announce the community pool will open next week...</p>'
  },
  {
    id: '2',
    subject: 'Road Maintenance Schedule',
    date: '2023-06-08 09:15',
    recipients: 'Property Owners',
    status: 'sent',
    opens: 86,
    content: '<h1>Road Maintenance</h1><p>The following roads will be closed for maintenance...</p>'
  },
  {
    id: '3',
    subject: 'Community Town Hall Meeting',
    date: '2023-06-15 11:00',
    recipients: 'All Residents',
    status: 'scheduled',
    opens: 0,
    content: '<h1>Town Hall Invitation</h1><p>You are invited to our quarterly town hall meeting...</p>'
  },
  {
    id: '4',
    subject: 'Holiday Decoration Guidelines',
    date: '2023-06-01 16:45',
    recipients: 'All Residents',
    status: 'sent',
    opens: 203,
    content: '<h1>Holiday Guidelines</h1><p>Please review the following guidelines for holiday decorations...</p>'
  },
  {
    id: '5',
    subject: 'Water Service Interruption',
    date: '2023-06-18 08:00',
    recipients: 'All Residents',
    status: 'scheduled',
    opens: 0,
    content: '<h1>Water Service Notice</h1><p>There will be a temporary water service interruption due to...</p>'
  },
  {
    id: '6',
    subject: 'New Resident Welcome Package',
    date: '2023-05-28 13:20',
    recipients: 'New Residents',
    status: 'draft',
    opens: 0,
    content: '<h1>Welcome to Our Community</h1><p>On behalf of all residents, we would like to welcome you...</p>'
  },
];

const MessageHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredMessages = MESSAGES.filter(message => 
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.recipients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPreview = (message: Message) => {
    setSelectedMessage(message);
    setPreviewOpen(true);
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-amber-100 text-amber-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opens</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.subject}</TableCell>
                    <TableCell>{message.date}</TableCell>
                    <TableCell>{message.recipients}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(message.status)}`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{message.opens}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openPreview(message)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Preview</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openPreview(message)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {selectedMessage && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>
                Sent to: {selectedMessage.recipients} • {selectedMessage.date}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 mt-4">
              <div 
                className="p-4 border rounded-md bg-white"
                dangerouslySetInnerHTML={{ __html: selectedMessage.content }}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MessageHistory;
