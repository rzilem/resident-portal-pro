
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Announcement } from '@/pages/communications/types';

export interface AnnouncementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
  onSave: (announcement: Announcement) => Promise<void>;
}

const AnnouncementDialog: React.FC<AnnouncementDialogProps> = ({
  isOpen,
  onOpenChange,
  announcement,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens or announcement changes
  useEffect(() => {
    if (isOpen) {
      if (announcement) {
        setTitle(announcement.title);
        setContent(announcement.content);
        setStartDate(announcement.startDate);
        setEndDate(announcement.endDate || '');
        setType(announcement.type);
        setIsPinned(announcement.isPinned);
        setIsPublished(announcement.isPublished);
      } else {
        setTitle('');
        setContent('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setType('general');
        setIsPinned(false);
        setIsPublished(true);
      }
    }
  }, [isOpen, announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const announcementData: Announcement = {
        id: announcement?.id || '',
        title,
        content,
        type,
        authorId: announcement?.authorId || 'current-user',
        authorName: announcement?.authorName,
        createdAt: announcement?.createdAt || new Date().toISOString(),
        startDate,
        endDate: endDate || undefined,
        isPinned,
        isPublished
      };
      
      await onSave(announcementData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Edit Announcement' : 'Create New Announcement'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>
          
          <div>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pinned">Pin Announcement</Label>
                <Switch 
                  id="pinned" 
                  checked={isPinned} 
                  onCheckedChange={setIsPinned} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Publish Immediately</Label>
                <Switch 
                  id="published" 
                  checked={isPublished} 
                  onCheckedChange={setIsPublished} 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : announcement ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
