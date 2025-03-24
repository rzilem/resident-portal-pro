
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  Mail,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="grid gap-4 md:gap-6 mb-6">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome back, Alex!</h2>
        <p className="text-muted-foreground">Here's what's happening in your community today.</p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Due Soon', value: '$1,250.00', desc: 'Next payment on June 15', icon: CreditCard, color: 'bg-blue-50 text-blue-600' },
          { title: 'Announcements', value: '2 New', desc: 'Since your last visit', icon: Bell, color: 'bg-amber-50 text-amber-600' },
          { title: 'Open Requests', value: '1 Open', desc: 'Response required', icon: Mail, color: 'bg-green-50 text-green-600' },
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
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="animate-fade-in animate-delay-200">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Community events for the next 14 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Board Meeting', date: 'June 15, 2023', time: '7:00 PM', location: 'Community Room' },
                { title: 'Pool Opening Party', date: 'June 18, 2023', time: '1:00 PM', location: 'Pool Area' },
                { title: 'Landscaping Committee', date: 'June 22, 2023', time: '6:30 PM', location: 'Virtual Meeting' },
              ].map((event, i) => (
                <div key={i} className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in animate-delay-300">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>
              Latest updates from your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Summer Pool Hours', date: 'June 10, 2023', desc: 'The pool will be open daily from 9:00 AM to 9:00 PM starting June 15th.' },
                { title: 'Road Maintenance', date: 'June 8, 2023', desc: 'Scheduled road repairs will take place next week. Please avoid parking on Main Street.' },
              ].map((announcement, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0 border-border">
                  <h4 className="text-sm font-medium">{announcement.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{announcement.date}</p>
                  <p className="text-sm">{announcement.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
