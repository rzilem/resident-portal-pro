
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ApprovalStep, APPROVAL_TYPES, APPROVAL_ROLES } from './types';
import { CheckSquare, FileText, Home, AlertTriangle, DollarSign } from 'lucide-react';
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Slider } from "@/components/ui/slider";

interface ApprovalStepContentProps {
  step: ApprovalStep;
  updateStep: (id: string, data: Partial<ApprovalStep>) => void;
  readOnly?: boolean;
}

const ApprovalStepContent = ({ step, updateStep, readOnly = false }: ApprovalStepContentProps) => {
  // Function to render the appropriate icon for the approval type
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'Home': return <Home className="h-4 w-4" />;
      case 'AlertTriangle': return <AlertTriangle className="h-4 w-4" />;
      case 'DollarSign': return <DollarSign className="h-4 w-4" />;
      case 'CheckSquare': return <CheckSquare className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const handleApproverRoleChange = (role: string, checked: boolean) => {
    if (readOnly) return;
    
    let updatedRoles = [...step.approverRoles];
    if (checked) {
      updatedRoles.push(role);
    } else {
      updatedRoles = updatedRoles.filter(r => r !== role);
    }
    
    updateStep(step.id, { approverRoles: updatedRoles });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Approval Type</Label>
        <Select 
          value={step.approvalType}
          onValueChange={(value) => !readOnly && updateStep(step.id, { approvalType: value })}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select approval type" />
          </SelectTrigger>
          <SelectContent>
            {APPROVAL_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center">
                  {renderIcon(type.icon)}
                  <span className="ml-2">{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Name this approval step</Label>
        <Input 
          placeholder="Approval name" 
          value={step.name}
          onChange={(e) => !readOnly && updateStep(step.id, { name: e.target.value })}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Required Approvals ({step.requiredApprovals})</Label>
        <Slider 
          value={[step.requiredApprovals]} 
          min={1} 
          max={5} 
          step={1}
          onValueChange={(values) => !readOnly && updateStep(step.id, { requiredApprovals: values[0] })}
          disabled={readOnly}
        />
        <p className="text-xs text-muted-foreground">
          {step.requiredApprovals} approval{step.requiredApprovals > 1 ? 's' : ''} required from selected roles
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Who can approve?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {APPROVAL_ROLES.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`role-${role.id}`} 
                checked={step.approverRoles.includes(role.id)}
                onCheckedChange={(checked) => handleApproverRoleChange(role.id, checked === true)}
                disabled={readOnly}
              />
              <Label htmlFor={`role-${role.id}`} className="text-sm font-normal cursor-pointer">
                {role.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add more settings for due dates, reminders etc. as needed */}
    </div>
  );
};

export default ApprovalStepContent;
