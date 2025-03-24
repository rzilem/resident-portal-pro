
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bell, Calendar, CreditCard, FileText, Home, Mail, Menu, MessageSquare, Settings, User, Users, X } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Automatically close sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gradient">
              ResidentPro
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            <div className="space-y-1 mb-6">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase">
                Main
              </p>
              
              {[
                { icon: Home, name: 'Dashboard', active: true },
                { icon: FileText, name: 'Documents' },
                { icon: CreditCard, name: 'Payments' },
                { icon: Calendar, name: 'Calendar' },
                { icon: MessageSquare, name: 'Messages' },
              ].map((item) => (
                <Button
                  key={item.name}
                  variant={item.active ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
            
            <div className="space-y-1 mb-6">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase">
                Community
              </p>
              
              {[
                { icon: Users, name: 'Residents' },
                { icon: Bell, name: 'Announcements' },
                { icon: Mail, name: 'Requests' },
              ].map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </nav>
          
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2" 
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
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
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Dashboard;
