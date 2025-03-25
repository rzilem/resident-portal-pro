
import { useState, useEffect, useCallback } from 'react';
import { workflowService } from '@/services/workflowService';
import { Workflow, WorkflowStep, WorkflowTemplate } from '@/types/workflow';
import { toast } from 'sonner';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeWorkflows, setActiveWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all workflows
  const fetchWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await workflowService.getAllWorkflows();
      setWorkflows(data);
      setActiveWorkflows(data.filter(w => w.status === 'active'));
      setError(null);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      const data = await workflowService.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load workflow templates');
    }
  }, []);
  
  // Create workflow
  const createWorkflow = useCallback(async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newWorkflow = await workflowService.createWorkflow(workflow);
      setWorkflows(prev => [...prev, newWorkflow]);
      toast.success('Workflow created successfully');
      return newWorkflow;
    } catch (err) {
      console.error('Error creating workflow:', err);
      toast.error('Failed to create workflow');
      throw err;
    }
  }, []);
  
  // Create from template
  const createFromTemplate = useCallback(async (templateId: string, customizations?: Partial<Workflow>) => {
    try {
      const newWorkflow = await workflowService.createFromTemplate(templateId, customizations);
      setWorkflows(prev => [...prev, newWorkflow]);
      toast.success('Workflow created from template');
      return newWorkflow;
    } catch (err) {
      console.error('Error creating workflow from template:', err);
      toast.error('Failed to create workflow from template');
      throw err;
    }
  }, []);
  
  // Update workflow
  const updateWorkflow = useCallback(async (id: string, updates: Partial<Workflow>) => {
    try {
      const updatedWorkflow = await workflowService.updateWorkflow(id, updates);
      setWorkflows(prev => 
        prev.map(w => w.id === id ? updatedWorkflow : w)
      );
      
      // Update active workflows if needed
      if (updates.status !== undefined) {
        if (updates.status === 'active') {
          setActiveWorkflows(prev => [...prev, updatedWorkflow]);
        } else {
          setActiveWorkflows(prev => prev.filter(w => w.id !== id));
        }
      }
      
      toast.success('Workflow updated successfully');
      return updatedWorkflow;
    } catch (err) {
      console.error('Error updating workflow:', err);
      toast.error('Failed to update workflow');
      throw err;
    }
  }, []);
  
  // Delete workflow
  const deleteWorkflow = useCallback(async (id: string) => {
    try {
      await workflowService.deleteWorkflow(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
      setActiveWorkflows(prev => prev.filter(w => w.id !== id));
      toast.success('Workflow deleted successfully');
    } catch (err) {
      console.error('Error deleting workflow:', err);
      toast.error('Failed to delete workflow');
      throw err;
    }
  }, []);
  
  // Toggle workflow status
  const toggleWorkflowStatus = useCallback(async (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;
    
    const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
    
    try {
      await updateWorkflow(id, { status: newStatus });
      toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error toggling workflow status:', err);
      toast.error(`Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} workflow`);
      throw err;
    }
  }, [workflows, updateWorkflow]);
  
  // Duplicate workflow
  const duplicateWorkflow = useCallback(async (id: string) => {
    try {
      const duplicatedWorkflow = await workflowService.duplicateWorkflow(id);
      setWorkflows(prev => [...prev, duplicatedWorkflow]);
      toast.success('Workflow duplicated successfully');
      return duplicatedWorkflow;
    } catch (err) {
      console.error('Error duplicating workflow:', err);
      toast.error('Failed to duplicate workflow');
      throw err;
    }
  }, []);
  
  // Load data on initial render
  useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
  }, [fetchWorkflows, fetchTemplates]);
  
  return {
    workflows,
    activeWorkflows,
    templates,
    isLoading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflowStatus,
    duplicateWorkflow,
    createFromTemplate
  };
}
