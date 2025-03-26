
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEventType } from '@/types/calendar';
import { calendarStyles } from '@/components/ui/calendar';
import { Search, RotateCcw } from 'lucide-react';

interface CalendarFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({ onFiltersChange }) => {
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
    keyword: '',
    dateRange: 'all',
    accessLevels: {
      public: true,
      residents: true,
      committee: true,
      board: true,
      admin: true
    }
  });

  const eventTypes: { value: CalendarEventType; label: string }[] = [
    { value: 'meeting', label: 'Meetings' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'holiday', label: 'Holidays' },
    { value: 'deadline', label: 'Deadlines' },
    { value: 'workflow', label: 'Workflows' },
    { value: 'community', label: 'Community Events' },
    { value: 'custom', label: 'Custom Events' }
  ];

  const accessLevels = [
    { value: 'public', label: 'Public Events' },
    { value: 'residents', label: 'Resident Events' },
    { value: 'committee', label: 'Committee Events' },
    { value: 'board', label: 'Board Events' },
    { value: 'admin', label: 'Admin Only Events' }
  ];

  const handleTypeToggle = (type: CalendarEventType) => {
    const updatedFilters = {
      ...filters,
      eventTypes: {
        ...filters.eventTypes,
        [type]: !filters.eventTypes[type]
      }
    };
    setFilters(updatedFilters);
    if (onFiltersChange) onFiltersChange(updatedFilters);
  };

  const handleAccessLevelToggle = (level: string) => {
    const updatedFilters = {
      ...filters,
      accessLevels: {
        ...filters.accessLevels,
        [level]: !filters.accessLevels[level]
      }
    };
    setFilters(updatedFilters);
    if (onFiltersChange) onFiltersChange(updatedFilters);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = {
      ...filters,
      keyword: e.target.value
    };
    setFilters(updatedFilters);
    if (onFiltersChange) onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (value: string) => {
    const updatedFilters = {
      ...filters,
      dateRange: value
    };
    setFilters(updatedFilters);
    if (onFiltersChange) onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      eventTypes: {
        meeting: true,
        maintenance: true,
        holiday: true,
        deadline: true,
        workflow: true,
        community: true,
        custom: true
      },
      keyword: '',
      dateRange: 'all',
      accessLevels: {
        public: true,
        residents: true,
        committee: true,
        board: true,
        admin: true
      }
    };
    setFilters(defaultFilters);
    if (onFiltersChange) onFiltersChange(defaultFilters);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-3">Event Types</h3>
            <div className="space-y-2">
              {eventTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type.value}`}
                    checked={filters.eventTypes[type.value]}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                    className={calendarStyles.eventColors[type.value] || calendarStyles.eventColors.default}
                  />
                  <Label htmlFor={`type-${type.value}`} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Access Level</h3>
            <div className="space-y-2">
              {accessLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`level-${level.value}`}
                    checked={filters.accessLevels[level.value]}
                    onCheckedChange={() => handleAccessLevelToggle(level.value)}
                  />
                  <Label htmlFor={`level-${level.value}`} className="cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Search</h3>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input 
                    placeholder="Search events..." 
                    value={filters.keyword}
                    onChange={handleKeywordChange}
                  />
                  <Button size="icon" type="submit">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Date Range</h3>
                <Select 
                  value={filters.dateRange}
                  onValueChange={handleDateRangeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="nextWeek">Next Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="nextMonth">Next Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarFilters;
