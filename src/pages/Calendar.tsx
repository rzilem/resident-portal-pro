
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import CalendarView from '@/components/calendar/CalendarView';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import CalendarEventDialog from '@/components/calendar/CalendarEventDialog';
import { useAssociations } from '@/hooks/use-associations';

const Calendar = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "association");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  
  // Get associations for the dropdown
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  
  // Sync URL with tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/calendar?tab=${value}`);
  };
  
  // Example user and access level - in a real app, this would come from authentication
  const userId = 'current-user';
  const userAccessLevel = 'admin' as const;
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Calendar Management</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/settings/calendar')}>
            <Settings className="h-4 w-4 mr-2" />
            Calendar Settings
          </Button>
          
          <Button onClick={() => setShowCreateEvent(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="association">Association Calendar</TabsTrigger>
          <TabsTrigger value="global">Global Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="association">
          <CalendarView 
            userId={userId}
            userAccessLevel={userAccessLevel}
            associationId={activeAssociation?.id}
            isGlobalAdmin={false}
            associations={associations}
            activeAssociation={activeAssociation}
            onAssociationChange={selectAssociation}
          />
        </TabsContent>
        
        <TabsContent value="global">
          <CalendarView 
            userId={userId}
            userAccessLevel={userAccessLevel}
            isGlobalAdmin={true}
          />
        </TabsContent>
      </Tabs>
      
      {showCreateEvent && (
        <CalendarEventDialog 
          open={showCreateEvent}
          onOpenChange={setShowCreateEvent}
          onSave={() => {}}
          associationId={activeTab === 'association' ? activeAssociation?.id : undefined}
          userAccessLevel={userAccessLevel}
        />
      )}
    </div>
  );
};

export default Calendar;
