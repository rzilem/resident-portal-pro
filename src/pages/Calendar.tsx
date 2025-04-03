import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import CalendarView from '@/components/calendar/CalendarView';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import CalendarEventDialog from '@/components/calendar/CalendarEventDialog';
import { useAssociations } from '@/hooks/use-associations';
import { useAuthRole } from '@/hooks/use-auth-role';
import { adaptAssociationsToFullType } from '@/utils/type-adapters';

const Calendar = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const navigate = useNavigate();
  const { currentUser, isManager } = useAuthRole();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "association");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  
  // Get associations for the dropdown
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  
  // Log associations and active association to help with debugging
  useEffect(() => {
    console.log("Associations:", associations);
    console.log("Active Association:", activeAssociation);
  }, [associations, activeAssociation]);
  
  // Sync URL with tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/calendar?tab=${value}`);
  };
  
  // Default user access level based on role
  const userAccessLevel = isManager ? 'admin' as const : 'residents' as const;
  
  // Create event handler that respects the current tab (association vs global)
  const handleCreateEvent = (eventData: any) => {
    setShowCreateEvent(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Calendar Management</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/settings')}>
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
        
        <TabsContent value="association" className="min-h-[500px]">
          {currentUser && (
            <CalendarView 
              userId={currentUser.id}
              userAccessLevel={userAccessLevel}
              associationId={activeAssociation?.id}
              isGlobalAdmin={false}
              associations={adaptAssociationsToFullType(associations)}
              activeAssociation={activeAssociation}
              onAssociationChange={selectAssociation}
            />
          )}
        </TabsContent>
        
        <TabsContent value="global" className="min-h-[500px]">
          {currentUser && (
            <CalendarView 
              userId={currentUser.id}
              userAccessLevel={userAccessLevel}
              isGlobalAdmin={true}
              associations={adaptAssociationsToFullType(associations)}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {showCreateEvent && currentUser && (
        <CalendarEventDialog 
          open={showCreateEvent}
          onOpenChange={setShowCreateEvent}
          onSave={handleCreateEvent}
          associationId={activeTab === 'association' ? activeAssociation?.id : undefined}
          userAccessLevel={userAccessLevel}
          isGlobalView={activeTab === 'global'}
          associations={activeTab === 'global' ? adaptAssociationsToFullType(associations) : undefined}
        />
      )}
    </div>
  );
};

export default Calendar;
