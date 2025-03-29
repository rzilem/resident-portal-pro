
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { Association } from '@/types/association';

interface CalendarHeaderProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  isGlobalAdmin?: boolean;
  showManagerToggle?: boolean;
  isManagerView?: boolean;
  associations?: Association[];
  activeAssociation: Association | null;
  onAssociationChange?: (associationId: string) => void;
  onManagerViewToggle?: () => void;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleFilters: () => void;
  onCreateEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  currentDate,
  isGlobalAdmin = false,
  showManagerToggle = false,
  isManagerView = false,
  associations = [],
  activeAssociation,
  onAssociationChange,
  onManagerViewToggle,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onToggleFilters,
  onCreateEvent
}) => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={onToday}>
            Today
          </Button>
          
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="text-lg font-medium ml-2">
            {format(currentDate, 'MMMM yyyy')}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('month')}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('week')}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('day')}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Day
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={onToggleFilters}>
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
        </div>
        
        <div className="flex items-center justify-end gap-2">
          {associations.length > 0 && activeAssociation && onAssociationChange && (
            <Select
              value={activeAssociation.id}
              onValueChange={onAssociationChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Association" />
              </SelectTrigger>
              <SelectContent>
                {associations.map((association) => (
                  <SelectItem key={association.id} value={association.id}>
                    {association.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {showManagerToggle && onManagerViewToggle && (
            <Button variant="outline" size="sm" onClick={onManagerViewToggle}>
              {isManagerView ? 'Association View' : 'Manager View'}
            </Button>
          )}
          
          <Button onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CalendarHeader;
