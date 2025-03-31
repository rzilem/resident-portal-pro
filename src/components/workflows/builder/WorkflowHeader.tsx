
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, ChevronDown, CalendarPlus } from "lucide-react";
import { Workflow } from '@/types/workflow';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import WorkflowScheduler from '../WorkflowScheduler';

interface WorkflowHeaderProps {
  workflow: Workflow;
  readOnly?: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: 'active' | 'inactive' | 'draft' | 'completed') => void;
  onSave: () => void;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  workflow,
  readOnly = false,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
  onStatusChange,
  onSave
}) => {
  const [showScheduler, setShowScheduler] = useState(false);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDescriptionChange(e.target.value);
  };
  
  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
  };
  
  const handleStatusChange = (value: string) => {
    onStatusChange(value as 'active' | 'inactive' | 'draft' | 'completed');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'draft': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const handleScheduleWorkflow = () => {
    setShowScheduler(true);
  };
  
  return (
    <div className="space-y-4 border-b pb-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 mr-4">
          <Input
            value={workflow.name}
            onChange={handleNameChange}
            placeholder="Workflow Name"
            className="text-2xl font-bold border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={readOnly}
          />
          <Textarea
            value={workflow.description}
            onChange={handleDescriptionChange}
            placeholder="Workflow Description"
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground resize-none"
            disabled={readOnly}
          />
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Select
              value={workflow.status}
              onValueChange={handleStatusChange}
              disabled={readOnly}
            >
              <SelectTrigger className="w-[140px]">
                <Badge
                  variant="outline"
                  className={getStatusColor(workflow.status)}
                >
                  {workflow.status}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            {!readOnly && (
              <Button onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
          </div>
          
          {workflow.status === 'active' && (
            <Dialog open={showScheduler} onOpenChange={setShowScheduler}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleScheduleWorkflow}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </DialogTrigger>
              
              <WorkflowScheduler
                open={showScheduler}
                onOpenChange={setShowScheduler}
                workflow={workflow}
                associationId="default-association"
              />
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Category</p>
            <Select
              value={workflow.category}
              onValueChange={handleCategoryChange}
              disabled={readOnly}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Resident Management">Resident Management</SelectItem>
                <SelectItem value="Governance">Governance</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Steps</p>
            <Badge variant="outline">{workflow.steps.length} steps</Badge>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Last edited: {new Date(workflow.lastEditedAt || workflow.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default WorkflowHeader;
