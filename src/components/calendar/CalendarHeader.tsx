
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, Building } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Association } from '@/types/association';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarHeaderProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  isGlobalAdmin: boolean;
  associations: Association[];
  activeAssociation: Association | null;
  onAssociationChange: (associationId: string) => void;
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
  isGlobalAdmin,
  associations,
  activeAssociation,
  onAssociationChange,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onToggleFilters,
  onCreateEvent
}: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">
          {isGlobalAdmin ? 'Global Calendar' : 'Association Calendar'}
        </h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {!isGlobalAdmin && associations.length > 0 && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={activeAssociation?.id || ''} 
              onValueChange={onAssociationChange}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select association" />
              </SelectTrigger>
              <SelectContent>
                {associations.map(association => (
                  <SelectItem key={association.id} value={association.id}>
                    {association.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Tabs value={view} onValueChange={(v) => onViewChange(v as 'month' | 'week' | 'day')}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onToday}>
            Today
          </Button>
          <Button size="sm" variant="outline" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="sm" onClick={onToggleFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        
        <Button onClick={onCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
