
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import ReportWorkflow from './ReportWorkflow';
import { Button } from '@/components/ui/button';
import { Zap, FileText, GitBranch, CheckSquare, Plus } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { TriggerStep, ActionStep, ConditionStep, ApprovalStep } from './builder/types';
import ApprovalQueue from './ApprovalQueue';

const WorkflowBuilder = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('report') === 'true' ? 'report-workflow' : 'default';
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(defaultTab);
  const [steps, setSteps] = useState<(TriggerStep | ActionStep | ConditionStep | ApprovalStep)[]>([]);
  
  useEffect(() => {
    if (searchParams.get('report') === 'true') {
      setActiveWorkflowTab('report-workflow');
    }
  }, [searchParams]);
  
  const addStep = (type: 'trigger' | 'action' | 'condition' | 'approval') => {
    const newStep = {
      id: uuid(),
      name: `New ${type} step`,
    };
    
    if (type === 'trigger') {
      setSteps([...steps, {
        ...newStep,
        type: 'trigger',
        triggerType: 'time',
        config: {}
      }]);
    } else if (type === 'action') {
      setSteps([...steps, {
        ...newStep,
        type: 'action',
        actionType: 'email',
        config: {}
      }]);
    } else if (type === 'condition') {
      setSteps([...steps, {
        ...newStep,
        type: 'condition',
        conditionType: 'equals',
        field: '',
        value: '',
        config: {
          trueSteps: [],
          falseSteps: []
        }
      }]);
    } else if (type === 'approval') {
      setSteps([...steps, {
        ...newStep,
        type: 'approval',
        approvalType: 'invoice',
        requiredApprovals: 1,
        approverRoles: ['board_member'],
        config: {
          approvedSteps: [],
          rejectedSteps: []
        }
      }]);
    }
  };
  
  return (
    <div className="space-y-6">
      <ApprovalQueue className="mb-6" />
      
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
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => addStep('trigger')}>
                    <Zap className="h-4 w-4 mr-2" />
                    Add Trigger
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addStep('action')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addStep('condition')}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addStep('approval')}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Add Approval Step
                  </Button>
                </div>
                
                {steps.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-6 text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                    <p className="text-muted-foreground mb-4">
                      Click one of the buttons above to add your first workflow step
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Workflow steps would be rendered here */}
                    <div className="text-center py-6">
                      <p>Workflow steps UI will be rendered here</p>
                    </div>
                  </div>
                )}
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
