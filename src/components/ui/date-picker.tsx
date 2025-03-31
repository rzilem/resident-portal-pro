
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

export function DatePicker({ 
  date, 
  onDateChange, 
  className,
  showTooltip = false,
  tooltipText = "Select a date" 
}: DatePickerProps) {
  const buttonContent = (
    <Button
      variant={"outline"}
      className={cn(
        "w-full justify-start text-left font-normal",
        !date && "text-muted-foreground",
        className
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : <span>Pick a date</span>}
    </Button>
  );

  return (
    <Popover>
      {showTooltip ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                {buttonContent}
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="z-50">
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <PopoverTrigger asChild>
          {buttonContent}
        </PopoverTrigger>
      )}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
