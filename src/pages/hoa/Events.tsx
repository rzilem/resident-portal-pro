
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Events = () => {
  const events = [
    { id: 1, title: 'Annual Meeting', date: '2025-04-10', time: '18:00', location: 'Community Center' },
    { id: 2, title: 'Pool Party', date: '2025-06-15', time: '14:00', location: 'Pool Area' },
    { id: 3, title: 'Board Meeting', date: '2025-04-20', time: '19:00', location: 'Community Room' },
    { id: 4, title: 'Community Cleanup', date: '2025-05-05', time: '09:00', location: 'Common Areas' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Events</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Title</th>
                  <th className="p-3 font-medium text-gray-600">Date</th>
                  <th className="p-3 font-medium text-gray-600">Time</th>
                  <th className="p-3 font-medium text-gray-600">Location</th>
                  <th className="p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
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
          
          <div className="mt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Create Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
