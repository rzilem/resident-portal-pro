import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCalendarSettings } from '@/hooks/calendar/use-calendar-settings';
import { toast } from 'sonner';
import { AssociationCalendarSettings, CalendarViewSettings } from '@/types/calendar';
import { useAssociations } from '@/hooks/use-associations';

const CalendarSettings = () => {
  const navigate = useNavigate();
  const { associations, activeAssociation } = useAssociations();
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | undefined>(
    activeAssociation?.id
  );

  const { 
    calendarSettings, 
    error, 
    fetchCalendarSettings, 
    updateCalendarSettings 
  } = useCalendarSettings({ 
    associationId: selectedAssociationId 
  });

  const [localSettings, setLocalSettings] = useState<AssociationCalendarSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedAssociationId) {
      setIsLoading(true);
      fetchCalendarSettings();
      setIsLoading(false);
    } else if (associations.length > 0 && !selectedAssociationId) {
      setSelectedAssociationId(associations[0].id);
    }
  }, [selectedAssociationId, fetchCalendarSettings, associations]);

  useEffect(() => {
    if (calendarSettings) {
      setLocalSettings(calendarSettings);
      setIsLoading(false);
    }
  }, [calendarSettings]);

  const handleAssociationChange = (id: string) => {
    setSelectedAssociationId(id);
  };

  const handleSaveSettings = () => {
    if (!localSettings) return;
    
    try {
      updateCalendarSettings(localSettings);
      toast.success('Calendar settings updated successfully');
    } catch (error) {
      toast.error('Failed to update calendar settings');
      console.error('Error updating calendar settings:', error);
    }
  };

  const handleViewSettingChange = (setting: keyof CalendarViewSettings, value: any) => {
    if (!localSettings) return;
    
    setLocalSettings({
      ...localSettings,
      viewSettings: {
        ...localSettings.viewSettings,
        [setting]: value
      }
    });
  };

  if (associations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading associations...</p>
      </div>
    );
  }

  if (!selectedAssociationId && associations.length > 0) {
    setSelectedAssociationId(associations[0].id);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Selecting default association...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading calendar settings...</p>
      </div>
    );
  }

  if (error && !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">Error loading calendar settings</p>
        <Button variant="outline" onClick={fetchCalendarSettings}>Retry</Button>
      </div>
    );
  }

  if (!localSettings && selectedAssociationId) {
    const defaultSettings: AssociationCalendarSettings = {
      associationId: selectedAssociationId,
      name: associations.find(a => a.id === selectedAssociationId)?.name || 'Association Calendar',
      description: 'Calendar for community events and meetings',
      defaultAccessLevel: 'residents',
      viewSettings: {
        defaultView: 'month',
        showWeekends: true,
        workdayStart: 9,
        workdayEnd: 17,
        firstDayOfWeek: 0
      },
      color: '#4f46e5',
      enabled: true
    };
    setLocalSettings(defaultSettings);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Creating default calendar settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Calendar Settings</h1>
      </div>

      {associations.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Select Association</h2>
            <Select 
              value={selectedAssociationId} 
              onValueChange={handleAssociationChange}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select an association" />
              </SelectTrigger>
              <SelectContent>
                {associations.map((association) => (
                  <SelectItem key={association.id} value={association.id}>
                    {association.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {localSettings && (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Calendar Information</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Calendar Name</Label>
                  <Input 
                    id="name" 
                    value={localSettings.name} 
                    onChange={(e) => setLocalSettings({...localSettings, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={localSettings.description || ''} 
                    onChange={(e) => setLocalSettings({...localSettings, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Calendar Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="color" 
                      type="color"
                      className="w-16 h-10"
                      value={localSettings.color || '#4f46e5'} 
                      onChange={(e) => setLocalSettings({...localSettings, color: e.target.value})}
                    />
                    <span className="text-sm text-muted-foreground">
                      {localSettings.color || '#4f46e5'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled">Enable Calendar</Label>
                  <Switch 
                    id="enabled"
                    checked={localSettings.enabled}
                    onCheckedChange={(checked) => setLocalSettings({...localSettings, enabled: checked})}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="defaultView">Default View</Label>
                  <Select 
                    value={localSettings.viewSettings.defaultView} 
                    onValueChange={(value) => handleViewSettingChange('defaultView', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="firstDayOfWeek">First Day of Week</Label>
                  <Select 
                    value={localSettings.viewSettings.firstDayOfWeek.toString()} 
                    onValueChange={(value) => handleViewSettingChange('firstDayOfWeek', parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select first day of week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWeekends">Show Weekends</Label>
                  <Switch 
                    id="showWeekends"
                    checked={localSettings.viewSettings.showWeekends}
                    onCheckedChange={(checked) => handleViewSettingChange('showWeekends', checked)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="workdayStart">Workday Start (Hour)</Label>
                    <Select 
                      value={localSettings.viewSettings.workdayStart.toString()} 
                      onValueChange={(value) => handleViewSettingChange('workdayStart', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select workday start" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workdayEnd">Workday End (Hour)</Label>
                    <Select 
                      value={localSettings.viewSettings.workdayEnd.toString()} 
                      onValueChange={(value) => handleViewSettingChange('workdayEnd', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select workday end" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Access Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="defaultAccessLevel">Default Access Level</Label>
                  <Select 
                    value={localSettings.defaultAccessLevel} 
                    onValueChange={(value) => setLocalSettings({
                      ...localSettings, 
                      defaultAccessLevel: value as AssociationCalendarSettings['defaultAccessLevel']
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="residents">Residents Only</SelectItem>
                      <SelectItem value="board">Board Members Only</SelectItem>
                      <SelectItem value="committee">Committee Members</SelectItem>
                      <SelectItem value="admin">Administrators Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="flex justify-end gap-2 mt-8">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
    </div>
  );
};

export default CalendarSettings;
