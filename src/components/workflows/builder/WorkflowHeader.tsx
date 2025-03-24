
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  workflowCategory: string;
  setWorkflowCategory: (category: string) => void;
}

const WorkflowHeader = ({
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  workflowCategory,
  setWorkflowCategory
}: WorkflowHeaderProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input 
                id="workflow-name" 
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-category">Category</Label>
              <Select value={workflowCategory} onValueChange={setWorkflowCategory}>
                <SelectTrigger id="workflow-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="resident">Resident Management</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description</Label>
            <Textarea 
              id="workflow-description" 
              placeholder="Describe what this workflow does"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowHeader;
