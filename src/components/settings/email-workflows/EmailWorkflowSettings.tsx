
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useEmailWorkflows } from '@/hooks/use-email-workflows';
import { EmailWorkflowRule } from '@/services/emailWorkflowService';
import EmailWorkflowTable from './EmailWorkflowTable';
import EmailWorkflowDialog from './EmailWorkflowDialog';

const EmailWorkflowSettings: React.FC = () => {
  const { 
    workflowRules, 
    isLoading, 
    error, 
    fetchWorkflowRules,
    createWorkflowRule,
    updateWorkflowRule,
    deleteWorkflowRule,
    toggleWorkflowRuleStatus
  } = useEmailWorkflows();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EmailWorkflowRule | null>(null);

  const handleAddClick = () => {
    setEditingRule(null);
    setDialogOpen(true);
  };

  const handleEditClick = (rule: EmailWorkflowRule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  };

  const handleSaveRule = (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    if (editingRule) {
      updateWorkflowRule(editingRule.id, rule);
    } else {
      createWorkflowRule(rule);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Email Workflow Management</CardTitle>
          <CardDescription>
            Configure how incoming emails are processed and which workflows they trigger
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchWorkflowRules} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">
            Failed to load email workflow rules. Please try refreshing.
          </div>
        ) : isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading workflow rules...</p>
          </div>
        ) : (
          <EmailWorkflowTable
            workflowRules={workflowRules}
            onEdit={handleEditClick}
            onDelete={deleteWorkflowRule}
            onToggleStatus={toggleWorkflowRuleStatus}
          />
        )}

        <EmailWorkflowDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveRule}
          editingRule={editingRule}
        />

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Email workflow rules determine how incoming messages are processed. Each rule maps an incoming email address to 
            a specific workflow type and forwarding address. When an email arrives at the inbound address, the system will 
            automatically trigger the associated workflow and forward the message as needed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailWorkflowSettings;
