
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EmailWorkflowRule } from '@/services/emailWorkflowService';
import { Edit, Trash, Mail, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Workflow Type</TableHead>
            <TableHead>Forward To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflowRules.length > 0 ? (
            workflowRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    {rule.name || rule.inboundEmail}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <code className="rounded bg-muted px-1 py-0.5 text-sm">
                      {rule.inboundEmail}
                    </code>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {rule.workflowType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{rule.forwardTo}</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => onToggleStatus(rule.id)}
                    />
                    <span className={rule.isActive ? "text-green-600" : "text-gray-500"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(rule)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${rule.name || rule.inboundEmail}"?`)) {
                          onDelete(rule.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No workflow rules found. Create your first rule to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmailWorkflowTable;
