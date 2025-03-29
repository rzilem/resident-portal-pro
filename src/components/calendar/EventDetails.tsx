
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, AlertTriangle, Edit, Trash2, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CalendarEventDialog from './CalendarEventDialog';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (updatedEvent: Partial<CalendarEvent>) => void;
  onDelete: () => void;
  userAccessLevel: CalendarAccessLevel;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
  userAccessLevel
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Event type styles
  const typeColors: Record<string, string> = {
    'meeting': 'bg-blue-100 text-blue-800 border-blue-300',
    'maintenance': 'bg-amber-100 text-amber-800 border-amber-300',
    'holiday': 'bg-red-100 text-red-800 border-red-300',
    'deadline': 'bg-purple-100 text-purple-800 border-purple-300',
    'workflow': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'community': 'bg-green-100 text-green-800 border-green-300',
    'custom': 'bg-gray-100 text-gray-800 border-gray-300'
  };
  
  const canEdit = userAccessLevel === 'admin' || event.createdBy === userAccessLevel;
  
  const handleDelete = () => {
    onDelete();
    setShowDeleteAlert(false);
  };
  
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMMM d, yyyy');
  };
  
  const formatTime = (date: Date | string) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'h:mm a');
  };
  
  return (
    <>
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
            <div className="flex mt-2 gap-2 flex-wrap">
              <Badge className={typeColors[event.type] || 'bg-gray-100'}>
                {event.type}
              </Badge>
              {event.accessLevel && (
                <Badge variant="outline">
                  Visibility: {event.accessLevel}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {event.description && (
              <div className="text-sm">
                {event.description}
              </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(event.start)}</span>
              {event.end && (
                <span> - {formatDate(event.end)}</span>
              )}
            </div>
            
            {!event.allDay && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatTime(event.start)}</span>
                {event.end && (
                  <span> - {formatTime(event.end)}</span>
                )}
              </div>
            )}
            
            {event.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.workflowId && (
              <div className="flex items-center text-sm mt-2 rounded-md p-2 bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>This event is associated with a workflow (ID: {event.workflowId})</span>
              </div>
            )}
            
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.attendees.length} Attendees</span>
              </div>
            )}
          </div>
        </CardContent>
        {canEdit && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteAlert(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {showEditDialog && (
        <CalendarEventDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={(updates) => {
            onEdit(updates);
            setShowEditDialog(false);
          }}
          associationId={event.associationId}
          userAccessLevel={userAccessLevel}
          editEvent={event}
        />
      )}
    </>
  );
};

export default EventDetails;
