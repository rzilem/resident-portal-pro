
import { v4 as uuid } from 'uuid';
import { OnboardingProject, OnboardingTask, OnboardingTemplate, OnboardingTaskGroup, OnboardingStats } from '@/types/onboarding';

// Default onboarding template with task groups based on provided screenshots
const defaultTemplate: OnboardingTemplate = {
  id: 'default-template',
  name: 'New Community Template',
  description: 'Client Onboarding',
  isDefault: true,
  clientType: 'hoa',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  taskGroups: [
    {
      id: 'day-1',
      title: 'Day 1',
      day: 1,
      tasks: [
        {
          id: uuid(),
          title: 'Gather Information from Prior Management',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: false
        },
        {
          id: uuid(),
          title: 'Create New Association',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Let Bank know - open new accounts, if applicable',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Order Debit Card',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Enter Bank Accounts',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Setup Funds',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Mark Association LIVE in system',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        }
      ],
      completedTasks: 0,
      totalTasks: 7
    },
    {
      id: 'day-5',
      title: 'Day 5',
      day: 5,
      tasks: [
        {
          id: uuid(),
          title: 'Send Welcome/Intro Letter',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Create Portal Logins',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Enter Board Members & Committees (after logins are created)',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Setup Homeowner Tags (Board Member Tags and Charge Tags)',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Update Customer Service Team',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Setup in Smartwebs, if applicable (based on Contract - Contact Ricky)',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Create connection in mailing system',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Logo, Banner, & Dashboard Pages',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        }
      ],
      completedTasks: 0,
      totalTasks: 8
    },
    {
      id: 'day-10',
      title: 'Day 10',
      day: 10,
      tasks: [],
      completedTasks: 0,
      totalTasks: 0
    },
    {
      id: 'day-15',
      title: 'Day 15',
      day: 15,
      tasks: [],
      completedTasks: 0,
      totalTasks: 0
    },
    {
      id: 'day-30',
      title: 'Day 30',
      day: 30,
      tasks: [
        {
          id: uuid(),
          title: 'Association Property Request',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Request Homeowner Ledgers and AR Report',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Request Access to Gate System (if applicable)',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Homeowner Transaction History Import',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Request Final Financials',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Request remaining accounts be closed and funds sent over',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Request zero balance statements after start date',
          days: 35,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        }
      ],
      completedTasks: 0,
      totalTasks: 7
    },
    {
      id: 'day-60',
      title: 'Day 60',
      day: 60,
      tasks: [],
      completedTasks: 0,
      totalTasks: 0
    }
  ]
};

// Additional templates for different client types
const condoTemplate: OnboardingTemplate = {
  id: 'condo-template',
  name: 'Condominium Onboarding',
  description: 'Specialized onboarding process for condominium associations',
  isDefault: false,
  clientType: 'condo',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ['condo', 'multi-unit'],
  taskGroups: [
    {
      id: 'day-1',
      title: 'Day 1',
      day: 1,
      tasks: [
        {
          id: uuid(),
          title: 'Gather Condominium Documents',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: false
        },
        {
          id: uuid(),
          title: 'Create New Association',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Setup Condo Reserves Account',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Request Floor Plans & Unit Documentation',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        }
      ],
      completedTasks: 0,
      totalTasks: 4
    },
    {
      id: 'day-5',
      title: 'Day 5',
      day: 5,
      tasks: [
        {
          id: uuid(),
          title: 'Setup Common Area Maintenance Schedule',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        },
        {
          id: uuid(),
          title: 'Create Unit Owner Directory',
          days: 10,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        }
      ],
      completedTasks: 0,
      totalTasks: 2
    }
  ]
};

const apartmentTemplate: OnboardingTemplate = {
  id: 'apartment-template',
  name: 'Apartment Complex Onboarding',
  description: 'Specialized onboarding process for apartment complexes',
  isDefault: false,
  clientType: 'apartment',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ['apartment', 'rental'],
  taskGroups: [
    {
      id: 'day-1',
      title: 'Day 1',
      day: 1,
      tasks: [
        {
          id: uuid(),
          title: 'Obtain Lease Agreements & Tenant Information',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: false
        },
        {
          id: uuid(),
          title: 'Setup Rental Management System',
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
  ]
};

// Mock data store for onboarding projects
let onboardingProjects: OnboardingProject[] = [];
let onboardingTemplates: OnboardingTemplate[] = [defaultTemplate, condoTemplate, apartmentTemplate];

export const onboardingService = {
  // Get all onboarding templates
  getTemplates: async (): Promise<OnboardingTemplate[]> => {
    return Promise.resolve([...onboardingTemplates]);
  },
  
  // Get templates by client type
  getTemplatesByClientType: async (clientType: string): Promise<OnboardingTemplate[]> => {
    const templates = onboardingTemplates.filter(t => t.clientType === clientType);
    return Promise.resolve([...templates]);
  },
  
  // Get template by ID
  getTemplateById: async (id: string): Promise<OnboardingTemplate | null> => {
    const template = onboardingTemplates.find(t => t.id === id);
    return Promise.resolve(template || null);
  },

  // Create a new template
  createTemplate: async (template: Omit<OnboardingTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<OnboardingTemplate> => {
    const now = new Date().toISOString();
    const newTemplate: OnboardingTemplate = {
      ...template,
      id: uuid(),
      createdAt: now,
      updatedAt: now
    };
    
    onboardingTemplates.push(newTemplate);
    return Promise.resolve(newTemplate);
  },
  
  // Update existing template
  updateTemplate: async (id: string, updates: Partial<OnboardingTemplate>): Promise<OnboardingTemplate | null> => {
    const templateIndex = onboardingTemplates.findIndex(t => t.id === id);
    
    if (templateIndex === -1) {
      return Promise.resolve(null);
    }
    
    const template = { ...onboardingTemplates[templateIndex] };
    
    // Apply updates
    const updatedTemplate: OnboardingTemplate = {
      ...template,
      ...updates,
      id: template.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    onboardingTemplates[templateIndex] = updatedTemplate;
    return Promise.resolve(updatedTemplate);
  },
  
  // Delete template
  deleteTemplate: async (id: string): Promise<boolean> => {
    const initialLength = onboardingTemplates.length;
    onboardingTemplates = onboardingTemplates.filter(t => t.id !== id);
    
    return Promise.resolve(initialLength !== onboardingTemplates.length);
  },
  
  // Create a new onboarding project
  createProject: async (
    associationId: string, 
    associationName: string, 
    templateId: string
  ): Promise<OnboardingProject> => {
    const template = onboardingTemplates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    const startDate = new Date().toISOString();
    
    // Create a deep copy of template task groups
    const taskGroups = JSON.parse(JSON.stringify(template.taskGroups));
    
    // Generate new IDs for all tasks
    taskGroups.forEach((group: OnboardingTaskGroup) => {
      group.tasks.forEach((task: OnboardingTask) => {
        task.id = uuid();
        task.associationId = associationId;
        
        // Set due date based on days
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + task.days);
        task.dueDate = dueDate.toISOString();
      });
    });
    
    const newProject: OnboardingProject = {
      id: uuid(),
      name: `Onboarding: ${associationName}`,
      associationId,
      associationName,
      templateId,
      startDate,
      status: 'active',
      progress: 0,
      taskGroups,
      createdAt: startDate,
      shareableLink: `https://share.residentpro.org/onboarding/${uuid()}`
    };
    
    onboardingProjects.push(newProject);
    return Promise.resolve(newProject);
  },
  
  // Get all onboarding projects
  getProjects: async (): Promise<OnboardingProject[]> => {
    return Promise.resolve([...onboardingProjects]);
  },
  
  // Get project by ID
  getProjectById: async (id: string): Promise<OnboardingProject | null> => {
    const project = onboardingProjects.find(p => p.id === id);
    return Promise.resolve(project || null);
  },
  
  // Get projects by association ID
  getProjectsByAssociationId: async (associationId: string): Promise<OnboardingProject[]> => {
    const projects = onboardingProjects.filter(p => p.associationId === associationId);
    return Promise.resolve(projects);
  },
  
  // Update task status
  updateTaskStatus: async (
    projectId: string,
    taskGroupId: string,
    taskId: string,
    status: OnboardingTask['status']
  ): Promise<OnboardingProject | null> => {
    const projectIndex = onboardingProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return Promise.resolve(null);
    }
    
    const project = { ...onboardingProjects[projectIndex] };
    const taskGroupIndex = project.taskGroups.findIndex(g => g.id === taskGroupId);
    
    if (taskGroupIndex === -1) {
      return Promise.resolve(null);
    }
    
    const taskGroup = { ...project.taskGroups[taskGroupIndex] };
    const taskIndex = taskGroup.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return Promise.resolve(null);
    }
    
    // Update the task status
    const updatedTask = { ...taskGroup.tasks[taskIndex], status };
    
    // If completing the task, set completed date
    if (status === 'completed') {
      updatedTask.completedDate = new Date().toISOString();
      taskGroup.completedTasks++;
    } else if (taskGroup.tasks[taskIndex].status === 'completed' && status !== 'completed') {
      // If un-completing a task
      updatedTask.completedDate = undefined;
      taskGroup.completedTasks--;
    }
    
    // Update task in task group
    const updatedTasks = [...taskGroup.tasks];
    updatedTasks[taskIndex] = updatedTask;
    
    // Update task group in project
    const updatedTaskGroups = [...project.taskGroups];
    updatedTaskGroups[taskGroupIndex] = { ...taskGroup, tasks: updatedTasks };
    
    // Calculate new progress
    let totalTasks = 0;
    let completedTasks = 0;
    
    updatedTaskGroups.forEach(group => {
      totalTasks += group.totalTasks;
      completedTasks += group.completedTasks;
    });
    
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update project
    const updatedProject = {
      ...project,
      taskGroups: updatedTaskGroups,
      progress,
      updatedAt: new Date().toISOString()
    };
    
    // If all tasks completed, mark project as completed
    if (progress === 100) {
      updatedProject.status = 'completed';
      updatedProject.completedDate = new Date().toISOString();
    }
    
    // Update in collection
    onboardingProjects[projectIndex] = updatedProject;
    
    return Promise.resolve(updatedProject);
  },
  
  // Get onboarding project statistics
  getProjectStats: async (projectId: string): Promise<{ stats: OnboardingStats } | null> => {
    const project = onboardingProjects.find(p => p.id === projectId);
    
    if (!project) {
      return Promise.resolve(null);
    }
    
    let totalTasks = 0;
    let completedTasks = 0;
    const upcomingDeadlines: { day: number; tasksCount: number }[] = [];
    
    // Collect deadline data and count tasks
    project.taskGroups.forEach(group => {
      totalTasks += group.tasks.length;
      completedTasks += group.tasks.filter(t => t.status === 'completed').length;
      
      if (group.tasks.length > 0) {
        upcomingDeadlines.push({
          day: group.day,
          tasksCount: group.tasks.filter(t => t.status !== 'completed').length
        });
      }
    });
    
    // Calculate days elapsed
    const startDate = new Date(project.startDate);
    const currentDate = new Date();
    const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Estimate days remaining based on incomplete tasks and their due dates
    let maxDaysRemaining = 0;
    project.taskGroups.forEach(group => {
      group.tasks.forEach(task => {
        if (task.status !== 'completed' && task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const daysUntilDue = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilDue > maxDaysRemaining) {
            maxDaysRemaining = daysUntilDue;
          }
        }
      });
    });
    
    const stats: OnboardingStats = {
      totalTasks,
      completedTasks,
      progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      daysElapsed,
      daysRemaining: maxDaysRemaining,
      upcomingDeadlines: upcomingDeadlines.filter(d => d.tasksCount > 0)
    };
    
    return Promise.resolve({ stats });
  }
};
