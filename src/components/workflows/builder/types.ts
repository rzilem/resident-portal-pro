
export type BaseWorkflowStep = {
  id: string;
  name: string;
};

export type TriggerStep = BaseWorkflowStep & {
  type: 'trigger';
  triggerType: string;
  config: any;
};

export type ActionStep = BaseWorkflowStep & {
  type: 'action';
  actionType: string;
  config: any;
};

export type ApprovalStep = BaseWorkflowStep & {
  type: 'approval';
  approvalType: string;
  requiredApprovals: number;
  approverRoles: string[];
  config: {
    dueDate?: string;
    reminderFrequency?: string;
    escalationRules?: any;
    approvedSteps: WorkflowStep[];
    rejectedSteps: WorkflowStep[];
  };
};

export type ConditionStep = BaseWorkflowStep & {
  type: 'condition';
  conditionType: string;
  field: string;
  value: string;
  config: { 
    trueSteps: WorkflowStep[];
    falseSteps: WorkflowStep[]; 
  };
};

export type WorkflowStep = TriggerStep | ActionStep | ConditionStep | ApprovalStep;

export const TRIGGER_TYPES = [
  { id: 'time', label: 'Time-based', icon: 'Calendar' },
  { id: 'event', label: 'Event-based', icon: 'Zap' },
  { id: 'manual', label: 'Manual Trigger', icon: 'User' }
];

export const ACTION_TYPES = [
  { id: 'email', label: 'Send Email', icon: 'Mail' },
  { id: 'notification', label: 'Send Notification', icon: 'Bell' },
  { id: 'task', label: 'Create Task', icon: 'FileText' },
  { id: 'message', label: 'Send Message', icon: 'MessageSquare' },
  { id: 'api', label: 'API Call', icon: 'Zap' },
  { id: 'update', label: 'Update Record', icon: 'Settings' }
];

export const APPROVAL_TYPES = [
  { id: 'invoice', label: 'Invoice Approval', icon: 'FileText' },
  { id: 'arc', label: 'ARC Application', icon: 'Home' },
  { id: 'violation', label: 'Violation Review', icon: 'AlertTriangle' },
  { id: 'collection', label: 'Collection Advancement', icon: 'DollarSign' },
  { id: 'custom', label: 'Custom Approval', icon: 'CheckSquare' }
];

export const CONDITION_TYPES = [
  { id: 'equals', label: 'Equals' },
  { id: 'notEquals', label: 'Not Equals' },
  { id: 'contains', label: 'Contains' },
  { id: 'greaterThan', label: 'Greater Than' },
  { id: 'lessThan', label: 'Less Than' },
  { id: 'between', label: 'Between' },
  { id: 'isTrue', label: 'Is True' },
  { id: 'isFalse', label: 'Is False' }
];

export const APPROVAL_ROLES = [
  { id: 'board_member', label: 'Board Member' },
  { id: 'board_president', label: 'Board President' },
  { id: 'committee_member', label: 'Committee Member' },
  { id: 'committee_chair', label: 'Committee Chair' },
  { id: 'manager', label: 'Manager' },
  { id: 'invoice_approver', label: 'Invoice Approver' },
  { id: 'admin', label: 'Administrator' }
];
