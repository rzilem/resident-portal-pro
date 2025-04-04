
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import CalendarView from '@/components/calendar/CalendarView';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import CalendarEventDialog from '@/components/calendar/CalendarEventDialog';
import { useAssociations } from '@/hooks/use-associations';
import { useAuthRole } from '@/hooks/use-auth-role';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
          <TooltipButton
            variant="outline"
            onClick={() => navigate('/settings')}
            tooltipText="Configure calendar settings"
          >
            <Settings className="h-4 w-4 mr-2" />
            Calendar Settings
          </TooltipButton>
          
          <TooltipButton
            onClick={() => setShowCreateEvent(true)}
            tooltipText="Create a new calendar event"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </TooltipButton>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="association">Association Calendar</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-50">
                <p>View events specific to this association</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="global">Global Calendar</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-50">
                <p>View events across all associations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        
        <TabsContent value="association" className="min-h-[500px]">
          {currentUser && (
            <CalendarView 
              userId={currentUser.id}
              userAccessLevel={userAccessLevel}
              associationId={activeAssociation?.id}
              isGlobalAdmin={false}
              associations={associations}
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
              associations={associations}
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
          associations={activeTab === 'global' ? associations : undefined}
        />
      )}
    </div>
  );
};

export default Calendar;
