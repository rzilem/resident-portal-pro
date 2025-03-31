
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save, Workflow } from "lucide-react";
import { Workflow as WorkflowType } from '@/types/workflow';

interface WorkflowHeaderProps {
  workflow: WorkflowType;
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
  const categories = [
    'Financial',
    'Compliance',
    'Maintenance',
    'Communication',
    'Governance',
    'Resident Management',
    'Other'
  ];
  
  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'completed', label: 'Completed' }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'draft': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return '';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Workflow Name
              </label>
              <Input
                id="name"
                placeholder="Enter workflow name"
                value={workflow.name}
                onChange={(e) => onNameChange(e.target.value)}
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this workflow"
                value={workflow.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                readOnly={readOnly}
                className={`resize-none h-20 ${readOnly ? "bg-gray-50" : ""}`}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={workflow.category}
                onValueChange={onCategoryChange}
                disabled={readOnly}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              {readOnly ? (
                <Badge className={`${getStatusColor(workflow.status)}`}>
                  {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </Badge>
              ) : (
                <Select
                  value={workflow.status}
                  onValueChange={(value: any) => onStatusChange(value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {!readOnly && (
              <Button className="w-full mt-4" onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Workflow
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowHeader;
