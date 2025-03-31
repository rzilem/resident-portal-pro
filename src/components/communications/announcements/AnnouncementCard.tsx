import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertTriangle,
  Calendar,
  Edit,
  Pin,
  PinOff,
  Eye,
  Trash2,
  Bell,
  MessageSquare,
  Wrench,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Announcement } from '@/pages/communications/Announcements';

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'meeting':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(announcement.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div 
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getTypeColor(announcement.type)}`}
              >
                {getTypeIcon(announcement.type)}
                <span className="capitalize">{announcement.type}</span>
              </div>
              {announcement.isPinned && (
                <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-base font-medium mt-2">{announcement.title}</h3>
        </CardHeader>
        <CardContent className="px-4 py-2 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {announcement.content}
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {announcement.endDate 
                ? `${formatDate(announcement.startDate)} - ${formatDate(announcement.endDate)}`
                : `From ${formatDate(announcement.startDate)}`}
            </span>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 flex gap-2 justify-between">
          <TooltipButton
            variant="outline"
            size="sm"
            onClick={() => setViewDialogOpen(true)}
            tooltipText="View announcement"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </TooltipButton>
          <div className="flex gap-2">
            <TooltipButton
              variant={announcement.isPinned ? "outline" : "ghost"}
              size="icon"
              onClick={() => onTogglePin(announcement.id)}
              tooltipText={announcement.isPinned ? "Unpin announcement" : "Pin announcement"}
              className="h-8 w-8"
            >
              {announcement.isPinned 
                ? <PinOff className="h-4 w-4" /> 
                : <Pin className="h-4 w-4" />}
            </TooltipButton>
            
            <TooltipButton
              variant="ghost"
              size="icon"
              onClick={() => onEdit(announcement)}
              tooltipText="Edit announcement"
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </TooltipButton>
            
            <TooltipButton
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              tooltipText="Delete announcement"
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </TooltipButton>
          </div>
        </CardFooter>
      </Card>

      {/* View Announcement Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <div 
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getTypeColor(announcement.type)}`}
              >
                {getTypeIcon(announcement.type)}
                <span className="capitalize">{announcement.type}</span>
              </div>
              {announcement.isPinned && (
                <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
            <DialogTitle>{announcement.title}</DialogTitle>
            <DialogDescription>
              {announcement.endDate 
                ? `${formatDate(announcement.startDate)} - ${formatDate(announcement.endDate)}`
                : `From ${formatDate(announcement.startDate)}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{announcement.content}</div>
          </div>
          
          <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <TooltipButton
                variant="outline"
                onClick={() => {
                  setViewDialogOpen(false);
                  onEdit(announcement);
                }}
                tooltipText="Edit announcement"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </TooltipButton>
              <TooltipButton
                variant={announcement.isPinned ? "outline" : "default"}
                onClick={() => {
                  onTogglePin(announcement.id);
                }}
                tooltipText={announcement.isPinned ? "Unpin announcement" : "Pin announcement"}
              >
                {announcement.isPinned 
                  ? <><PinOff className="h-4 w-4 mr-2" />Unpin</> 
                  : <><Pin className="h-4 w-4 mr-2" />Pin</>}
              </TooltipButton>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnnouncementCard;
