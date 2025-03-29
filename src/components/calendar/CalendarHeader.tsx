
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Association } from '@/types/association';

interface CalendarHeaderProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  isGlobalAdmin: boolean;
  showManagerToggle?: boolean;
  isManagerView?: boolean;
  onManagerViewToggle?: () => void;
  associations?: Association[];
  activeAssociation: Association | null;
  onAssociationChange: (associationId: string) => void;
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
  isGlobalAdmin,
  showManagerToggle = false,
  isManagerView = false,
  onManagerViewToggle,
  associations = [],
  activeAssociation,
  onAssociationChange,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onToggleFilters,
  onCreateEvent
}) => {
  // Format the date according to the current view
  let dateFormat = 'MMMM yyyy';
  if (view === 'week') {
    dateFormat = "'Week of' MMMM d, yyyy";
  } else if (view === 'day') {
    dateFormat = 'EEEE, MMMM d, yyyy';
  }
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-xl font-medium w-40 text-center">
          {format(currentDate, dateFormat)}
        </h2>
        
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" onClick={onToday} className="ml-2">
          Today
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        {associations.length > 0 && activeAssociation && (
          <Select
            value={activeAssociation.id}
            onValueChange={onAssociationChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select association" />
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
        
        {showManagerToggle && (
          <Button variant="outline" onClick={onManagerViewToggle}>
            <Users className="h-4 w-4 mr-2" />
            {isManagerView ? 'My Calendar' : 'Manager View'}
          </Button>
        )}
        
        <Button variant="outline" onClick={onToggleFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        
        <Select
          value={view}
          onValueChange={(value) => onViewChange(value as 'month' | 'week' | 'day')}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={onCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
