
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { emailWorkflowService, EmailWorkflowRule, workflowTypes } from '@/services/emailWorkflowService';

export function useEmailWorkflows() {
  const [workflowRules, setWorkflowRules] = useState<EmailWorkflowRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all workflow rules
  const fetchWorkflowRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rules = emailWorkflowService.getAllWorkflowRules();
      setWorkflowRules(rules);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch email workflow rules'));
      toast.error('Failed to load email workflow rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new workflow rule
  const createWorkflowRule = useCallback(async (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    try {
      const newRule = emailWorkflowService.createWorkflowRule(rule);
      setWorkflowRules(prev => [...prev, newRule]);
      toast.success('Email workflow rule created successfully');
      return newRule;
    } catch (err) {
      toast.error('Failed to create email workflow rule');
      throw err;
    }
  }, []);

  // Update a workflow rule
  const updateWorkflowRule = useCallback(async (id: string, updates: Partial<EmailWorkflowRule>) => {
    try {
      const updatedRule = emailWorkflowService.updateWorkflowRule(id, updates);
      setWorkflowRules(prev => 
        prev.map(rule => rule.id === id ? updatedRule : rule)
      );
      toast.success('Email workflow rule updated successfully');
      return updatedRule;
    } catch (err) {
      toast.error('Failed to update email workflow rule');
      throw err;
    }
  }, []);

  // Delete a workflow rule
  const deleteWorkflowRule = useCallback(async (id: string) => {
    try {
      const success = emailWorkflowService.deleteWorkflowRule(id);
      if (success) {
        setWorkflowRules(prev => prev.filter(rule => rule.id !== id));
        toast.success('Email workflow rule deleted successfully');
      }
      return success;
    } catch (err) {
      toast.error('Failed to delete email workflow rule');
      throw err;
    }
  }, []);

  // Toggle workflow rule status
  const toggleWorkflowRuleStatus = useCallback(async (id: string) => {
    try {
      const updatedRule = emailWorkflowService.toggleWorkflowRuleStatus(id);
      setWorkflowRules(prev => 
        prev.map(rule => rule.id === id ? updatedRule : rule)
      );
      toast.success(`Email workflow rule ${updatedRule.isActive ? 'activated' : 'deactivated'} successfully`);
      return updatedRule;
    } catch (err) {
      toast.error('Failed to update email workflow rule status');
      throw err;
    }
  }, []);

  // Load rules on mount
  useEffect(() => {
    fetchWorkflowRules();
  }, [fetchWorkflowRules]);

  return {
    workflowRules,
    workflowTypes,
    isLoading,
    error,
    fetchWorkflowRules,
    createWorkflowRule,
    updateWorkflowRule,
    deleteWorkflowRule,
    toggleWorkflowRuleStatus
  };
}
