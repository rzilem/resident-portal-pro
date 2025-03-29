
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CalendarFilters: React.FC = () => {
  const eventTypes = [
    { id: 'meeting', label: 'Meetings', color: 'bg-blue-500' },
    { id: 'maintenance', label: 'Maintenance', color: 'bg-amber-500' },
    { id: 'holiday', label: 'Holidays', color: 'bg-red-500' },
    { id: 'deadline', label: 'Deadlines', color: 'bg-purple-500' },
    { id: 'workflow', label: 'Workflows', color: 'bg-indigo-500' },
    { id: 'community', label: 'Community Events', color: 'bg-green-500' },
    { id: 'custom', label: 'Custom Events', color: 'bg-gray-500' }
  ];
  
  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-medium mb-3">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Event Types</h4>
          {eventTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox id={`type-${type.id}`} defaultChecked />
              <div className={`w-3 h-3 rounded ${type.color}`} />
              <Label htmlFor={`type-${type.id}`} className="text-sm">{type.label}</Label>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Visibility</h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="visibility-public" defaultChecked />
            <Label htmlFor="visibility-public" className="text-sm">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="visibility-residents" defaultChecked />
            <Label htmlFor="visibility-residents" className="text-sm">Residents Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="visibility-board" defaultChecked />
            <Label htmlFor="visibility-board" className="text-sm">Board Members</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="visibility-admin" defaultChecked />
            <Label htmlFor="visibility-admin" className="text-sm">Admin Only</Label>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarFilters;
