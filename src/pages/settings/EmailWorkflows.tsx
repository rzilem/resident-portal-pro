
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailWorkflowSettings from '@/components/settings/email-workflows/EmailWorkflowSettings';
import InvoiceOcrSettings from '@/components/settings/email-workflows/InvoiceOcrSettings';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Mail, FileText, Scan } from 'lucide-react';

const EmailWorkflows: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Email Workflows</h1>
        <p className="text-muted-foreground">Configure how emails are processed and routed in your organization</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>General Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            <span>Invoice Processing</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documentation</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 gap-6">
            <EmailWorkflowSettings />
          </div>
        </TabsContent>
        
        <TabsContent value="invoice">
          <div className="grid grid-cols-1 gap-6">
            <InvoiceOcrSettings />
          </div>
        </TabsContent>
        
        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>Email Workflow Documentation</CardTitle>
              <CardDescription>
                Learn how to use email workflows effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">What are Email Workflows?</h3>
                  <p className="text-muted-foreground">
                    Email workflows allow you to automatically process incoming emails based on predefined rules. 
                    This helps streamline communication and ensures messages are routed to the appropriate 
                    department or trigger specific actions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Invoice OCR Processing</h3>
                  <p className="text-muted-foreground mb-2">
                    The invoice OCR system automatically extracts key information from incoming invoice emails, including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Vendor information and details</li>
                    <li>Invoice dates and due dates</li>
                    <li>Invoice numbers and reference codes</li>
                    <li>Total amounts and line items</li>
                    <li>Automatic GL account suggestions based on historical data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Common Use Cases</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Route maintenance requests to your maintenance team</li>
                    <li>Process violation reports automatically</li>
                    <li>Forward account inquiries to accounting department</li>
                    <li>Convert emailed documents to attachments in resident profiles</li>
                    <li>Create calendar events from emailed meeting requests</li>
                    <li>Automatically process vendor invoices with OCR technology</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Best Practices</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Use clear, specific inbound email addresses (e.g., invoices@yourcompany.com)</li>
                    <li>Set up appropriate forwarding destinations</li>
                    <li>Review workflow logs regularly to ensure proper functioning</li>
                    <li>Test new workflows before deploying them</li>
                    <li>For invoice OCR, train the system with sample invoices from your regular vendors</li>
                    <li>Set up GL account mapping rules to streamline invoice coding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailWorkflows;
