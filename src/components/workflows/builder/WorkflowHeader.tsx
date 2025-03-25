
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const WORKFLOW_CATEGORIES = [
  { value: "Financial", label: "Financial" },
  { value: "Compliance", label: "Compliance" },
  { value: "Communication", label: "Communication" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Resident Management", label: "Resident Management" },
  { value: "Governance", label: "Governance" },
  { value: "Other", label: "Other" },
];

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  workflowCategory: string;
  setWorkflowCategory: (category: string) => void;
  readOnly?: boolean;
}

const WorkflowHeader = ({
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  workflowCategory,
  setWorkflowCategory,
  readOnly = false
}: WorkflowHeaderProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workflowName">Workflow Name</Label>
            <Input
              id="workflowName"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
              readOnly={readOnly}
              className={readOnly ? "opacity-70" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workflowCategory">Category</Label>
            {readOnly ? (
              <Input 
                value={workflowCategory} 
                readOnly 
                className="opacity-70" 
              />
            ) : (
              <Select
                value={workflowCategory}
                onValueChange={setWorkflowCategory}
                disabled={readOnly}
              >
                <SelectTrigger id="workflowCategory">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="workflowDescription">Description</Label>
            <Textarea
              id="workflowDescription"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Describe the purpose and functionality of this workflow"
              className={`resize-none min-h-[100px] ${readOnly ? "opacity-70" : ""}`}
              readOnly={readOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowHeader;
