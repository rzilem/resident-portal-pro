
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "@/components/calendar/CalendarView";
import { useAuthRole } from "@/hooks/use-auth-role";
import { format } from "date-fns";

const Events = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { currentUser, isManager } = useAuthRole();
  
  // Mock events data - in a real application, this would come from your API
  const events = [
    { id: 1, title: 'Annual Meeting', date: '2025-04-10', time: '18:00', location: 'Community Center' },
    { id: 2, title: 'Pool Party', date: '2025-06-15', time: '14:00', location: 'Pool Area' },
    { id: 3, title: 'Board Meeting', date: '2025-04-20', time: '19:00', location: 'Community Room' },
    { id: 4, title: 'Community Cleanup', date: '2025-05-05', time: '09:00', location: 'Common Areas' },
  ];

  // Navigate to previous/next month
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Events</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'calendar')} className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Title</th>
                      <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Date</th>
                      <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Time</th>
                      <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Location</th>
                      <th className="p-3 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                            <span>{event.title}</span>
                          </div>
                        </td>
                        <td className="p-3">{event.date}</td>
                        <td className="p-3">{event.time}</td>
                        <td className="p-3">{event.location}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-medium">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {currentUser && (
                <CalendarView 
                  userId={currentUser.id}
                  userAccessLevel={isManager ? 'admin' : 'residents'}
                  // For manager calendar, we don't pass an associationId
                  // This will make the component show events across all associations
                  isGlobalAdmin={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
