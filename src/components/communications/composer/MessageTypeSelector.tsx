
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useComposer } from './ComposerContext';
import { Mail, MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MessageTypeSelector: React.FC = () => {
  const { messageType, setMessageType, format, setFormat } = useComposer();

  const handleTypeChange = (value: string) => {
    if (!value) return; // Prevent deselecting both options
    
    const newType = value as 'email' | 'sms';
    setMessageType(newType);
    
    // If switching to SMS, force plain text format
    if (newType === 'sms' && format !== 'plain') {
      setFormat('plain');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Message Type</Label>
        {messageType === 'sms' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-amber-500 bg-amber-50">
                  SMS character limit: 160
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Standard SMS messages are limited to 160 characters.</p>
                <p className="text-xs mt-1">Longer messages may be split into multiple texts.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <ToggleGroup type="single" value={messageType} onValueChange={handleTypeChange} className="justify-start">
        <ToggleGroupItem value="email" className="gap-2">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="sms" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>SMS Text</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {messageType === 'sms' && (
        <p className="text-xs text-muted-foreground">
          SMS messages will be sent to recipients with mobile numbers. Content will be sent as plain text.
        </p>
      )}
    </div>
  );
};

export default MessageTypeSelector;
