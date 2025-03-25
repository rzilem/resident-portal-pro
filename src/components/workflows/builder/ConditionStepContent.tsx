
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConditionStep, CONDITION_TYPES } from './types';

interface ConditionStepContentProps {
  step: ConditionStep;
  updateStep: (id: string, data: Partial<ConditionStep>) => void;
  readOnly?: boolean;
}

const ConditionStepContent = ({ step, updateStep, readOnly = false }: ConditionStepContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <Label>Field</Label>
          <Select defaultValue={step.field || "paymentStatus"} disabled={readOnly}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paymentStatus">Payment Status</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="residentType">Resident Type</SelectItem>
              <SelectItem value="custom">Custom Field</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Condition</Label>
          <Select 
            value={step.conditionType}
            onValueChange={(value) => !readOnly && updateStep(step.id, { conditionType: value })}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Value</Label>
          <Input 
            placeholder="Condition value" 
            value={step.value}
            onChange={(e) => !readOnly && updateStep(step.id, { value: e.target.value })}
            readOnly={readOnly}
            className={readOnly ? "bg-gray-50" : ""}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Name this condition</Label>
        <Input 
          placeholder="Condition name" 
          value={step.name}
          onChange={(e) => !readOnly && updateStep(step.id, { name: e.target.value })}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
    </div>
  );
};

export default ConditionStepContent;
