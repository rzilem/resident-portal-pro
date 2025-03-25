
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Save, Play, AlertTriangle, UploadCloud, Download, Edit2, Settings } from "lucide-react";
import { Workflow } from "@/types/workflow";
import WorkflowScheduler from "../WorkflowScheduler";

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
  const [showScheduler, setShowScheduler] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border rounded-md p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          {readOnly ? (
            <h1 className="text-xl font-bold">{workflow.name}</h1>
          ) : (
            <Input
              value={workflow.name}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-lg font-semibold"
              placeholder="Workflow Name"
            />
          )}
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={getStatusColor(workflow.status)}>
              {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
            </Badge>
            
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {workflow.category}
            </Badge>
            
            <span className="text-sm text-muted-foreground">
              {workflow.createdAt 
                ? `Created: ${new Date(workflow.createdAt).toLocaleDateString()}`
                : "New workflow"}
            </span>
            
            {workflow.lastEditedAt && (
              <span className="text-sm text-muted-foreground">
                Last edited: {new Date(workflow.lastEditedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {!readOnly && (
            <>
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Select 
                value={workflow.status} 
                onValueChange={(value) => onStatusChange(value as 'active' | 'inactive' | 'draft')}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowScheduler(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          
          {!readOnly && (
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Test Run
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          {readOnly ? (
            <p className="text-muted-foreground">{workflow.description}</p>
          ) : (
            <Textarea
              value={workflow.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Workflow Description"
              className="resize-none"
            />
          )}
        </div>
        
        <div>
          {!readOnly && (
            <Select 
              value={workflow.category} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Governance">Governance</SelectItem>
                <SelectItem value="Resident Management">Resident Management</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {showScheduler && (
        <WorkflowScheduler
          open={showScheduler}
          onOpenChange={setShowScheduler}
          workflow={workflow}
          associationId="assoc-1" // In a real app, this would be the current association ID
        />
      )}
    </div>
  );
};

export default WorkflowHeader;
