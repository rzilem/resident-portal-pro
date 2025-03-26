
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from '@/components/ui/separator';
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';

interface DateRangePickerProps {
  filters: InvoiceFilterState;
  onDateChange: (field: 'from' | 'to', date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ filters, onDateChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Calendar size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3">
          <h4 className="font-medium mb-2">Date Range</h4>
          <div className="grid gap-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">From</div>
              <CalendarComponent
                mode="single"
                selected={filters.dateRange?.from || undefined}
                onSelect={(date) => onDateChange('from', date)}
                initialFocus
              />
            </div>
            <Separator />
            <div>
              <div className="text-sm text-muted-foreground mb-1">To</div>
              <CalendarComponent
                mode="single"
                selected={filters.dateRange?.to || undefined}
                onSelect={(date) => onDateChange('to', date)}
                initialFocus
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
