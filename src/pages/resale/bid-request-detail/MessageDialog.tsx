
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MessageDialog: React.FC = () => {
  const [notes, setNotes] = useState('');
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to Vendors</DialogTitle>
          <DialogDescription>
            Send a message to all vendors regarding this bid request.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button type="submit">Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
