
export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  lastEditedAt?: string;
  createdBy?: string;
}

export type WorkflowStepType = 'trigger' | 'action' | 'condition';

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

export type WorkflowStep = TriggerStep | ActionStep | ConditionStep;

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: number;
  icon?: React.ReactNode;
  popular?: boolean;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  started: string;
  completed?: string;
  status: 'running' | 'completed' | 'failed';
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
