
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Workflow } from '@/types/workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Save } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const WORKFLOW_CATEGORIES = [
  'Financial',
  'Compliance',
  'Maintenance',
  'Communication',
  'Governance',
  'Resident Management',
  'Administrative',
  'Custom'
];

interface WorkflowHeaderProps {
  workflow: Workflow;
  readOnly?: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: 'active' | 'inactive' | 'draft') => void;
  onSave: () => void;
}

const WorkflowHeader = ({
  workflow,
  readOnly = false,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
  onStatusChange,
  onSave
}: WorkflowHeaderProps) => {
  const [schedulingDate, setSchedulingDate] = useState<Date | undefined>(undefined);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-400';
      case 'draft':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400';
      default:
        return '';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {readOnly ? (
                workflow.name || 'Untitled Workflow'
              ) : (
                <Input 
                  className="text-2xl font-bold h-auto text-foreground border-none px-0 focus-visible:ring-0"
                  placeholder="Workflow Name" 
                  value={workflow.name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              {readOnly ? (
                workflow.description
              ) : (
                <Textarea 
                  className="resize-none border-none px-0 focus-visible:ring-0"
                  placeholder="Add a description..." 
                  value={workflow.description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                />
              )}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {!readOnly && (
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
            <Badge className={cn(getStatusColor(workflow.status), "capitalize")}>
              {workflow.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            {readOnly ? (
              <div className="py-2">{workflow.category || 'Not categorized'}</div>
            ) : (
              <Select 
                value={workflow.category} 
                onValueChange={onCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {!readOnly && (
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={workflow.status === 'active'} 
                  onCheckedChange={(checked) => onStatusChange(checked ? 'active' : 'inactive')}
                />
                <span>{workflow.status === 'active' ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Created</Label>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(workflow.createdAt).toLocaleDateString()}
              {workflow.lastEditedAt && (
                <>
                  <Clock className="ml-3 mr-2 h-4 w-4" />
                  Last edited: {new Date(workflow.lastEditedAt).toLocaleDateString()}
                </>
              )}
            </div>
          </div>
          
          {!readOnly && workflow.status === 'active' && (
            <div className="space-y-2 col-span-full">
              <Label>Schedule this workflow</Label>
              <div className="flex items-center gap-2">
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowScheduleDialog(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </AlertDialogTrigger>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <AlertDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Select a date to schedule this workflow to run automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !schedulingDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {schedulingDate ? format(schedulingDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={schedulingDate}
                    onSelect={setSchedulingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-2">
                The workflow will run at 8:00 AM on the selected date.
              </p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // This would integrate with the calendar service in a real app
                console.log(`Scheduling workflow for ${schedulingDate?.toISOString()}`);
                setShowScheduleDialog(false);
              }}
              disabled={!schedulingDate}
            >
              Schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default WorkflowHeader;
