
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Send } from 'lucide-react';
import { useComposer } from './ComposerContext';

interface ComposerActionsProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
}

const ComposerActions: React.FC<ComposerActionsProps> = ({ onSendMessage }) => {
  const { 
    subject, 
    content, 
    selectedRecipients, 
    isScheduled,
  } = useComposer();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = () => {
    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSendMessage({
        subject,
        content,
        recipients: selectedRecipients,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => {
    console.log("Save as draft:", { subject, content, recipients: selectedRecipients });
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline"
        onClick={handleSaveAsDraft}
      >
        <Copy className="mr-2 h-4 w-4" />
        Save as Draft
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        onClick={handleSendMessage}
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Sending...' : isScheduled ? 'Schedule Message' : 'Send Message'}
      </Button>
    </div>
  );
};

export default ComposerActions;
