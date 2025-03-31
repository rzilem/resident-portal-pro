
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Calendar, Pin, Bell, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TooltipButton } from '@/components/ui/tooltip-button';
import AnnouncementDialog from '@/components/communications/announcements/AnnouncementDialog';
import AnnouncementCard from '@/components/communications/announcements/AnnouncementCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'maintenance' | 'meeting';
  startDate: string;
  endDate: string | null;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const Announcements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase or another API
      // Simulating data fetch with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample data
      const sampleAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Annual Community Meeting',
          content: 'Please join us for our annual community meeting on Saturday, July 15th at 10:00 AM in the community center. We will be discussing the budget for the upcoming year and electing new board members.',
          type: 'meeting',
          startDate: '2023-07-01',
          endDate: '2023-07-15',
          isPinned: true,
          isPublished: true,
          createdAt: '2023-06-15T10:00:00Z',
          updatedAt: '2023-06-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Pool Maintenance Schedule',
          content: 'The community pool will be closed for maintenance from Monday, July 3rd to Wednesday, July 5th. We apologize for any inconvenience this may cause.',
          type: 'maintenance',
          startDate: '2023-06-25',
          endDate: '2023-07-05',
          isPinned: false,
          isPublished: true,
          createdAt: '2023-06-20T14:30:00Z',
          updatedAt: '2023-06-20T14:30:00Z'
        },
        {
          id: '3',
          title: 'Summer BBQ Event',
          content: 'Join us for our annual summer BBQ on Saturday, July 8th from 4:00 PM to 8:00 PM at the community park. Food and drinks will be provided. Please RSVP by July 5th.',
          type: 'event',
          startDate: '2023-07-01',
          endDate: '2023-07-08',
          isPinned: true,
          isPublished: true,
          createdAt: '2023-06-25T09:15:00Z',
          updatedAt: '2023-06-25T09:15:00Z'
        },
        {
          id: '4',
          title: 'Water Outage Notice',
          content: 'Due to emergency repairs, there will be a water outage on Tuesday, June 27th from 9:00 AM to 1:00 PM. Please plan accordingly.',
          type: 'urgent',
          startDate: '2023-06-26',
          endDate: '2023-06-27',
          isPinned: false,
          isPublished: true,
          createdAt: '2023-06-26T08:00:00Z',
          updatedAt: '2023-06-26T08:00:00Z'
        }
      ];
      
      setAnnouncements(sampleAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    setEditingAnnouncement(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };
  
  const handleSave = async (announcement: Announcement) => {
    try {
      // In a real app, this would save to Supabase or another API
      if (editingAnnouncement) {
        // Update existing announcement
        const updatedAnnouncements = announcements.map(a => 
          a.id === announcement.id ? announcement : a
        );
        setAnnouncements(updatedAnnouncements);
        toast.success('Announcement updated successfully');
      } else {
        // Create new announcement with a simple ID
        const newAnnouncement = {
          ...announcement,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setAnnouncements([newAnnouncement, ...announcements]);
        toast.success('Announcement created successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Failed to save announcement');
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      // In a real app, this would delete from Supabase or another API
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };
  
  const handleTogglePin = async (id: string) => {
    try {
      // In a real app, this would update in Supabase or another API
      const updatedAnnouncements = announcements.map(a => 
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      );
      setAnnouncements(updatedAnnouncements);
      const isPinned = updatedAnnouncements.find(a => a.id === id)?.isPinned;
      toast.success(`Announcement ${isPinned ? 'pinned' : 'unpinned'} successfully`);
    } catch (error) {
      console.error('Error toggling pin status:', error);
      toast.error('Failed to update announcement pin status');
    }
  };
  
  const filteredAnnouncements = announcements.filter(announcement => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab selection
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pinned') return announcement.isPinned && matchesSearch;
    return announcement.type === activeTab && matchesSearch;
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Announcements</h1>
          <p className="text-muted-foreground">
            Create and manage community announcements
          </p>
        </div>
        
        <div className="flex gap-2">
          <TooltipButton 
            onClick={() => navigate('/communications/messaging')}
            variant="outline"
            tooltipText="Go to messaging"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Messaging
          </TooltipButton>
          
          <TooltipButton
            onClick={handleCreateNew}
            tooltipText="Create new announcement"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </TooltipButton>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Community Announcements</CardTitle>
          <CardDescription>
            Important information and updates for community members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 overflow-auto pb-px flex flex-nowrap h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pinned">
                  <Pin className="h-4 w-4 mr-2" />
                  Pinned
                </TabsTrigger>
                <TabsTrigger value="urgent">
                  <Bell className="h-4 w-4 mr-2" />
                  Urgent
                </TabsTrigger>
                <TabsTrigger value="event">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="meeting">Meetings</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredAnnouncements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAnnouncements.map(announcement => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `No announcements match "${searchQuery}"` 
                    : activeTab !== 'all' 
                      ? `No ${activeTab} announcements found` 
                      : 'No announcements available'}
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleCreateNew} 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AnnouncementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        announcement={editingAnnouncement}
        onSave={handleSave}
      />
    </div>
  );
};

export default Announcements;
