
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const CalendarFilters = () => {
  const [filters, setFilters] = useState({
    eventTypes: {
      meeting: true,
      maintenance: true,
      holiday: true,
      deadline: true,
      workflow: true,
      community: true,
      custom: true
    },
    accessLevels: {
      public: true,
      residents: true,
      board: true,
      committee: true,
      admin: true
    }
  });
  
  const handleEventTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      eventTypes: {
        ...prev.eventTypes,
        [type]: !prev.eventTypes[type as keyof typeof prev.eventTypes]
      }
    }));
  };
  
  const handleAccessLevelChange = (level: string) => {
    setFilters(prev => ({
      ...prev,
      accessLevels: {
        ...prev.accessLevels,
        [level]: !prev.accessLevels[level as keyof typeof prev.accessLevels]
      }
    }));
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Event Types</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="meeting" 
                  checked={filters.eventTypes.meeting}
                  onCheckedChange={() => handleEventTypeChange('meeting')}
                />
                <Label htmlFor="meeting" className="flex items-center space-x-2">
                  <span>Meetings</span>
                  <Badge variant="outline" className="bg-blue-100">Meeting</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="maintenance" 
                  checked={filters.eventTypes.maintenance}
                  onCheckedChange={() => handleEventTypeChange('maintenance')}
                />
                <Label htmlFor="maintenance" className="flex items-center space-x-2">
                  <span>Maintenance</span>
                  <Badge variant="outline" className="bg-amber-100">Maintenance</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="holiday" 
                  checked={filters.eventTypes.holiday}
                  onCheckedChange={() => handleEventTypeChange('holiday')}
                />
                <Label htmlFor="holiday" className="flex items-center space-x-2">
                  <span>Holidays</span>
                  <Badge variant="outline" className="bg-red-100">Holiday</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="deadline" 
                  checked={filters.eventTypes.deadline}
                  onCheckedChange={() => handleEventTypeChange('deadline')}
                />
                <Label htmlFor="deadline" className="flex items-center space-x-2">
                  <span>Deadlines</span>
                  <Badge variant="outline" className="bg-indigo-100">Deadline</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="workflow" 
                  checked={filters.eventTypes.workflow}
                  onCheckedChange={() => handleEventTypeChange('workflow')}
                />
                <Label htmlFor="workflow" className="flex items-center space-x-2">
                  <span>Workflows</span>
                  <Badge variant="outline" className="bg-purple-100">Workflow</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="community" 
                  checked={filters.eventTypes.community}
                  onCheckedChange={() => handleEventTypeChange('community')}
                />
                <Label htmlFor="community" className="flex items-center space-x-2">
                  <span>Community Events</span>
                  <Badge variant="outline" className="bg-green-100">Community</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="custom" 
                  checked={filters.eventTypes.custom}
                  onCheckedChange={() => handleEventTypeChange('custom')}
                />
                <Label htmlFor="custom" className="flex items-center space-x-2">
                  <span>Custom Events</span>
                  <Badge variant="outline" className="bg-gray-100">Custom</Badge>
                </Label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Access Levels</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="public" 
                  checked={filters.accessLevels.public}
                  onCheckedChange={() => handleAccessLevelChange('public')}
                />
                <Label htmlFor="public">Public</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="residents" 
                  checked={filters.accessLevels.residents}
                  onCheckedChange={() => handleAccessLevelChange('residents')}
                />
                <Label htmlFor="residents">Residents Only</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="committee" 
                  checked={filters.accessLevels.committee}
                  onCheckedChange={() => handleAccessLevelChange('committee')}
                />
                <Label htmlFor="committee">Committee Members</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="board" 
                  checked={filters.accessLevels.board}
                  onCheckedChange={() => handleAccessLevelChange('board')}
                />
                <Label htmlFor="board">Board Members</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admin" 
                  checked={filters.accessLevels.admin}
                  onCheckedChange={() => handleAccessLevelChange('admin')}
                />
                <Label htmlFor="admin">Administrators</Label>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Calendar Sources</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="association" checked />
                  <Label htmlFor="association">Association Calendar</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="global" checked />
                  <Label htmlFor="global">Global Holidays</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarFilters;
