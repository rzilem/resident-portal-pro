
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarAccessLevel, CalendarEventType } from '@/types/calendar';
import { format } from 'date-fns';
import { Association } from '@/types/association';

interface Workflow {
  id: string;
  name: string;
}

interface QuickEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onSaveEvent: (eventData: any) => void;
  onScheduleWorkflow?: (workflowId: string, title: string, date: Date) => void;
  associationId?: string;
  userAccessLevel: CalendarAccessLevel;
  workflows?: Workflow[];
  isGlobalView?: boolean;
  associations?: Association[];
}

const EVENT_TYPES = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'community', label: 'Community Event' },
  { value: 'custom', label: 'Custom' }
];

const QuickEventDialog: React.FC<QuickEventDialogProps> = ({
  open,
  onOpenChange,
  date,
  onSaveEvent,
  onScheduleWorkflow,
  associationId,
  userAccessLevel,
  workflows = [],
  isGlobalView = false,
  associations = []
}) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CalendarEventType>('meeting');
  const [isWorkflow, setIsWorkflow] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | undefined>(associationId);

  const hasWorkflows = workflows && workflows.length > 0;

  const handleSaveEvent = () => {
    if (!title) {
      alert('Please enter a title');
      return;
    }

    if (isWorkflow && onScheduleWorkflow) {
      if (!selectedWorkflow) {
        alert('Please select a workflow');
        return;
      }
      
      // If in global view, ensure an association is selected
      if (isGlobalView && !selectedAssociationId) {
        alert('Please select an association');
        return;
      }

      const workflowName = workflows.find(w => w.id === selectedWorkflow)?.name || title;
      onScheduleWorkflow(selectedWorkflow, workflowName, date);
    } else {
      const eventData = {
        title,
        start: date,
        type: eventType,
        allDay: true,
        accessLevel: userAccessLevel,
        associationId: selectedAssociationId || associationId
      };

      onSaveEvent(eventData);
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setEventType('meeting');
    setIsWorkflow(false);
    setSelectedWorkflow('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isGlobalView && associations.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="association" className="text-right">
                Association
              </Label>
              <Select
                value={selectedAssociationId}
                onValueChange={(value) => setSelectedAssociationId(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an association" />
                </SelectTrigger>
                <SelectContent>
                  {associations.map((association) => (
                    <SelectItem key={association.id} value={association.id}>
                      {association.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {hasWorkflows && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-type" className="text-right">
                Event Type
              </Label>
              <Select
                value={isWorkflow ? 'workflow' : 'normal'}
                onValueChange={(value) => setIsWorkflow(value === 'workflow')}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular Event</SelectItem>
                  <SelectItem value="workflow">Schedule Workflow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {isWorkflow ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflow" className="text-right">
                Workflow
              </Label>
              <Select
                value={selectedWorkflow}
                onValueChange={setSelectedWorkflow}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={eventType}
                  onValueChange={(value) => setEventType(value as CalendarEventType)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEvent}>
            {isWorkflow ? 'Schedule Workflow' : 'Add Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEventDialog;
