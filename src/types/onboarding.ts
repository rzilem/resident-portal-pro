
export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  days: number;
  assignee?: string;
  assigneeInitials?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  dueDate?: string;
  completedDate?: string;
  category: 'internal' | 'client';
  teamAssigned: boolean;
  associationId?: string;
  clientVisible: boolean;
  requiredDocuments?: string[];
  notes?: string[];
}

export interface OnboardingTaskGroup {
  id: string;
  title: string;
  day: number;
  description?: string;
  tasks: OnboardingTask[];
  completedTasks: number;
  totalTasks: number;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  taskGroups: OnboardingTaskGroup[];
  isDefault?: boolean;
}

export interface OnboardingProject {
  id: string;
  name: string;
  associationId: string;
  associationName: string;
  templateId: string;
  startDate: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  taskGroups: OnboardingTaskGroup[];
  shareableLink?: string;
  createdAt: string;
  updatedAt?: string;
  completedDate?: string;
}

export interface OnboardingStats {
  totalTasks: number;
  completedTasks: number;
  progress: number;
  daysElapsed: number;
  daysRemaining: number;
  upcomingDeadlines: {
    day: number;
    tasksCount: number;
  }[];
}
