
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Edit, Eye, PlusCircle, Search, Trash, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Announcement {
  id: string;
  title: string;
  date: string;
  property: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  views: number;
  content?: string;
}

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Pool Opening Hours', date: '2023-06-10', property: 'All Properties', status: 'Published', views: 142, content: 'The community pool will be open daily from 8am to 8pm starting June 15th.' },
  { id: '2', title: 'Road Maintenance Schedule', date: '2023-06-08', property: 'Willow Creek Estates', status: 'Published', views: 86, content: 'Road maintenance will take place on June 20-22. Please avoid parking on the streets during this time.' },
  { id: '3', title: 'Community Meeting', date: '2023-06-15', property: 'Oakwood Heights', status: 'Scheduled', views: 0, content: 'The next community meeting will be held in the clubhouse on June 30th at 7pm.' },
  { id: '4', title: 'Holiday Decoration Guidelines', date: '2023-06-01', property: 'All Properties', status: 'Published', views: 203, content: 'Please review the updated holiday decoration guidelines for the upcoming season.' },
  { id: '5', title: 'Water Service Interruption', date: '2023-06-18', property: 'Riverfront Towers', status: 'Scheduled', views: 0, content: 'Water service will be interrupted on June 25th from 9am to 12pm for maintenance.' },
  { id: '6', title: 'New Resident Welcome', date: '2023-05-28', property: 'Pine Valley Community', status: 'Published', views: 34, content: 'Please join us in welcoming our new residents at the community social on July 1st.' },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(SAMPLE_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    property: 'All Properties',
    status: 'Draft'
  });

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    const id = Date.now().toString();
    const today = new Date().toISOString().split('T')[0];
    
    const announcement: Announcement = {
      id,
      title: newAnnouncement.title,
      date: today,
      property: newAnnouncement.property,
      status: newAnnouncement.status as 'Published' | 'Scheduled' | 'Draft',
      views: 0,
      content: newAnnouncement.content
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      property: 'All Properties',
      status: 'Draft'
    });
    setIsCreateDialogOpen(false);
    
    toast.success("Announcement created", {
      description: `"${announcement.title}" has been created successfully.`
    });
  };

  const handleEdit = () => {
    if (selectedAnnouncement) {
      const updatedAnnouncements = announcements.map(a => 
        a.id === selectedAnnouncement.id ? selectedAnnouncement : a
      );
      setAnnouncements(updatedAnnouncements);
      setEditDialogOpen(false);
      
      toast.success("Announcement updated", {
        description: `"${selectedAnnouncement.title}" has been updated successfully.`
      });
    }
  };

  const handleDelete = (id: string) => {
    const announcementToDelete = announcements.find(a => a.id === id);
    if (!announcementToDelete) return;
    
    const updatedAnnouncements = announcements.filter(a => a.id !== id);
    setAnnouncements(updatedAnnouncements);
    
    toast.success("Announcement deleted", {
      description: `"${announcementToDelete.title}" has been deleted successfully.`
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Community Announcements</h2>
            <p className="text-muted-foreground">Manage announcements for your community</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <TooltipButton className="gap-2" tooltipText="Create a new announcement">
                  <PlusCircle className="h-4 w-4" />
                  New Announcement
                </TooltipButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Add a new announcement to share with your community.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Announcement title"
                      className="col-span-3"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="property" className="text-right">
                      Property
                    </Label>
                    <Select 
                      value={newAnnouncement.property}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, property: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Properties">All Properties</SelectItem>
                        <SelectItem value="Willow Creek Estates">Willow Creek Estates</SelectItem>
                        <SelectItem value="Oakwood Heights">Oakwood Heights</SelectItem>
                        <SelectItem value="Riverfront Towers">Riverfront Towers</SelectItem>
                        <SelectItem value="Pine Valley Community">Pine Valley Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select 
                      value={newAnnouncement.status}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, status: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="content" className="text-right pt-2">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Announcement content"
                      className="col-span-3"
                      rows={5}
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Create Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <TooltipButton variant="outline" className="gap-2" asChild tooltipText="Send a message to community">
              <Link to="/communications/messaging">
                <Send className="h-4 w-4" />
                Send Message
              </Link>
            </TooltipButton>
          </div>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Total Announcements', value: announcements.length.toString(), desc: 'Last 30 days', icon: Bell, color: 'bg-blue-50 text-blue-600' },
          { title: 'Read Rate', value: '87%', desc: 'Average engagement', icon: Eye, color: 'bg-green-50 text-green-600' },
          { title: 'Scheduled', value: announcements.filter(a => a.status === 'Scheduled').length.toString(), desc: 'Upcoming announcements', icon: Bell, color: 'bg-amber-50 text-amber-600' },
        ].map((item, i) => (
          <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className={`${item.color} p-2 rounded-full`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>
            View and manage community announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search announcements..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{announcement.date}</TableCell>
                  <TableCell>{announcement.property}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      announcement.status === 'Published' ? 'bg-green-100 text-green-800' : 
                      announcement.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.status}
                    </span>
                  </TableCell>
                  <TableCell>{announcement.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipButton variant="ghost" size="icon" tooltipText="View announcement" onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setViewDialogOpen(true);
                      }}>
                        <Eye className="h-4 w-4" />
                      </TooltipButton>
                      <TooltipButton variant="ghost" size="icon" tooltipText="Edit announcement" onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setEditDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4" />
                      </TooltipButton>
                      <TooltipButton 
                        variant="ghost" 
                        size="icon" 
                        tooltipText="Delete announcement"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </TooltipButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAnnouncements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No announcements found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Announcement Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              Published on {selectedAnnouncement?.date} • {selectedAnnouncement?.property}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm whitespace-pre-wrap">
              {selectedAnnouncement?.content}
            </p>
          </div>
          <DialogFooter>
            <div className="flex items-center text-sm text-muted-foreground mr-auto">
              <Eye className="h-4 w-4 mr-2" /> {selectedAnnouncement?.views} views
            </div>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Make changes to the announcement details.
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  placeholder="Announcement title"
                  className="col-span-3"
                  value={selectedAnnouncement.title}
                  onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-property" className="text-right">
                  Property
                </Label>
                <Select 
                  value={selectedAnnouncement.property}
                  onValueChange={(value) => setSelectedAnnouncement({...selectedAnnouncement, property: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Properties">All Properties</SelectItem>
                    <SelectItem value="Willow Creek Estates">Willow Creek Estates</SelectItem>
                    <SelectItem value="Oakwood Heights">Oakwood Heights</SelectItem>
                    <SelectItem value="Riverfront Towers">Riverfront Towers</SelectItem>
                    <SelectItem value="Pine Valley Community">Pine Valley Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={selectedAnnouncement.status}
                  onValueChange={(value) => setSelectedAnnouncement({
                    ...selectedAnnouncement, 
                    status: value as 'Published' | 'Scheduled' | 'Draft'
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  placeholder="Announcement content"
                  className="col-span-3"
                  rows={5}
                  value={selectedAnnouncement.content || ''}
                  onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, content: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcements;
