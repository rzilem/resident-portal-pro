
import { useState, useEffect, useCallback } from 'react';
import { EmailWorkflowRule, emailWorkflowService } from '@/services/emailWorkflowService';
import { toast } from 'sonner';

export function useEmailWorkflows() {
  const [workflowRules, setWorkflowRules] = useState<EmailWorkflowRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchWorkflowRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rules = await emailWorkflowService.getAllRules();
      setWorkflowRules(rules);
    } catch (err) {
      console.error('Failed to fetch email workflow rules:', err);
      setError('Failed to load email workflow rules');
      toast.error('Failed to load email workflow rules');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load workflow rules on initial mount
  useEffect(() => {
    fetchWorkflowRules();
  }, [fetchWorkflowRules]);
  
  const createWorkflowRule = useCallback(async (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    try {
      const newRule = await emailWorkflowService.createRule(rule);
      setWorkflowRules(prev => [...prev, newRule]);
      toast.success('Email workflow rule created successfully');
      return newRule;
    } catch (err) {
      console.error('Failed to create email workflow rule:', err);
      toast.error('Failed to create email workflow rule');
      throw err;
    }
  }, []);
  
  const updateWorkflowRule = useCallback(async (id: string, updates: Partial<Omit<EmailWorkflowRule, 'id' | 'createdAt'>>) => {
    try {
      const updatedRule = await emailWorkflowService.updateRule(id, updates);
      setWorkflowRules(prev => prev.map(rule => rule.id === id ? updatedRule : rule));
      toast.success('Email workflow rule updated successfully');
      return updatedRule;
    } catch (err) {
      console.error('Failed to update email workflow rule:', err);
      toast.error('Failed to update email workflow rule');
      throw err;
    }
  }, []);
  
  const deleteWorkflowRule = useCallback(async (id: string) => {
    try {
      await emailWorkflowService.deleteRule(id);
      setWorkflowRules(prev => prev.filter(rule => rule.id !== id));
      toast.success('Email workflow rule deleted successfully');
    } catch (err) {
      console.error('Failed to delete email workflow rule:', err);
      toast.error('Failed to delete email workflow rule');
      throw err;
    }
  }, []);
  
  const toggleWorkflowRuleStatus = useCallback(async (id: string) => {
    try {
      const updatedRule = await emailWorkflowService.toggleRuleStatus(id);
      setWorkflowRules(prev => prev.map(rule => rule.id === id ? updatedRule : rule));
      toast.success(`Email workflow rule ${updatedRule.isActive ? 'activated' : 'deactivated'} successfully`);
      return updatedRule;
    } catch (err) {
      console.error('Failed to toggle email workflow rule status:', err);
      toast.error('Failed to update email workflow rule status');
      throw err;
    }
  }, []);
  
  return {
    workflowRules,
    isLoading,
    error,
    fetchWorkflowRules,
    createWorkflowRule,
    updateWorkflowRule,
    deleteWorkflowRule,
    toggleWorkflowRuleStatus
  };
}
