
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { EmailWorkflowRule } from '@/services/emailWorkflowService';

export const useEmailWorkflows = () => {
  const [workflowRules, setWorkflowRules] = useState<EmailWorkflowRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Sample workflow rules data
  const sampleWorkflowRules: EmailWorkflowRule[] = [
    {
      id: '1',
      name: 'Maintenance Requests',
      inboundEmail: 'maintenance@example.com',
      workflowType: 'Maintenance Request',
      forwardTo: 'maintenance-team@example.com',
      isActive: true,
      createdAt: '2023-06-15T10:00:00Z',
      description: 'Automatically create maintenance requests from emails'
    },
    {
      id: '2',
      name: 'Accounting Inquiries',
      inboundEmail: 'accounting@example.com',
      workflowType: 'Accounting',
      forwardTo: 'finance@example.com',
      isActive: true,
      createdAt: '2023-05-20T14:30:00Z',
      description: 'Forward accounting questions to finance team'
    },
    {
      id: '3',
      name: 'Invoice Processing',
      inboundEmail: 'invoices@example.com',
      workflowType: 'Invoice',
      forwardTo: 'ap@example.com',
      isActive: true,
      createdAt: '2023-08-10T08:00:00Z',
      description: 'Process incoming invoices with OCR',
      enableOcr: true,
      ocrSettings: {
        extractVendor: true,
        extractDate: true,
        extractAmount: true,
        extractInvoiceNumber: true,
        extractLineItems: false,
        suggestGlAccount: true,
        confidence: 'medium'
      }
    },
    {
      id: '4',
      name: 'Violation Reports',
      inboundEmail: 'violations@example.com',
      workflowType: 'Compliance',
      forwardTo: 'compliance@example.com',
      isActive: false,
      createdAt: '2023-07-01T09:15:00Z',
      description: 'Process violation reports and create compliance records'
    }
  ];

  // Fetch workflow rules
  const fetchWorkflowRules = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setWorkflowRules(sampleWorkflowRules);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Create a new workflow rule
  const createWorkflowRule = useCallback((ruleData: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    
    // Create new rule with ID and timestamp
    const newRule: EmailWorkflowRule = {
      ...ruleData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
      setWorkflowRules(prev => [...prev, newRule]);
      setIsLoading(false);
      
      toast({
        title: "Workflow rule created",
        description: `${newRule.name} was created successfully.`,
      });
    }, 500);
  }, [toast]);
  
  // Update an existing workflow rule
  const updateWorkflowRule = useCallback((id: string, ruleData: Partial<Omit<EmailWorkflowRule, 'id' | 'createdAt'>>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWorkflowRules(prev => 
        prev.map(rule => 
          rule.id === id ? { ...rule, ...ruleData } : rule
        )
      );
      setIsLoading(false);
      
      toast({
        title: "Workflow rule updated",
        description: "The workflow rule was updated successfully.",
      });
    }, 500);
  }, [toast]);
  
  // Delete a workflow rule
  const deleteWorkflowRule = useCallback((id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWorkflowRules(prev => prev.filter(rule => rule.id !== id));
      setIsLoading(false);
      
      toast({
        title: "Workflow rule deleted",
        description: "The workflow rule was deleted successfully.",
      });
    }, 500);
  }, [toast]);
  
  // Toggle active status of a workflow rule
  const toggleWorkflowRuleStatus = useCallback((id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWorkflowRules(prev => 
        prev.map(rule => 
          rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
        )
      );
      setIsLoading(false);
      
      toast({
        title: "Status updated",
        description: "The workflow rule status was updated successfully.",
      });
    }, 500);
  }, [toast]);
  
  // Load workflow rules when component mounts
  useEffect(() => {
    fetchWorkflowRules();
  }, [fetchWorkflowRules]);
  
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
};
