
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, AlertCircle, Clock, FileText, Home, DollarSign } from "lucide-react";
import { ApprovalStep } from '@/types/workflow';
import { useWorkflowExecution } from '@/hooks/use-workflow-execution';
import { useAuth } from '@/hooks/use-auth';
import { roleService } from '@/services/roleService';
import { adaptSupabaseUser } from '@/utils/user-helpers';

// Define the missing interface
interface ApprovalQueueProps {
  className?: string;
}

// Helper function to get icon for approval type
const getApprovalIcon = (type: string) => {
  switch (type) {
    case 'invoice': return <FileText className="h-5 w-5" />;
    case 'arc': return <Home className="h-5 w-5" />;
    case 'violation': return <AlertCircle className="h-5 w-5" />;
    case 'collection': return <DollarSign className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
};

// Helper function to get color for approval type
const getApprovalColor = (type: string) => {
  switch (type) {
    case 'invoice': return "bg-blue-100 text-blue-800";
    case 'arc': return "bg-green-100 text-green-800";
    case 'violation': return "bg-orange-100 text-orange-800";
    case 'collection': return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ className }) => {
  const { user: supabaseUser } = useAuth();
  const user = adaptSupabaseUser(supabaseUser);
  const { pendingApprovals, processApproval } = useWorkflowExecution();
  const [comments, setComments] = React.useState<Record<string, string>>({});
  const [processing, setProcessing] = React.useState<Record<string, boolean>>({});

  // Check if user can approve the given step
  const canApprove = (step: ApprovalStep) => {
    if (!user) return false;
    
    // Check if user has already approved this step
    const hasAlreadyActed = step.approvals?.some(a => a.approverId === user.id);
    if (hasAlreadyActed) return false;
    
    // Check if user has one of the allowed roles
    if (step.approverRoles.includes(user.role)) return true;
    
    // If role-specific permission check is available, use it
    return roleService.hasPermission(user, 'workflows', 'approve');
  };

  // Handle approve or reject action
  const handleAction = async (step: ApprovalStep, action: 'approve' | 'reject') => {
    if (!canApprove(step)) return;
    
    setProcessing(prev => ({ ...prev, [step.id]: true }));
    
    try {
      await processApproval(step, action, comments[step.id]);
      setComments(prev => ({ ...prev, [step.id]: '' }));
    } finally {
      setProcessing(prev => ({ ...prev, [step.id]: false }));
    }
  };

  if (pendingApprovals.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Pending Approvals
        </CardTitle>
        <CardDescription>
          Items awaiting your review and approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No pending approvals at this time
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((step) => (
              <div key={step.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getApprovalIcon(step.approvalType)}
                    <div className="ml-3">
                      <h4 className="font-medium">{step.name}</h4>
                      <Badge className={getApprovalColor(step.approvalType)} variant="outline">
                        {step.approvalType.charAt(0).toUpperCase() + step.approvalType.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={step.status === 'pending' ? 'secondary' : 'outline'}>
                      {step.approvals?.filter(a => a.status === 'approved').length || 0}/{step.requiredApprovals} Approved
                    </Badge>
                    {step.config.dueDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Due by {new Date(step.config.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {canApprove(step) && (
                  <>
                    <Textarea
                      placeholder="Add optional comments for your decision..."
                      value={comments[step.id] || ''}
                      onChange={(e) => setComments(prev => ({ ...prev, [step.id]: e.target.value }))}
                      className="h-20 resize-none"
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-50 text-red-600"
                        onClick={() => handleAction(step, 'reject')}
                        disabled={processing[step.id]}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-200 hover:bg-green-50 text-green-600"
                        onClick={() => handleAction(step, 'approve')}
                        disabled={processing[step.id]}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </>
                )}
                
                {!canApprove(step) && user && (
                  <div className="text-sm text-muted-foreground">
                    You cannot approve this item or have already submitted your decision.
                  </div>
                )}
                
                {step.approvals && step.approvals.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="text-sm font-medium mb-2">Approval History</h5>
                    <div className="space-y-2">
                      {step.approvals.map((approval, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {approval.approverName} ({approval.approverRole})
                            {approval.status === 'approved' ? (
                              <span className="text-green-600 ml-2">✓ Approved</span>
                            ) : (
                              <span className="text-red-600 ml-2">✗ Rejected</span>
                            )}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(approval.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalQueue;
