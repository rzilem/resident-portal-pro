
import { useState, useEffect } from 'react';
import { OnboardingProject, OnboardingTemplate, OnboardingTask } from '@/types/onboarding';
import { toast } from 'sonner';
import { ProjectFormData } from '@/components/onboarding/NewProjectDialog';

// Sample data for demonstration
const mockTemplates: OnboardingTemplate[] = [
  {
    id: 'template-1',
    name: 'Standard HOA Onboarding',
    description: 'Standard process for onboarding new HOA clients',
    taskGroups: [
      {
        id: 'tg-1',
        title: 'Initial Setup',
        day: 1,
        tasks: [
          {
            id: 'task-1',
            title: 'Collect governing documents',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: 'task-2',
            title: 'Setup client in accounting system',
            days: 3,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: false
          },
        ],
        completedTasks: 0,
        totalTasks: 2
      },
      {
        id: 'tg-2',
        title: 'Financial Review',
        day: 7,
        tasks: [
          {
            id: 'task-3',
            title: 'Review financial statements',
            days: 5,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: 'task-4',
            title: 'Import account balances',
            days: 2,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: false
          },
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    processType: 'onboarding'
  },
  {
    id: 'template-2',
    name: 'Condominium Onboarding',
    description: 'Specialized process for condominium associations',
    taskGroups: [
      {
        id: 'tg-3',
        title: 'Document Collection',
        day: 1,
        tasks: [
          {
            id: 'task-5',
            title: 'Collect governing documents',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: 'task-6',
            title: 'Collect insurance certificates',
            days: 7,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    processType: 'onboarding'
  },
  {
    id: 'template-3',
    name: 'Standard Client Offboarding',
    description: 'Process for transitioning clients to new management',
    taskGroups: [
      {
        id: 'tg-4',
        title: 'Document Handoff',
        day: 1,
        tasks: [
          {
            id: 'task-7',
            title: 'Prepare document archive',
            days: 14,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
        ],
        completedTasks: 0,
        totalTasks: 1
      }
    ],
    processType: 'offboarding'
  }
];

const mockProjects: OnboardingProject[] = [
  {
    id: 'project-1',
    name: 'Oakridge HOA Onboarding',
    associationId: 'assoc-1',
    associationName: 'Oakridge HOA',
    templateId: 'template-1',
    startDate: new Date(2024, 2, 15).toISOString(),
    status: 'active',
    progress: 25,
    taskGroups: [
      {
        id: 'tg-1',
        title: 'Initial Setup',
        day: 1,
        tasks: [
          {
            id: 'task-1',
            title: 'Collect governing documents',
            days: 7,
            status: 'completed',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true,
            completedDate: new Date(2024, 2, 20).toISOString()
          },
          {
            id: 'task-2',
            title: 'Setup client in accounting system',
            days: 3,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: false
          },
        ],
        completedTasks: 1,
        totalTasks: 2
      },
      {
        id: 'tg-2',
        title: 'Financial Review',
        day: 7,
        tasks: [
          {
            id: 'task-3',
            title: 'Review financial statements',
            days: 5,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: true
          },
          {
            id: 'task-4',
            title: 'Import account balances',
            days: 2,
            status: 'not_started',
            category: 'internal',
            teamAssigned: true,
            clientVisible: false
          },
        ],
        completedTasks: 0,
        totalTasks: 2
      }
    ],
    createdAt: new Date(2024, 2, 15).toISOString(),
    processType: 'onboarding'
  }
];

export function useOnboardingProjects() {
  const [projects, setProjects] = useState<OnboardingProject[]>([]);
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch projects and templates
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real application, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        setProjects(mockProjects);
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getProjectById = (projectId: string): OnboardingProject | undefined => {
    return projects.find(project => project.id === projectId);
  };
  
  const createProject = async (data: ProjectFormData): Promise<void> => {
    try {
      setIsCreating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the template
      const template = templates.find(t => t.id === data.templateId);
      if (!template) throw new Error('Template not found');
      
      // Create new project
      const newProject: OnboardingProject = {
        id: `project-${Date.now()}`,
        name: data.name,
        associationId: data.associationId,
        associationName: data.associationName,
        templateId: data.templateId,
        startDate: data.startDate.toISOString(),
        status: 'active',
        progress: 0,
        taskGroups: JSON.parse(JSON.stringify(template.taskGroups)), // Deep clone
        createdAt: new Date().toISOString(),
        processType: data.processType
      };
      
      setProjects(prev => [...prev, newProject]);
      toast.success('Project created successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };
  
  const updateTaskStatus = (
    projectId: string,
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ): void => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id !== projectId) return project;
        
        // Update the task status
        const updatedTaskGroups = project.taskGroups.map(group => {
          if (group.id !== taskGroupId) return group;
          
          const updatedTasks = group.tasks.map(task => {
            if (task.id !== taskId) return task;
            
            // Update task status and completedDate if needed
            return {
              ...task,
              status,
              completedDate: status === 'completed' ? new Date().toISOString() : undefined
            };
          });
          
          // Count completed tasks in this group
          const completedTasks = updatedTasks.filter(task => task.status === 'completed').length;
          
          return {
            ...group,
            tasks: updatedTasks,
            completedTasks
          };
        });
        
        // Calculate overall progress
        const totalTasks = updatedTaskGroups.reduce((sum, group) => sum + group.totalTasks, 0);
        const completedTasks = updatedTaskGroups.reduce((sum, group) => sum + group.completedTasks, 0);
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        return {
          ...project,
          taskGroups: updatedTaskGroups,
          progress
        };
      });
    });
    
    toast.success(`Task ${status === 'completed' ? 'completed' : 'updated'}`);
  };
  
  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(prev => prev.filter(project => project.id !== projectId));
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };
  
  return {
    projects,
    templates,
    isLoading,
    isCreating,
    getProjectById,
    createProject,
    updateTaskStatus,
    deleteProject
  };
}
