
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Settings
} from 'lucide-react';
import { Association } from '@/types/association';

interface CalendarHeaderProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  isGlobalAdmin?: boolean;
  showManagerToggle?: boolean;
  isManagerView?: boolean;
  onManagerViewToggle?: () => void;
  associations?: Association[];
  activeAssociation: Association | null;
  onAssociationChange?: (associationId: string) => void;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleFilters: () => void;
  onCreateEvent: () => void;
}

const CalendarHeader = ({
  view,
  currentDate,
  isGlobalAdmin = false,
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
}: CalendarHeaderProps) => {
  // Format date based on current view
  const getHeaderDate = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const start = new Date(currentDate);
      // Set to start of week (Sunday)
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
      } else if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      } else {
        return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
      }
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium px-2">{getHeaderDate()}</div>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {showManagerToggle && onManagerViewToggle && (
            <Button 
              variant={isManagerView ? "default" : "outline"} 
              onClick={onManagerViewToggle}
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              {isManagerView ? "Manager View" : "Single Association"}
            </Button>
          )}
          
          {!isManagerView && activeAssociation && associations.length > 0 && onAssociationChange && (
            <Select 
              value={activeAssociation.id} 
              onValueChange={onAssociationChange}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select Association" />
              </SelectTrigger>
              <SelectContent>
                {associations.map(association => (
                  <SelectItem key={association.id} value={association.id}>
                    {association.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onToggleFilters}>
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
            
            <Button onClick={onCreateEvent}>
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={view === 'month' ? "default" : "outline"} 
          size="sm" 
          onClick={() => onViewChange('month')}
        >
          Month
        </Button>
        <Button 
          variant={view === 'week' ? "default" : "outline"} 
          size="sm" 
          onClick={() => onViewChange('week')}
        >
          Week
        </Button>
        <Button 
          variant={view === 'day' ? "default" : "outline"} 
          size="sm" 
          onClick={() => onViewChange('day')}
        >
          Day
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
