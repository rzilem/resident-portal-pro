
import React from 'react';
import { MessageSquareOff } from 'lucide-react';

interface NoMessagesProps {
  searchQuery: string;
  tab: string;
}

const NoMessages: React.FC<NoMessagesProps> = ({ searchQuery, tab }) => {
  let message = "No messages found";
  
  if (searchQuery) {
    message = `No messages match your search: "${searchQuery}"`;
  } else {
    switch (tab) {
      case 'sent':
        message = "You haven't sent any messages yet";
        break;
      case 'scheduled':
        message = "You don't have any scheduled messages";
        break;
      case 'drafts':
        message = "You don't have any draft messages";
        break;
      case 'email':
        message = "You haven't sent any emails yet";
        break;
      case 'sms':
        message = "You haven't sent any SMS messages yet";
        break;
      default:
        message = "You don't have any messages yet";
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MessageSquareOff className="h-16 w-16 text-muted-foreground mb-4" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

export default NoMessages;
