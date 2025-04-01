
import React from 'react';
import { Search, FileText, MessageCircle } from 'lucide-react';

export interface NoMessagesProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
}

const NoMessages: React.FC<NoMessagesProps> = ({ searchTerm, statusFilter, typeFilter }) => {
  // Determine what message to show based on filters
  let message = 'No messages available.';
  let icon = <FileText className="h-16 w-16 text-muted-foreground/30" />;
  
  // If there are filters applied, show a different message
  if (searchTerm || statusFilter !== 'all' || typeFilter !== 'all') {
    message = 'No messages match your filters.';
    icon = <Search className="h-16 w-16 text-muted-foreground/30" />;
  }
  
  // If we're only filtering by type
  if (typeFilter === 'sms' && !searchTerm && statusFilter === 'all') {
    message = 'No SMS messages available.';
    icon = <MessageCircle className="h-16 w-16 text-muted-foreground/30" />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon}
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
      <p className="text-sm text-muted-foreground/70 mt-1">
        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
          ? 'Try adjusting your search or filters.'
          : 'Send your first message to get started.'}
      </p>
    </div>
  );
};

export default NoMessages;
