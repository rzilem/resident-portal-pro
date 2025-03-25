
import React, { useState } from 'react';
import { FileText, Clock, Search, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Note, ActivityLog } from '@/types/resident';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface NotesTabProps {
  notes?: Note[];
  activityLogs?: ActivityLog[];
}

const NotesTab: React.FC<NotesTabProps> = ({ notes = [], activityLogs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredActivityLogs = activityLogs.filter(log => 
    log.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMimicSession = (timestamp: string, details?: string) => {
    // In a real implementation, this would initiate a session mimicking flow
    // For now, we'll just show a toast notification
    toast.success(`Mimicking session from ${timestamp}`, {
      description: details || 'Accessing homeowner portal view'
    });
    
    // This would navigate to a homeowner portal view in a real implementation
    // For demonstration purposes, we'll just log this action
    console.log(`Mimicking session from ${timestamp}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Internal notes and activity logs about this resident
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notes">
          <TabsList className="mb-4">
            <TabsTrigger value="notes">Manual Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes">
            {filteredNotes.length > 0 ? (
              <div className="space-y-4">
                {filteredNotes.map((note, i) => (
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
                {searchTerm ? "No matching notes found." : "No notes available"}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            {filteredActivityLogs.length > 0 ? (
              <div className="space-y-3">
                {filteredActivityLogs.map((log, i) => (
                  <div key={i} className="border rounded-lg p-3 flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          <p className="font-medium">{log.activity}</p>
                          <Badge variant="outline" className="text-xs">
                            {log.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                      </div>
                      {log.details && (
                        <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                      )}
                      
                      {/* Add mimic session button for login activities */}
                      {log.type === 'login' && (
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleMimicSession(log.timestamp, log.details)}
                            className="flex items-center text-xs"
                            variant="outline"
                          >
                            <LogIn className="h-3 w-3 mr-1" />
                            Mimic Session
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No matching activity found." : "No activity logs available"}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t p-4">
        Activity logs are automatically generated and cannot be modified
      </CardFooter>
    </Card>
  );
};

export default NotesTab;
