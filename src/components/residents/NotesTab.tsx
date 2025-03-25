
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Note } from '@/types/resident';

interface NotesTabProps {
  notes?: Note[];
}

const NotesTab: React.FC<NotesTabProps> = ({ notes }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Internal notes about this resident
          </CardDescription>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        {notes && notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold">{note.author}</p>
                  <p className="text-sm text-muted-foreground">{note.date}</p>
                </div>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No notes available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesTab;
