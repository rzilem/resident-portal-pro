import { OnboardingTemplate, OnboardingProject, OnboardingStats } from '@/types/onboarding';

// Mock data for templates
const mockOnboardingTemplates: OnboardingTemplate[] = [
  {
    id: '1',
    name: 'Standard HOA Onboarding',
    description: 'A standard process for onboarding new HOA clients',
    clientType: 'hoa',
    processType: 'onboarding',
    isDefault: true,
    tags: ['standard', 'comprehensive'],
    taskGroups: [
      {
        id: '101',
        title: 'Initial Setup',
        day: 1,
        description: 'Tasks to complete within the first week',
        tasks: [
          {
            id: '1001',
            title: 'Collect association documents',
            description: 'Gather CC&Rs, bylaws, rules and regulations',
            days: 5,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '1002',
            title: 'Setup client in management software',
            days: 2,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: false
          },
          {
            id: '1003',
            title: 'Schedule kickoff meeting',
            days: 3,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 3
      },
      {
        id: '102',
        title: 'Financial Setup',
        day: 14,
        description: 'Financial tasks for the second and third weeks',
        tasks: [
          {
            id: '2001',
            title: 'Setup bank accounts',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '2002',
            title: 'Import financial history',
            days: 10,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      },
      {
        id: '103',
        title: 'Community Setup',
        day: 28,
        description: 'Setup community information and engagement',
        tasks: [
          {
            id: '3001',
            title: 'Setup community website',
            days: 14,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '3002',
            title: 'Send welcome letters to residents',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Condo Association Onboarding',
    description: 'Specialized process for onboarding condo associations',
    clientType: 'condo',
    processType: 'onboarding',
    tags: ['condos', 'specialized'],
    taskGroups: [
      {
        id: '201',
        title: 'Initial Assessment',
        day: 1,
        tasks: [
          {
            id: '1001',
            title: 'Property inspection',
            days: 3,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '1002',
            title: 'Review maintenance history',
            days: 5,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-02-10T10:15:00Z'
  },
  {
    id: '3',
    name: 'Standard HOA Offboarding',
    description: 'Standard process for offboarding HOA clients',
    clientType: 'hoa',
    processType: 'offboarding',
    tags: ['offboarding', 'transition'],
    taskGroups: [
      {
        id: '301',
        title: 'Document Preparation',
        day: 1,
        tasks: [
          {
            id: '3001',
            title: 'Prepare transition documents',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '3002',
            title: 'Export financial records',
            days: 5,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      },
      {
        id: '302',
        title: 'Handover',
        day: 14,
        tasks: [
          {
            id: '3003',
            title: 'Schedule handover meeting',
            days: 3,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '3004',
            title: 'Transfer bank account access',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    createdAt: '2023-03-05T14:30:00Z',
    updatedAt: '2023-03-05T14:30:00Z'
  }
];

// Mock data for onboarding projects
const mockOnboardingProjects: OnboardingProject[] = [
  {
    id: '1',
    name: 'Sunset Valley HOA Onboarding',
    associationId: '101',
    associationName: 'Sunset Valley HOA',
    templateId: '1',
    startDate: '2023-05-01T08:00:00Z',
    status: 'active',
    progress: 33,
    processType: 'onboarding',
    taskGroups: [
      {
        id: '101',
        title: 'Initial Setup',
        day: 1,
        description: 'Tasks to complete within the first week',
        tasks: [
          {
            id: '1001',
            title: 'Collect association documents',
            description: 'Gather CC&Rs, bylaws, rules and regulations',
            days: 5,
            status: 'completed',
            completedDate: '2023-05-06T15:30:00Z',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '1002',
            title: 'Setup client in management software',
            days: 2,
            status: 'completed',
            completedDate: '2023-05-03T11:15:00Z',
            category: 'internal',
            teamAssigned: true,
            clientVisible: false
          },
          {
            id: '1003',
            title: 'Schedule kickoff meeting',
            days: 3,
            status: 'in_progress',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 2,
        totalTasks: 3
      },
      {
        id: '102',
        title: 'Financial Setup',
        day: 14,
        description: 'Financial tasks for the second and third weeks',
        tasks: [
          {
            id: '2001',
            title: 'Setup bank accounts',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '2002',
            title: 'Import financial history',
            days: 10,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      },
      {
        id: '103',
        title: 'Community Setup',
        day: 28,
        description: 'Setup community information and engagement',
        tasks: [
          {
            id: '3001',
            title: 'Setup community website',
            days: 14,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '3002',
            title: 'Send welcome letters to residents',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    shareableLink: 'https://example.com/share/sunset-valley-hoa',
    createdAt: '2023-04-28T10:00:00Z',
    updatedAt: '2023-05-06T15:30:00Z'
  },
  {
    id: '2',
    name: 'Oakridge Condos Offboarding',
    associationId: '102',
    associationName: 'Oakridge Condos',
    templateId: '3',
    startDate: '2023-06-15T09:00:00Z',
    status: 'active',
    progress: 25,
    processType: 'offboarding',
    taskGroups: [
      {
        id: '301',
        title: 'Document Preparation',
        day: 1,
        tasks: [
          {
            id: '3001',
            title: 'Prepare transition documents',
            days: 7,
            status: 'completed',
            completedDate: '2023-06-22T16:45:00Z',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '3002',
            title: 'Export financial records',
            days: 5,
            status: 'in_progress',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 1,
        totalTasks: 2
      },
      {
        id: '302',
        title: 'Handover',
        day: 14,
        tasks: [
          {
            id: '3003',
            title: 'Schedule handover meeting',
            days: 3,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: '3004',
            title: 'Transfer bank account access',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          }
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    shareableLink: 'https://example.com/share/oakridge-condos',
    createdAt: '2023-06-10T14:30:00Z',
    updatedAt: '2023-06-22T16:45:00Z'
  }
];

// Helper for simulating API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const onboardingService = {
  // Get all templates
  getTemplates: async (): Promise<OnboardingTemplate[]> => {
    // Simulate API delay
    await delay(500);
    return mockOnboardingTemplates;
  },
  
  // Get template by ID
  getTemplateById: async (id: string): Promise<OnboardingTemplate | null> => {
    // Simulate API delay
    await delay(300);
    return mockOnboardingTemplates.find(t => t.id === id) || null;
  },
  
  // Create new template
  createTemplate: async (template: Omit<OnboardingTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<OnboardingTemplate> => {
    // Simulate API delay
    await delay(800);
    
    const newTemplate: OnboardingTemplate = {
      ...template,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      processType: template.processType || 'onboarding', // Default to onboarding if not specified
    };
    
    mockOnboardingTemplates.push(newTemplate);
    return newTemplate;
  },
  
  // Update existing template
  updateTemplate: async (id: string, updates: Partial<OnboardingTemplate>): Promise<OnboardingTemplate | null> => {
    // Simulate API delay
    await delay(800);
    
    const index = mockOnboardingTemplates.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    const updatedTemplate = {
      ...mockOnboardingTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockOnboardingTemplates[index] = updatedTemplate;
    return updatedTemplate;
  },
  
  // Delete template
  deleteTemplate: async (id: string): Promise<boolean> => {
    // Simulate API delay
    await delay(500);
    
    const index = mockOnboardingTemplates.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    mockOnboardingTemplates.splice(index, 1);
    return true;
  },
  
  // Get all onboarding projects
  getProjects: async (): Promise<OnboardingProject[]> => {
    // Simulate API delay
    await delay(500);
    return mockOnboardingProjects;
  },
  
  // Get project by ID
  getProjectById: async (id: string): Promise<OnboardingProject | null> => {
    // Simulate API delay
    await delay(300);
    return mockOnboardingProjects.find(p => p.id === id) || null;
  },
  
  // Create new project
  createProject: async (
    associationId: string, 
    associationName: string, 
    templateId: string,
    processType: 'onboarding' | 'offboarding' = 'onboarding'
  ): Promise<OnboardingProject> => {
    // Simulate API delay
    await delay(1000);
    
    // Get template to use
    const template = await onboardingService.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Create a new project based on the template
    const newProject: OnboardingProject = {
      id: Math.random().toString(36).substring(2, 11),
      name: `${associationName} ${processType === 'onboarding' ? 'Onboarding' : 'Offboarding'}`,
      associationId,
      associationName,
      templateId,
      startDate: new Date().toISOString(),
      status: 'active',
      progress: 0,
      processType,
      taskGroups: template.taskGroups.map(group => ({
        ...group,
        tasks: group.tasks.map(task => ({
          ...task,
          status: 'not_started'
        })),
        completedTasks: 0
      })),
      shareableLink: `https://example.com/share/${associationId}`,
      createdAt: new Date().toISOString()
    };
    
    mockOnboardingProjects.push(newProject);
    return newProject;
  },
  
  // Update task status
  updateTaskStatus: async (
    projectId: string,
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ): Promise<OnboardingProject | null> => {
    try {
      // Find the project in our mock data
      const projectIndex = mockOnboardingProjects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) return null;

      const project = { ...mockOnboardingProjects[projectIndex] };
      let taskGroupIndex = -1;
      let taskIndex = -1;

      // Find the task group and task
      project.taskGroups.forEach((group, groupIdx) => {
        const tIndex = group.tasks.findIndex(t => t.id === taskId);
        if (tIndex !== -1) {
          taskGroupIndex = groupIdx;
          taskIndex = tIndex;
        }
      });

      if (taskGroupIndex === -1 || taskIndex === -1) return null;

      // Create deep copies for immutability
      const updatedTaskGroups = [...project.taskGroups];
      const updatedTaskGroup = { ...updatedTaskGroups[taskGroupIndex] };
      const updatedTasks = [...updatedTaskGroup.tasks];
      const updatedTask = { ...updatedTasks[taskIndex] };

      // Update task status
      const previousStatus = updatedTask.status;
      updatedTask.status = status;

      // Update completedDate if task is marked as completed, or clear it if moving from completed to another status
      if (status === 'completed') {
        updatedTask.completedDate = new Date().toISOString();
      } else if (previousStatus === 'completed') {
        updatedTask.completedDate = undefined;
      }

      // Replace objects in the arrays
      updatedTasks[taskIndex] = updatedTask;
      updatedTaskGroup.tasks = updatedTasks;

      // Recalculate completed tasks count
      updatedTaskGroup.completedTasks = updatedTaskGroup.tasks.filter(t => t.status === 'completed').length;

      updatedTaskGroups[taskGroupIndex] = updatedTaskGroup;

      // Update project task groups
      const updatedProject = {
        ...project,
        taskGroups: updatedTaskGroups,
      };

      // Recalculate overall project progress
      const totalTasks = updatedProject.taskGroups.reduce((total, group) => total + group.totalTasks, 0);
      const completedTasks = updatedProject.taskGroups.reduce((total, group) => total + group.completedTasks, 0);
      updatedProject.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Check if project should be marked as completed
      if (totalTasks > 0 && completedTasks === totalTasks) {
        updatedProject.status = 'completed';
        updatedProject.completedDate = new Date().toISOString();
      }

      // Update mock data
      mockOnboardingProjects[projectIndex] = updatedProject;

      // Simulate API delay
      await delay(300);

      return updatedProject;
    } catch (error) {
      console.error('Error updating task status:', error);
      return null;
    }
  },
  
  // Get project statistics
  getProjectStats: async (projectId: string): Promise<{ stats: OnboardingStats } | null> => {
    // Simulate API delay
    await delay(400);
    
    const project = mockOnboardingProjects.find(p => p.id === projectId);
    if (!project) return null;
    
    // Calculate stats
    const totalTasks = project.taskGroups.reduce((total, group) => total + group.totalTasks, 0);
    const completedTasks = project.taskGroups.reduce((total, group) => total + group.completedTasks, 0);
    
    // Calculate days elapsed
    const startDate = new Date(project.startDate);
    const currentDate = new Date();
    const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Estimate days remaining based on progress
    let daysRemaining = 0;
    if (project.progress < 100) {
      // Simple calculation: if 33% complete in 10 days, then 100% would take 30 days total, so 20 days remaining
      daysRemaining = project.progress > 0 
        ? Math.round((daysElapsed * (100 - project.progress)) / project.progress)
        : 30; // Default if no progress yet
    }
    
    // Get upcoming deadlines
    const upcomingDeadlines = project.taskGroups
      .filter(group => group.day > daysElapsed)
      .map(group => ({
        day: group.day,
        tasksCount: group.tasks.filter(t => t.status !== 'completed').length
      }))
      .sort((a, b) => a.day - b.day)
      .slice(0, 3);
    
    return {
      stats: {
        totalTasks,
        completedTasks,
        progress: project.progress,
        daysElapsed,
        daysRemaining,
        upcomingDeadlines
      }
    };
  }
};
