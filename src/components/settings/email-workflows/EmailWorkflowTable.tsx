
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Power } from "lucide-react";
import { EmailWorkflowRule } from '@/services/emailWorkflowService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EmailWorkflowTableProps {
  workflowRules: EmailWorkflowRule[];
  onEdit: (rule: EmailWorkflowRule) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const EmailWorkflowTable = ({
  workflowRules,
  onEdit,
  onDelete,
  onToggleStatus
}: EmailWorkflowTableProps) => {
  if (workflowRules.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No email workflow rules configured yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Inbound Email</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Workflow Type</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Association</th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Forwarding Email</th>
              <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {workflowRules.map((rule) => (
              <tr key={rule.id} className={rule.isActive ? "" : "bg-muted/20 text-muted-foreground"}>
                <td className="px-4 py-3 text-sm">{rule.inboundEmail}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {rule.workflowType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{rule.association || "-"}</td>
                <td className="px-4 py-3 text-sm">{rule.forwardingEmail}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(rule)}
                    title="Edit rule"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onToggleStatus(rule.id)}
                    title={rule.isActive ? "Deactivate rule" : "Activate rule"}
                  >
                    <Power className={`h-4 w-4 ${rule.isActive ? 'text-green-500' : 'text-gray-500'}`} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        title="Delete rule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Email Workflow Rule</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the rule for <strong>{rule.inboundEmail}</strong>? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(rule.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailWorkflowTable;
