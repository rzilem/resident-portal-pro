
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BidRequestDetailsProps {
  dueDate: Date | null;
  notes: string | undefined;
  onUpdateDueDate: (date: Date | null) => void;
  onUpdateNotes: (notes: string) => void;
}

const BidRequestDetails: React.FC<BidRequestDetailsProps> = ({
  dueDate,
  notes,
  onUpdateDueDate,
  onUpdateNotes,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Additional Details</h2>
      <p className="text-muted-foreground mb-6">
        Provide any additional information and set a deadline for receiving bids.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="dueDate">Due Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dueDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate || undefined}
                onSelect={onUpdateDueDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter any additional details about your project..."
            className="min-h-[120px] mt-1"
            value={notes || ''}
            onChange={(e) => onUpdateNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BidRequestDetails;
