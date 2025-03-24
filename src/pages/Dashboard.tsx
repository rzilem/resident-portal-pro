
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleUser, Home, Users, Calendar, BarChart3, BellRing } from 'lucide-react';
import SearchAssociations from '@/components/SearchAssociations';

const Dashboard = () => {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-4 space-y-4 md:space-y-6">
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-muted-foreground">Here's what's happening in your communities today</p>
              </div>
            </div>
          </section>
          
          <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {[
              { title: 'Total Properties', value: '12', desc: 'Across 3 communities', icon: Home, color: 'bg-blue-50 text-blue-600' },
              { title: 'Active Residents', value: '418', desc: '8 new this month', icon: Users, color: 'bg-green-50 text-green-600' },
              { title: 'Upcoming Events', value: '7', desc: 'Next: Board Meeting', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
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
          
          <SearchAssociations />
          
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Latest Activity</CardTitle>
                <CardDescription>Recent updates from your communities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'New maintenance request submitted', desc: 'Unit 302 - Plumbing issue reported', time: '2 hours ago', icon: BellRing, color: 'bg-amber-50 text-amber-600' },
                    { title: 'Board meeting minutes uploaded', desc: 'March 2025 Meeting - Approved', time: '1 day ago', icon: CircleUser, color: 'bg-blue-50 text-blue-600' },
                    { title: 'Budget report generated', desc: 'Q1 2025 - Financial summary', time: '2 days ago', icon: BarChart3, color: 'bg-green-50 text-green-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className={`${item.color} p-2 rounded-full mr-4 mt-0.5`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
        
        <div className="col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your schedule for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Board Meeting', location: 'Community Center', date: 'Mar 26, 7:00 PM', color: 'border-l-4 border-blue-500 pl-4' },
                  { title: 'Pool Maintenance', location: 'Swimming Pool Area', date: 'Mar 28, 9:00 AM', color: 'border-l-4 border-amber-500 pl-4' },
                  { title: 'Garden Committee', location: 'Courtyard', date: 'Mar 30, 10:00 AM', color: 'border-l-4 border-green-500 pl-4' },
                ].map((event, i) => (
                  <div key={i} className={`p-3 bg-muted/40 rounded-md ${event.color}`}>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                    <p className="text-xs font-medium mt-2">{event.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent alerts and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Parking Rule Update', desc: 'New visitor parking policy effective April 1', time: '3 hours ago' },
                  { title: 'Maintenance Alert', desc: 'Water shut-off scheduled for March 29, 9AM-12PM', time: '1 day ago' },
                  { title: 'Payment Confirmation', desc: 'March HOA dues payment received', time: '2 days ago' },
                ].map((notification, i) => (
                  <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.desc}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
