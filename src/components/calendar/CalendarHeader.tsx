
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Filter, Plus, CalendarRange, CalendarDays, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Association } from '@/types/association';

interface CalendarHeaderProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  isGlobalAdmin?: boolean;
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
  const getDateRangeTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const start = format(currentDate, 'MMM d');
      const end = format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy');
      return `${start} - ${end}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="ml-2" onClick={onToday}>
          Today
        </Button>
        <h2 className="text-xl font-bold ml-2">{getDateRangeTitle()}</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {isGlobalAdmin && associations.length > 0 && (
          <Select 
            value={activeAssociation?.id || ''} 
            onValueChange={onAssociationChange}
          >
            <SelectTrigger className="w-[200px]">
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
        
        <div className="flex items-center rounded-md border">
          <Button
            variant={view === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('month')}
            className="rounded-r-none"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('week')}
            className="rounded-none border-l border-r"
          >
            <CalendarRange className="h-4 w-4 mr-1" />
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('day')}
            className="rounded-l-none"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Day
          </Button>
        </div>
        
        <Button variant="outline" size="icon" onClick={onToggleFilters}>
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button onClick={onCreateEvent}>
          <Plus className="h-4 w-4 mr-1" />
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
