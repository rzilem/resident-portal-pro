
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface VendorNotesTabProps {
  vendorId: string;
}

const VendorNotesTab: React.FC<VendorNotesTabProps> = ({ vendorId }) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the note to the database
    setNote('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <p className="text-sm text-center text-muted-foreground py-8">
            No notes have been added yet
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note about this vendor..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-28"
            />
            <div className="flex justify-end">
              <Button type="submit" className="gap-1" disabled={!note.trim()}>
                <Send className="h-4 w-4" />
                Add Note
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorNotesTab;
