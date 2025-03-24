
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, FileCheck, AlertTriangle, MessageSquare, Mail, Calendar, Clock, CreditCard } from "lucide-react";

// Predefined workflow templates
const workflowTemplates = [
  {
    id: 'delinquency',
    title: 'Delinquency Collection Process',
    description: 'Automate the collection of delinquent payments with notifications, late fees, and escalation steps',
    category: 'Financial',
    steps: 8,
    icon: <CreditCard className="w-10 h-10 text-orange-500" />,
    popular: true
  },
  {
    id: 'violation',
    title: 'Compliance Violation Workflow',
    description: 'Standardized process for handling CC&R violations with notices, hearings, and enforcement actions',
    category: 'Compliance',
    steps: 6,
    icon: <AlertTriangle className="w-10 h-10 text-red-500" />
  },
  {
    id: 'maintenance',
    title: 'Maintenance Request Handling',
    description: 'Track maintenance requests from submission to completion with vendor assignments and status updates',
    category: 'Maintenance',
    steps: 5,
    icon: <FileCheck className="w-10 h-10 text-green-500" />
  },
  {
    id: 'residentonboarding',
    title: 'New Resident Onboarding',
    description: 'Welcome new residents with community information, access credentials, and orientation materials',
    category: 'Resident Management',
    steps: 4,
    icon: <MessageSquare className="w-10 h-10 text-blue-500" />
  },
  {
    id: 'boardmeetings',
    title: 'Board Meeting Coordination',
    description: 'Schedule meetings, distribute agendas, send reminders, and follow up with minutes',
    category: 'Governance',
    steps: 7,
    icon: <Calendar className="w-10 h-10 text-purple-500" />
  },
  {
    id: 'architecturalreview',
    title: 'Architectural Review Process',
    description: 'Manage the submission and approval process for architectural modifications',
    category: 'Compliance',
    steps: 5,
    icon: <FileCheck className="w-10 h-10 text-teal-500" />
  },
  {
    id: 'emailcommunication',
    title: 'Email Communication Campaign',
    description: 'Schedule and send targeted email communications to residents based on specific triggers',
    category: 'Communication',
    steps: 3,
    icon: <Mail className="w-10 h-10 text-blue-400" />
  },
  {
    id: 'feereminders',
    title: 'Assessment Fee Reminders',
    description: 'Automated reminders for upcoming and overdue assessment payments',
    category: 'Financial',
    steps: 4,
    icon: <Clock className="w-10 h-10 text-amber-500" />
  }
];

const WorkflowTemplates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Predefined Workflow Templates</h2>
        <Button variant="outline">Create Custom Template</Button>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflowTemplates.map((template) => (
            <Card key={template.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-md bg-muted">{template.icon}</div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <CardTitle className="mt-4">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{template.steps} steps</span> in this workflow
                </div>
                {template.popular && (
                  <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                    Popular Template
                  </Badge>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Use Template <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkflowTemplates;
