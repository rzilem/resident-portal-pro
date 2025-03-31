
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import ReportWorkflow from './ReportWorkflow';

const WorkflowBuilder = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('report') === 'true' ? 'report-workflow' : 'default';
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(defaultTab);
  
  useEffect(() => {
    if (searchParams.get('report') === 'true') {
      setActiveWorkflowTab('report-workflow');
    }
  }, [searchParams]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeWorkflowTab} onValueChange={setActiveWorkflowTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="default">Build Custom Workflow</TabsTrigger>
              <TabsTrigger value="report-workflow">Monthly Reports Workflow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Custom Workflow Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Create a custom workflow by selecting triggers, conditions, and actions.
                </p>
                <p className="text-muted-foreground">
                  This feature is under development. Please use the Monthly Reports Workflow tab for now.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="report-workflow">
              <ReportWorkflow />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowBuilder;
