
import { useState, useEffect } from 'react';
import { Workflow, WorkflowTemplate } from '@/types/workflow';
import { workflowService } from '@/services/workflowService';
import { workflowTemplates } from '@/data/workflowTemplates';

interface UseWorkflowsProps {
  associationId?: string;
}

export function useWorkflows({ associationId }: UseWorkflowsProps = {}) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to get workflows for the association
        const data = await workflowService.getAllWorkflows();
        
        // Filter by association if needed
        const filteredData = associationId 
          ? data.filter(w => 'associationId' in w && (w.associationId === associationId || !w.associationId))
          : data;
          
        setWorkflows(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        setError('Failed to load workflows');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkflows();
  }, [associationId]);
  
  // Active workflows - only those with 'active' status
  const activeWorkflows = workflows.filter(workflow => workflow.status === 'active');
  
  // Get workflow templates from the data file
  const templates = workflowTemplates;
  
  // Create a workflow from a template
  const createFromTemplate = async (templateId: string) => {
    try {
      const newWorkflow = await workflowService.createFromTemplate(templateId);
      setWorkflows(prev => [...prev, newWorkflow]);
      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow from template:', error);
      throw error;
    }
  };
  
  // Update an existing workflow
  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    try {
      const updatedWorkflow = await workflowService.updateWorkflow(id, updates);
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  };
  
  // Create a new workflow
  const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newWorkflow = await workflowService.createWorkflow(workflow);
      setWorkflows(prev => [...prev, newWorkflow]);
      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  };
  
  // Delete a workflow
  const deleteWorkflow = async (id: string) => {
    try {
      await workflowService.deleteWorkflow(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  };
  
  // Duplicate a workflow
  const duplicateWorkflow = async (id: string) => {
    try {
      const newWorkflow = await workflowService.duplicateWorkflow(id);
      setWorkflows(prev => [...prev, newWorkflow]);
      return newWorkflow;
    } catch (error) {
      console.error('Error duplicating workflow:', error);
      throw error;
    }
  };
  
  // Toggle workflow status (active/inactive)
  const toggleWorkflowStatus = async (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;
    
    const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
    return updateWorkflow(id, { status: newStatus });
  };
  
  return {
    workflows,
    activeWorkflows,
    templates,
    isLoading,
    error,
    createFromTemplate,
    updateWorkflow,
    createWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    toggleWorkflowStatus,
  };
}
