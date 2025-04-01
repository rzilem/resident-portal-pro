
export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  status: 'active' | 'inactive' | 'draft' | 'completed';
  createdAt: string;
  lastEditedAt?: string;
  createdBy?: string;
  supportedMergeTags?: string[]; // List of merge tag IDs supported by this workflow
  metadata?: Record<string, any>; // For storing alert relationships and other custom data
}

export type WorkflowStepType = 'trigger' | 'action' | 'condition' | 'approval';

export interface BaseWorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
}

export interface TriggerStep extends BaseWorkflowStep {
  type: 'trigger';
  triggerType: string;
  config: Record<string, any>;
}

export interface ActionStep extends BaseWorkflowStep {
  type: 'action';
  actionType: string;
  config: Record<string, any>;
  useMergeTags?: boolean; // Whether this action supports merge tags
}

export interface ApprovalStep extends BaseWorkflowStep {
  type: 'approval';
  approvalType: string;
  requiredApprovals: number;
  approverRoles: string[];
  status?: 'pending' | 'approved' | 'rejected';
  approvals?: ApprovalRecord[];
  config: {
    dueDate?: string;
    reminderFrequency?: string;
    escalationRules?: any;
    approvedSteps: WorkflowStep[];
    rejectedSteps: WorkflowStep[];
  };
  workflowId?: string; // Adding workflowId field for pending approvals
  executionId?: string; // Adding execution ID for reference
}

export interface ApprovalRecord {
  approverId: string;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  comments?: string;
}

export interface ConditionStep extends BaseWorkflowStep {
  type: 'condition';
  conditionType: string;
  field: string;
  value: string;
  config: {
    trueSteps: WorkflowStep[];
    falseSteps: WorkflowStep[];
  };
}

export type WorkflowStep = TriggerStep | ActionStep | ConditionStep | ApprovalStep;

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: number;
  icon?: React.ReactNode;
  popular?: boolean;
  supportedMergeTags?: string[]; // List of merge tag IDs supported by this template
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  started: string;
  completed?: string;
  status: 'running' | 'completed' | 'failed' | 'pending'; // Adding 'pending' state
  pausedAt?: string; // For when workflow is paused waiting for approval
  stepLogs: StepExecutionLog[];
}

export interface StepExecutionLog {
  stepId: string;
  started: string;
  completed?: string;
  status: 'running' | 'completed' | 'failed';
  output?: any;
  error?: string;
}
