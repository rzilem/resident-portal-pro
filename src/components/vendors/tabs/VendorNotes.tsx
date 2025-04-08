
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

interface VendorNotesProps {
  vendorId: string;
}

interface Note {
  id: string;
  vendor_id: string;
  content: string;
  created_at: string;
  created_by: string;
  author?: {
    first_name: string;
    last_name: string;
  };
}

const VendorNotes: React.FC<VendorNotesProps> = ({ vendorId }) => {
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['vendorNotes', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_notes')
        .select(`
          *,
          author:created_by(first_name, last_name)
        `)
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('vendor_notes')
        .insert([
          {
            vendor_id: vendorId,
            content,
            created_by: user?.id
          }
        ]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorNotes', vendorId] });
      setNewNote('');
    }
  });
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Notes and comments about this vendor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Notes and comments about this vendor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea 
            value={newNote} 
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this vendor..."
            className="min-h-[80px]"
          />
          <Button 
            className="self-end" 
            onClick={handleAddNote}
            disabled={!newNote.trim() || addNoteMutation.isPending}
          >
            {addNoteMutation.isPending ? "Adding..." : <Send className="h-4 w-4" />}
          </Button>
        </div>
        
        {notes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No notes yet. Add the first note above.
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note: Note) => (
              <div key={note.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">
                    {note.author ? `${note.author.first_name} ${note.author.last_name}` : 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div className="whitespace-pre-wrap">{note.content}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorNotes;
