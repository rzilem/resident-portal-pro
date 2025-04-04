
import React from 'react';
import { Calendar, AlertCircle, Users, Wrench, Gift, Clock, Sparkles, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarEventType } from '@/types/calendar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface CalendarFiltersProps {
  activeFilter: CalendarEventType | 'all';
  onFilterChange: (filter: CalendarEventType | 'all') => void;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  const filters = [
    { id: 'all', name: 'All Events', icon: Calendar, color: 'bg-gray-100 hover:bg-gray-200', tooltip: 'Show all calendar events' },
    { id: 'meeting', name: 'Meetings', icon: Users, color: 'bg-blue-100 hover:bg-blue-200', tooltip: 'Show only meeting events' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'bg-amber-100 hover:bg-amber-200', tooltip: 'Show only maintenance events' },
    { id: 'holiday', name: 'Holidays', icon: Gift, color: 'bg-red-100 hover:bg-red-200', tooltip: 'Show only holiday events' },
    { id: 'deadline', name: 'Deadlines', icon: Clock, color: 'bg-purple-100 hover:bg-purple-200', tooltip: 'Show only deadline events' },
    { id: 'workflow', name: 'Workflows', icon: AlertCircle, color: 'bg-indigo-100 hover:bg-indigo-200', tooltip: 'Show only workflow events' },
    { id: 'community', name: 'Community', icon: Sparkles, color: 'bg-green-100 hover:bg-green-200', tooltip: 'Show only community events' },
    { id: 'custom', name: 'Custom', icon: Tag, color: 'bg-gray-100 hover:bg-gray-200', tooltip: 'Show only custom events' },
  ];
  
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <TooltipProvider key={filter.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={`${filter.color} ${isActive ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => onFilterChange(filter.id as CalendarEventType | 'all')}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {filter.name}
                    {isActive && <Badge className="ml-2 bg-primary">Active</Badge>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-50">
                  <p>{filter.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarFilters;
