
import { Alert } from '@/types/alert';

// Mock database for alerts until we have real backend storage
export const alertsDatabase: Alert[] = [
  {
    id: '1',
    title: 'Reserve Transfer Needed',
    description: 'Sunset Heights HOA operating account balance is critically low. Consider transferring funds from reserves.',
    type: 'financial',
    severity: 'critical',
    associationId: 'sunset-heights',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'new',
    solutions: [
      {
        id: '1-1',
        title: 'Transfer Funds',
        description: 'Initiate a transfer of funds from reserve account to operating account',
        actionType: 'workflow',
        workflowTemplateId: 'fund-transfer',
        action: async () => {/* Will be implemented */}
      },
      {
        id: '1-2',
        title: 'Schedule Board Vote',
        description: 'Schedule emergency board vote to approve reserve transfer',
        actionType: 'workflow',
        workflowTemplateId: 'board-vote',
        action: async () => {/* Will be implemented */}
      }
    ]
  },
  {
    id: '2',
    title: 'Insurance Renewal',
    description: 'Property insurance policy renewal is due in 30 days. Begin gathering quotes now.',
    type: 'operational',
    severity: 'high',
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    status: 'new',
    solutions: [
      {
        id: '2-1',
        title: 'Request Quotes',
        description: 'Send requests for quotes to preferred insurance providers',
        actionType: 'workflow',
        workflowTemplateId: 'insurance-quotes',
        action: async () => {/* Will be implemented */}
      },
      {
        id: '2-2',
        title: 'Schedule Review',
        description: 'Schedule insurance review meeting with board',
        actionType: 'workflow',
        workflowTemplateId: 'schedule-meeting',
        action: async () => {/* Will be implemented */}
      }
    ]
  },
  {
    id: '3',
    title: 'Delinquency Increase',
    description: 'Delinquency rate has increased by 8% this month. Consider reviewing collection procedures.',
    type: 'financial',
    severity: 'medium',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: 'new',
    solutions: [
      {
        id: '3-1',
        title: 'Send Reminders',
        description: 'Send payment reminders to delinquent accounts',
        actionType: 'workflow',
        workflowTemplateId: 'payment-reminders',
        action: async () => {/* Will be implemented */}
      },
      {
        id: '3-2',
        title: 'Review Collection Policy',
        description: 'Review and update collection procedures',
        actionType: 'manual',
        action: async () => {/* Will be implemented */}
      }
    ]
  }
];
