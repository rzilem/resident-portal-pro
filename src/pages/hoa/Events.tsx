
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Download, 
  MapPin, 
  Plus, 
  Search, 
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: "Meeting" | "Social" | "Maintenance" | "Holiday" | "Other";
}

const Events = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    { 
      id: 1, 
      title: 'Annual HOA Meeting', 
      description: 'Annual meeting to discuss budget and elect new board members',
      date: '2025-04-10', 
      time: '18:00', 
      location: 'Community Clubhouse',
      attendees: 45,
      category: 'Meeting'
    },
    { 
      id: 2, 
      title: 'Summer Pool Party', 
      description: 'Community pool opening celebration with food and games',
      date: '2025-06-15', 
      time: '14:00', 
      location: 'Community Pool',
      attendees: 85,
      category: 'Social'
    },
    { 
      id: 3, 
      title: 'Landscaping Day', 
      description: 'Community volunteers helping with spring landscaping',
      date: '2025-05-08', 
      time: '09:00', 
      location: 'Community Garden',
      attendees: 20,
      category: 'Maintenance'
    },
    { 
      id: 4, 
      title: 'Holiday Decoration Contest', 
      description: 'Annual holiday decoration competition with prizes',
      date: '2025-12-15', 
      time: '17:00', 
      location: 'Throughout Community',
      attendees: 40,
      category: 'Holiday'
    },
    { 
      id: 5, 
      title: 'Board Meeting', 
      description: 'Monthly board meeting to discuss community matters',
      date: '2025-04-25', 
      time: '19:00', 
      location: 'Community Clubhouse',
      attendees: 12,
      category: 'Meeting'
    },
  ]);

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Meeting':
        return 'bg-blue-100 text-blue-800';
      case 'Social':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'Holiday':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateEvent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to create new events will be available in the next update.",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Events</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <div className="p-2 bg-blue-50 rounded-full">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{events.length}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Next Event</p>
              <div className="p-2 bg-orange-50 rounded-full">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-xl font-bold text-orange-600">{sortedEvents[0]?.title || "No upcoming events"}</p>
            <p className="text-sm text-gray-500">
              {sortedEvents[0] 
                ? `${new Date(sortedEvents[0].date).toLocaleDateString()} at ${sortedEvents[0].time}`
                : ""}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Expected Attendance</p>
              <div className="p-2 bg-green-50 rounded-full">
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {events.reduce((total, event) => total + event.attendees, 0)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Events List */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Upcoming Events</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Calendar
            </Button>
            <Button 
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleCreateEvent}
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Event</th>
                  <th className="p-3 font-medium text-gray-600">Date & Time</th>
                  <th className="p-3 font-medium text-gray-600">Location</th>
                  <th className="p-3 font-medium text-gray-600">Category</th>
                  <th className="p-3 font-medium text-gray-600">Attendees</th>
                  <th className="p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{event.time}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getCategoryColor(event.category)}`}
                      >
                        {event.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{event.attendees} people</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">Showing {sortedEvents.length} of {events.length} events</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
