
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Pencil, Trash2, FileText, Scan } from "lucide-react";
import { EmailWorkflowRule } from '@/services/emailWorkflowService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmailWorkflowTableProps {
  workflowRules: EmailWorkflowRule[];
  onEdit: (rule: EmailWorkflowRule) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const EmailWorkflowTable: React.FC<EmailWorkflowTableProps> = ({
  workflowRules,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (workflowRules.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/20">
        <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">No workflow rules yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first email workflow rule to start processing incoming emails.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Name</TableHead>
          <TableHead>Email Address</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Forwards To</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[100px]">OCR</TableHead>
          <TableHead className="w-[80px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflowRules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell className="font-medium">{rule.name}</TableCell>
            <TableCell>{rule.inboundEmail}</TableCell>
            <TableCell>
              <Badge variant={rule.workflowType === 'Invoice' ? 'destructive' : 'secondary'}>
                {rule.workflowType}
              </Badge>
            </TableCell>
            <TableCell>{rule.forwardTo}</TableCell>
            <TableCell>
              <Switch 
                checked={rule.isActive} 
                onCheckedChange={() => onToggleStatus(rule.id)}
                aria-label={rule.isActive ? 'Active' : 'Inactive'}
              />
            </TableCell>
            <TableCell>
              {rule.enableOcr ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <Scan className="h-3 w-3" />
                        <span>Enabled</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs space-y-1 max-w-[200px]">
                        <p className="font-medium">OCR Settings:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {rule.ocrSettings?.extractVendor && <li>Extract vendor information</li>}
                          {rule.ocrSettings?.extractDate && <li>Extract invoice date</li>}
                          {rule.ocrSettings?.extractAmount && <li>Extract amount</li>}
                          {rule.ocrSettings?.extractInvoiceNumber && <li>Extract invoice number</li>}
                          {rule.ocrSettings?.extractLineItems && <li>Extract line items</li>}
                          {rule.ocrSettings?.suggestGlAccount && <li>Suggest GL account</li>}
                        </ul>
                        <p>Confidence: {rule.ocrSettings?.confidence || 'medium'}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                  Disabled
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(rule)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(rule.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmailWorkflowTable;
