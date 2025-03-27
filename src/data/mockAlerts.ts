
import { Alert } from '@/types/alert';
import { v4 as uuidv4 } from 'uuid';

// Generate a set of mock alerts with different severities and types
export const mockAlerts: Alert[] = [
  {
    id: uuidv4(),
    title: 'Invoice Approval Pending',
    description: 'There are 5 invoices awaiting approval for more than 7 days.',
    severity: 'high',
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    scope: 'global',
    source: 'system',
    category: 'financial',
    associationId: null,
    isRecent: true,
    solutions: [
      {
        id: uuidv4(),
        title: 'Review & Approve Invoices',
        description: 'Review and approve pending invoices in the invoice queue.',
        actionType: 'workflow',
        workflowTemplateId: 'wf-invoice-review',
        steps: [
          'Navigate to Invoice Queue',
          'Review each pending invoice',
          'Approve or reject as appropriate'
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Security Certificates Expiring',
    description: 'SSL certificates for the resident portal will expire in 14 days.',
    severity: 'critical',
    status: 'new',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    scope: 'global',
    source: 'system',
    category: 'security',
    associationId: null,
    isRecent: true,
    solutions: [
      {
        id: uuidv4(),
        title: 'Renew SSL Certificates',
        description: 'Contact IT department to renew SSL certificates before expiration.',
        actionType: 'manual',
        steps: [
          'Contact IT department',
          'Request certificate renewal',
          'Verify renewal completion'
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Budget Variance Detected',
    description: 'Maintenance expenses exceed budget by 15% for Oceanview Heights Association.',
    severity: 'medium',
    status: 'new',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    scope: 'association',
    source: 'system',
    category: 'financial',
    associationId: 'assoc-1',
    isRecent: true,
    solutions: [
      {
        id: uuidv4(),
        title: 'Review Budget Allocation',
        description: 'Analyze spending patterns and adjust budget allocations as needed.',
        actionType: 'workflow',
        workflowTemplateId: 'wf-budget-adjustment',
        steps: [
          'Generate budget variance report',
          'Identify problematic expense categories',
          'Propose budget adjustments'
        ]
      },
      {
        id: uuidv4(),
        title: 'Schedule Board Review',
        description: 'Schedule a meeting with the board to discuss budget variances.',
        actionType: 'manual',
        steps: [
          'Contact board members',
          'Schedule meeting',
          'Prepare variance report for presentation'
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Compliance Notices Due',
    description: 'Annual compliance notices need to be sent to all homeowners by the end of the month.',
    severity: 'medium',
    status: 'new',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    scope: 'global',
    source: 'system',
    category: 'compliance',
    associationId: null,
    isRecent: true,
    solutions: [
      {
        id: uuidv4(),
        title: 'Generate & Send Notices',
        description: 'Use the communication system to generate and send compliance notices.',
        actionType: 'workflow',
        workflowTemplateId: 'wf-compliance-notices',
        steps: [
          'Generate compliance notice templates',
          'Review and approve notices',
          'Schedule bulk sending to homeowners'
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'High Water Usage Detected',
    description: 'Several units in Lakeside Community showing abnormally high water usage patterns.',
    severity: 'high',
    status: 'new',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    scope: 'association',
    source: 'system',
    category: 'maintenance',
    associationId: 'assoc-2',
    isRecent: true,
    solutions: [
      {
        id: uuidv4(),
        title: 'Initiate Leak Investigation',
        description: 'Schedule maintenance team to inspect potential water leaks in identified units.',
        actionType: 'manual',
        steps: [
          'Identify affected units',
          'Schedule maintenance visits',
          'Document findings and repair needs'
        ]
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Resident Portal Usage Declining',
    description: 'Resident portal logins have decreased by 30% over the past month.',
    severity: 'low',
    status: 'new',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    scope: 'global',
    source: 'analytics',
    category: 'engagement',
    associationId: null,
    isRecent: true,
    solutions: [
      {
        id: uuidv4(),
        title: 'Send Portal Reminder',
        description: 'Send a communication reminding residents of portal benefits and features.',
        actionType: 'workflow',
        workflowTemplateId: 'wf-resident-engagement',
        steps: [
          'Draft portal reminder message',
          'Include key benefits and recent features',
          'Schedule sending to all residents'
        ]
      }
    ]
  }
];

// Create an alias for compatibility with existing code
export const alertsDatabase = mockAlerts;
