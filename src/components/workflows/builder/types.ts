
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

export type WorkflowStep = TriggerStep | ActionStep | ConditionStep;

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
