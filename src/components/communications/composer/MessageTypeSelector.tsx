
import React from 'react';
import { useComposer } from './ComposerContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { TooltipButton } from '@/components/ui/tooltip-button';

const MessageTypeSelector: React.FC = () => {
  const { messageType, setMessageType } = useComposer();
  
  return (
    <div className="flex flex-col space-y-2">
      <Label className="text-sm font-medium">Message Type</Label>
      <div className="flex items-center space-x-2">
        <TooltipButton 
          variant={messageType === 'email' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMessageType('email')}
          className="flex-1"
          tooltipText="Send an email message"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </TooltipButton>
        <Separator orientation="vertical" className="h-8" />
        <TooltipButton 
          variant={messageType === 'sms' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMessageType('sms')}
          className="flex-1"
          tooltipText="Send an SMS message"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          SMS
        </TooltipButton>
      </div>
    </div>
  );
};

export default MessageTypeSelector;
