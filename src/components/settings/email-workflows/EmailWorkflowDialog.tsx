
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailWorkflowRule, workflowTypes } from '@/services/emailWorkflowService';

interface EmailWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => void;
  editingRule: EmailWorkflowRule | null;
}

const EmailWorkflowDialog = ({
  open,
  onOpenChange,
  onSave,
  editingRule
}: EmailWorkflowDialogProps) => {
  const [formData, setFormData] = useState<Omit<EmailWorkflowRule, 'id' | 'createdAt'>>({
    name: '',
    inboundEmail: '',
    workflowType: 'General Inquiry',
    forwardTo: '',
    isActive: true,
    forwardingEmail: '',
    association: ''
  });

  // Reset form when dialog opens or editingRule changes
  useEffect(() => {
    if (editingRule) {
      const { id, createdAt, ...restRule } = editingRule;
      setFormData(restRule);
    } else {
      setFormData({
        name: '',
        inboundEmail: '',
        workflowType: 'General Inquiry',
        forwardTo: '',
        isActive: true,
        forwardingEmail: '',
        association: ''
      });
    }
  }, [editingRule, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkflowTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, workflowType: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Email Workflow Rule' : 'Add Email Workflow Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule 
                ? 'Update the settings for this email workflow rule' 
                : 'Create a new rule to handle incoming emails and trigger workflows'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inboundEmail" className="text-right">
                Inbound Email
              </Label>
              <Input
                id="inboundEmail"
                name="inboundEmail"
                value={formData.inboundEmail}
                onChange={handleChange}
                className="col-span-3"
                placeholder="example@domain.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflowType" className="text-right">
                Workflow Type
              </Label>
              <Select 
                value={formData.workflowType} 
                onValueChange={handleWorkflowTypeChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a workflow type" />
                </SelectTrigger>
                <SelectContent>
                  {workflowTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="association" className="text-right">
                Association
              </Label>
              <Input
                id="association"
                name="association"
                value={formData.association || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="forwardTo" className="text-right">
                Forwarding Email
              </Label>
              <Input
                id="forwardTo"
                name="forwardTo"
                value={formData.forwardTo}
                onChange={handleChange}
                className="col-span-3"
                placeholder="forward-to@domain.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="isActive" 
                  checked={formData.isActive} 
                  onCheckedChange={handleSwitchChange} 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {formData.isActive ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRule ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailWorkflowDialog;
