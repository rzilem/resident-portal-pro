
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Building } from 'lucide-react';
import { Association } from '@/types/association';

interface ReportFiltersProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  association: string;
  setAssociation: (value: string) => void;
  associations: Association[];
}

const ReportFilters = ({ 
  timeRange, 
  setTimeRange, 
  association, 
  setAssociation,
  associations
}: ReportFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap gap-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Time Period</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Association</span>
          <Select value={association} onValueChange={setAssociation}>
            <SelectTrigger className="w-[200px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Associations</SelectItem>
              {associations.map((assoc) => (
                <SelectItem key={assoc.id} value={assoc.id}>
                  {assoc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
