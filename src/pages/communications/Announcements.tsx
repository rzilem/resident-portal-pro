
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Announcement } from '@/pages/communications/types';
import AnnouncementCard from '@/components/communications/announcements/AnnouncementCard';
import AnnouncementDialog from '@/components/communications/announcements/AnnouncementDialog';
import { toast } from 'sonner';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For demo purposes, let's add some sample announcements
    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Community Pool Maintenance',
        content: 'The community pool will be closed for maintenance from June 15th to June 17th. We apologize for any inconvenience this may cause.',
        type: 'maintenance',
        authorId: 'admin1',
        authorName: 'John Smith',
        createdAt: '2023-06-01T10:00:00Z',
        startDate: '2023-06-15',
        endDate: '2023-06-17',
        isPinned: true,
        isPublished: true
      },
      {
        id: '2',
        title: 'Annual HOA Meeting',
        content: 'The annual HOA meeting will be held on July 10th at 7:00 PM in the community center. All residents are encouraged to attend as we will be discussing important community matters and electing new board members.',
        type: 'meeting',
        authorId: 'admin1',
        authorName: 'John Smith',
        createdAt: '2023-06-05T14:30:00Z',
        startDate: '2023-07-10',
        isPinned: false,
        isPublished: true
      },
      {
        id: '3',
        title: 'New Community Website',
        content: 'We are excited to announce the launch of our new community website! The website includes features such as online payment options, maintenance request submissions, and a community forum.',
        type: 'general',
        authorId: 'admin2',
        authorName: 'Sarah Johnson',
        createdAt: '2023-06-10T09:15:00Z',
        startDate: '2023-06-10',
        isPinned: false,
        isPublished: true
      }
    ];
    
    setAnnouncements(sampleAnnouncements);
  }, []);

  const handleCreateAnnouncement = async (announcement: Announcement) => {
    setLoading(true);
    try {
      // In a real application, you would send this to an API
      const newAnnouncement = {
        ...announcement,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        authorId: 'current-user-id',
        authorName: 'Current User',
      };
      
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setDialogOpen(false);
      toast.success('Announcement created successfully');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnnouncement = async (announcement: Announcement) => {
    setLoading(true);
    try {
      // In a real application, you would send this to an API
      setAnnouncements(prev => 
        prev.map(a => a.id === announcement.id ? announcement : a)
      );
      setDialogOpen(false);
      toast.success('Announcement updated successfully');
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      // In a real application, you would send this to an API
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(prev => 
      prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a)
    );
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleSaveAnnouncement = async (announcement: Announcement) => {
    if (selectedAnnouncement) {
      await handleUpdateAnnouncement(announcement);
    } else {
      await handleCreateAnnouncement(announcement);
    }
  };

  // Sort announcements: pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Announcements</h1>
          <p className="text-muted-foreground">
            Create and manage announcements for community members
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedAnnouncement(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>
      
      {sortedAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center py-8">
            <p className="text-muted-foreground">
              No announcements available. Create your first announcement to get started.
            </p>
          </CardContent>
        </Card>
      )}

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
        onSave={handleSaveAnnouncement}
      />
    </div>
  );
};

export default Announcements;
