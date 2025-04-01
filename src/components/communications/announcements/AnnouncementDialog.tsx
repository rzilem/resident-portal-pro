
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Announcement } from '@/pages/communications/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface AnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Announcement) => Promise<void>;
  announcement?: Announcement | null;
  isEdit?: boolean;
}

const ANNOUNCEMENT_TYPES = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'event', label: 'Event' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'general', label: 'General' }
] as const;

type AnnouncementType = typeof ANNOUNCEMENT_TYPES[number]['value'];

const AnnouncementDialog: React.FC<AnnouncementDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  announcement,
  isEdit = false
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AnnouncementType>('general');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog is opened or announcement changes
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setType(announcement.type as AnnouncementType);
      setStartDate(announcement.startDate.substring(0, 10));
      setEndDate(announcement.endDate?.substring(0, 10) || '');
      setIsPinned(announcement.isPinned);
      setIsPublished(announcement.isPublished);
    } else {
      // Default values for new announcement
      setTitle('');
      setContent('');
      setType('general');
      setStartDate(new Date().toISOString().substring(0, 10));
      setEndDate('');
      setIsPinned(false);
      setIsPublished(true);
    }
  }, [announcement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !startDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const newAnnouncement: Announcement = {
        id: announcement?.id || uuidv4(),
        title,
        content,
        type,
        startDate: startDate,
        endDate: endDate || undefined,
        isPinned,
        isPublished,
        authorId: announcement?.authorId || 'current-user', // This would normally come from auth context
        authorName: announcement?.authorName || 'Current User', // This would normally come from auth context
        createdAt: announcement?.createdAt || now,
        updatedAt: now
      };
      
      await onSave(newAnnouncement);
      onClose();
      toast.success(`Announcement ${isEdit ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} announcement`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter announcement content"
              rows={5}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as AnnouncementType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ANNOUNCEMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="isPinned" 
                checked={isPinned} 
                onCheckedChange={setIsPinned} 
              />
              <Label htmlFor="isPinned">Pin Announcement</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isPublished" 
                checked={isPublished} 
                onCheckedChange={setIsPublished} 
              />
              <Label htmlFor="isPublished">Publish Immediately</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
