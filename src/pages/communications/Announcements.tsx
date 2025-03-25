
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Edit, Eye, PlusCircle, Search, Trash, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Announcements = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Community Announcements</h2>
            <p className="text-muted-foreground">Manage announcements for your community</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Announcement
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/communications/messaging">
                <Send className="h-4 w-4" />
                Send Message
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Total Announcements', value: '24', desc: 'Last 30 days', icon: Bell, color: 'bg-blue-50 text-blue-600' },
          { title: 'Read Rate', value: '87%', desc: 'Average engagement', icon: Eye, color: 'bg-green-50 text-green-600' },
          { title: 'Scheduled', value: '3', desc: 'Upcoming announcements', icon: Bell, color: 'bg-amber-50 text-amber-600' },
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
              {[
                { title: 'Pool Opening Hours', date: '2023-06-10', property: 'All Properties', status: 'Published', views: 142 },
                { title: 'Road Maintenance Schedule', date: '2023-06-08', property: 'Willow Creek Estates', status: 'Published', views: 86 },
                { title: 'Community Meeting', date: '2023-06-15', property: 'Oakwood Heights', status: 'Scheduled', views: 0 },
                { title: 'Holiday Decoration Guidelines', date: '2023-06-01', property: 'All Properties', status: 'Published', views: 203 },
                { title: 'Water Service Interruption', date: '2023-06-18', property: 'Riverfront Towers', status: 'Scheduled', views: 0 },
                { title: 'New Resident Welcome', date: '2023-05-28', property: 'Pine Valley Community', status: 'Published', views: 34 },
              ].map((announcement, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{announcement.date}</TableCell>
                  <TableCell>{announcement.property}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      announcement.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {announcement.status}
                    </span>
                  </TableCell>
                  <TableCell>{announcement.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
