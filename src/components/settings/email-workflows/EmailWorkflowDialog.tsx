import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailWorkflowRule, OcrSettings, workflowTypes } from '@/services/emailWorkflowService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { FileText, Zap } from "lucide-react";

interface EmailWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => void;
  editingRule: EmailWorkflowRule | null;
}

const defaultOcrSettings: OcrSettings = {
  extractVendor: true,
  extractDate: true,
  extractAmount: true,
  extractInvoiceNumber: true,
  extractLineItems: false,
  suggestGlAccount: true,
  confidence: 'medium',
};

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
    association: '',
    enableOcr: false,
    ocrSettings: defaultOcrSettings,
  });

  useEffect(() => {
    if (editingRule) {
      const { id, createdAt, ...restRule } = editingRule;
      setFormData({
        ...restRule,
        enableOcr: restRule.enableOcr || false,
        ocrSettings: restRule.ocrSettings || defaultOcrSettings,
      });
    } else {
      setFormData({
        name: '',
        inboundEmail: '',
        workflowType: 'General Inquiry',
        forwardTo: '',
        isActive: true,
        forwardingEmail: '',
        association: '',
        enableOcr: false,
        ocrSettings: defaultOcrSettings,
      });
    }
  }, [editingRule, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkflowTypeChange = (value: string) => {
    const enableOcr = value === 'Invoice' ? true : formData.enableOcr;
    setFormData(prev => ({ ...prev, workflowType: value, enableOcr }));
  };

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleOcrSettingChange = (field: keyof OcrSettings) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      ocrSettings: {
        ...prev.ocrSettings,
        [field]: checked,
      }
    }));
  };

  const handleOcrConfidenceChange = (value: 'high' | 'medium' | 'low') => {
    setFormData(prev => ({
      ...prev,
      ocrSettings: {
        ...prev.ocrSettings,
        confidence: value,
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const isInvoiceWorkflow = formData.workflowType === 'Invoice';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
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
                placeholder="invoices@domain.com"
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
                placeholder="accounting@domain.com"
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
                  onCheckedChange={handleSwitchChange('isActive')} 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {formData.isActive ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>

            <div className="col-span-4 mt-2">
              <Separator />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enableOcr" className="text-right">
                OCR Processing
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="enableOcr" 
                  checked={formData.enableOcr || isInvoiceWorkflow} 
                  onCheckedChange={handleSwitchChange('enableOcr')}
                  disabled={isInvoiceWorkflow}
                />
                <Label htmlFor="enableOcr" className="cursor-pointer">
                  {formData.enableOcr || isInvoiceWorkflow ? 'Enabled' : 'Disabled'}
                </Label>
                {isInvoiceWorkflow && (
                  <span className="text-xs text-muted-foreground ml-2">(Required for invoice workflows)</span>
                )}
              </div>
            </div>

            {(formData.enableOcr || isInvoiceWorkflow) && (
              <div className="col-span-4">
                <Accordion type="single" collapsible defaultValue="ocr-settings">
                  <AccordionItem value="ocr-settings">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>OCR Data Extraction Settings</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 py-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="extractVendor" className="flex items-center gap-2">
                            <span>Extract Vendor Information</span>
                          </Label>
                          <Switch 
                            id="extractVendor" 
                            checked={formData.ocrSettings?.extractVendor || false} 
                            onCheckedChange={handleOcrSettingChange('extractVendor')} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="extractDate" className="flex items-center gap-2">
                            <span>Extract Invoice Date</span>
                          </Label>
                          <Switch 
                            id="extractDate" 
                            checked={formData.ocrSettings?.extractDate || false} 
                            onCheckedChange={handleOcrSettingChange('extractDate')} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="extractAmount" className="flex items-center gap-2">
                            <span>Extract Invoice Amount</span>
                          </Label>
                          <Switch 
                            id="extractAmount" 
                            checked={formData.ocrSettings?.extractAmount || false} 
                            onCheckedChange={handleOcrSettingChange('extractAmount')} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="extractInvoiceNumber" className="flex items-center gap-2">
                            <span>Extract Invoice Number</span>
                          </Label>
                          <Switch 
                            id="extractInvoiceNumber" 
                            checked={formData.ocrSettings?.extractInvoiceNumber || false} 
                            onCheckedChange={handleOcrSettingChange('extractInvoiceNumber')} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="extractLineItems" className="flex items-center gap-2">
                            <span>Extract Line Items</span>
                            <span className="text-xs text-muted-foreground">(Advanced)</span>
                          </Label>
                          <Switch 
                            id="extractLineItems" 
                            checked={formData.ocrSettings?.extractLineItems || false} 
                            onCheckedChange={handleOcrSettingChange('extractLineItems')} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="suggestGlAccount" className="flex items-center gap-2">
                            <span>Suggest GL Account</span>
                          </Label>
                          <Switch 
                            id="suggestGlAccount" 
                            checked={formData.ocrSettings?.suggestGlAccount || false} 
                            onCheckedChange={handleOcrSettingChange('suggestGlAccount')} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4 pt-2">
                          <Label htmlFor="ocrConfidence" className="text-left">
                            OCR Confidence Level
                          </Label>
                          <div className="col-span-3">
                            <Select 
                              value={formData.ocrSettings?.confidence || 'medium'} 
                              onValueChange={(value: 'high' | 'medium' | 'low') => handleOcrConfidenceChange(value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High (Strict matching)</SelectItem>
                                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                                <SelectItem value="low">Low (More suggestions)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="pt-2 text-xs text-muted-foreground bg-muted p-3 rounded-md">
                          <div className="flex gap-2 items-center mb-1">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <p className="font-medium">OCR Processing Information</p>
                          </div>
                          <p>
                            OCR extraction will attempt to identify invoice data from attached PDF documents and images.
                            Higher confidence settings require clearer documents but produce fewer false matches.
                            For best results, configure vendors to send machine-readable invoices.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
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
