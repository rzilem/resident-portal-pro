
import { FileCheck, AlertTriangle, MessageSquare, Mail, Calendar, Clock, CreditCard } from "lucide-react";
import { WorkflowTemplate } from "@/types/workflow";
import React from "react";

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'delinquency',
    title: 'Delinquency Collection Process',
    description: 'Automate the collection of delinquent payments with notifications, late fees, and escalation steps',
    category: 'Financial',
    steps: 8,
    popular: true
  },
  {
    id: 'violation',
    title: 'Compliance Violation Workflow',
    description: 'Standardized process for handling CC&R violations with notices, hearings, and enforcement actions',
    category: 'Compliance',
    steps: 6
  },
  {
    id: 'maintenance',
    title: 'Maintenance Request Handling',
    description: 'Track maintenance requests from submission to completion with vendor assignments and status updates',
    category: 'Maintenance',
    steps: 5
  },
  {
    id: 'residentonboarding',
    title: 'New Resident Onboarding',
    description: 'Welcome new residents with community information, access credentials, and orientation materials',
    category: 'Resident Management',
    steps: 4
  },
  {
    id: 'boardmeetings',
    title: 'Board Meeting Coordination',
    description: 'Schedule meetings, distribute agendas, send reminders, and follow up with minutes',
    category: 'Governance',
    steps: 7
  },
  {
    id: 'architecturalreview',
    title: 'Architectural Review Process',
    description: 'Manage the submission and approval process for architectural modifications',
    category: 'Compliance',
    steps: 5
  },
  {
    id: 'emailcommunication',
    title: 'Email Communication Campaign',
    description: 'Schedule and send targeted email communications to residents based on specific triggers',
    category: 'Communication',
    steps: 3
  },
  {
    id: 'feereminders',
    title: 'Assessment Fee Reminders',
    description: 'Automated reminders for upcoming and overdue assessment payments',
    category: 'Financial',
    steps: 4
  }
];

// Function to get template icon based on id or category
export function getTemplateIcon(template: WorkflowTemplate): React.ReactNode {
  const { id, category } = template;
  
  // Map specific templates to icons
  if (id === 'delinquency' || id === 'feereminders') {
    return <CreditCard className="w-10 h-10 text-orange-500" />;
  }
  if (id === 'violation' || id.includes('violation')) {
    return <AlertTriangle className="w-10 h-10 text-red-500" />;
  }
  if (id.includes('maintenance')) {
    return <FileCheck className="w-10 h-10 text-green-500" />;
  }
  if (id.includes('email') || id.includes('communication')) {
    return <Mail className="w-10 h-10 text-blue-400" />;
  }
  if (id.includes('meeting')) {
    return <Calendar className="w-10 h-10 text-purple-500" />;
  }
  
  // Default based on category
  switch (category) {
    case 'Financial':
      return <CreditCard className="w-10 h-10 text-amber-500" />;
    case 'Compliance':
      return <AlertTriangle className="w-10 h-10 text-red-500" />;
    case 'Maintenance':
      return <FileCheck className="w-10 h-10 text-green-500" />;
    case 'Communication':
      return <Mail className="w-10 h-10 text-blue-400" />;
    case 'Governance':
      return <Calendar className="w-10 h-10 text-purple-500" />;
    case 'Resident Management':
      return <MessageSquare className="w-10 h-10 text-blue-500" />;
    default:
      return <Clock className="w-10 h-10 text-gray-500" />;
  }
}
