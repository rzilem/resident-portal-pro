
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlayCircle, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useWorkflowExecution } from '@/hooks/use-workflow-execution';
import { Workflow, WorkflowExecutionLog } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

interface WorkflowExecutionPanelProps {
  workflow: Workflow;
  readOnly?: boolean;
}

const WorkflowExecutionPanel: React.FC<WorkflowExecutionPanelProps> = ({ 
  workflow,
  readOnly = false
}) => {
  const [showExecutionConfirm, setShowExecutionConfirm] = useState(false);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  
  const { 
    executeWorkflow, 
    executionLogs, 
    currentExecution, 
    isExecuting 
  } = useWorkflowExecution();
  
  const filteredLogs = executionLogs.filter(log => log.workflowId === workflow.id);
  
  const handleExecuteWorkflow = async () => {
    setShowExecutionConfirm(false);
    await executeWorkflow(workflow);
  };
  
  const getStepStatusIcon = (status: 'running' | 'completed' | 'failed') => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Workflow Execution</h3>
        
        {!readOnly && (
          <AlertDialog open={showExecutionConfirm} onOpenChange={setShowExecutionConfirm}>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={isExecuting || workflow.status !== 'active'} 
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Execute Workflow
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Execute Workflow</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to execute the workflow "{workflow.name}"?
                  This will run all steps in the workflow immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleExecuteWorkflow}>
                  Execute Now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      {(filteredLogs.length === 0 && !isExecuting) ? (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No execution logs available for this workflow
          </p>
          {!readOnly && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowExecutionConfirm(true)}
              disabled={workflow.status !== 'active'}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Execute Now
            </Button>
          )}
        </div>
      ) : (
        <ScrollArea className="h-[400px] border rounded-md p-4">
          {isExecuting && currentExecution?.workflowId === workflow.id && (
            <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500 animate-pulse" />
                  <span>Executing workflow...</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Started at: {format(new Date(currentExecution.started), 'PPpp')}
                  </p>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Steps:</p>
                    {currentExecution.stepLogs.map((stepLog, index) => {
                      const step = workflow.steps.find(s => s.id === stepLog.stepId);
                      
                      return (
                        <div 
                          key={stepLog.stepId}
                          className="flex items-center text-sm py-1 px-2 rounded-sm bg-background"
                        >
                          <span className="mr-2">{index + 1}.</span>
                          <span className="mr-2">{getStepStatusIcon(stepLog.status)}</span>
                          <span>
                            {step?.name || `Step ${index + 1}`}
                          </span>
                          <span className={cn(
                            "ml-2 text-xs",
                            stepLog.status === 'completed' && "text-green-500",
                            stepLog.status === 'failed' && "text-red-500",
                            stepLog.status === 'running' && "text-blue-500"
                          )}>
                            {stepLog.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Accordion
            type="single"
            collapsible
            value={expandedLog}
            onValueChange={setExpandedLog}
            className="space-y-2"
          >
            {filteredLogs
              .sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime())
              .map((log) => (
                <AccordionItem 
                  key={log.id}
                  value={log.id}
                  className={cn(
                    "border rounded-md overflow-hidden",
                    log.status === 'completed' && "border-green-200",
                    log.status === 'failed' && "border-red-200",
                    log.status === 'running' && "border-blue-200"
                  )}
                >
                  <AccordionTrigger className="px-4 py-2 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-2">
                        {log.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {log.status === 'failed' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {log.status === 'running' && (
                          <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
                        )}
                        <span className="font-medium">
                          Execution {format(new Date(log.started), 'PPp')}
                        </span>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        log.status === 'completed' && "bg-green-100 text-green-800",
                        log.status === 'failed' && "bg-red-100 text-red-800",
                        log.status === 'running' && "bg-blue-100 text-blue-800"
                      )}>
                        {log.status}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted/20">
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Started:</p>
                          <p>{format(new Date(log.started), 'PPpp')}</p>
                        </div>
                        {log.completed && (
                          <div>
                            <p className="text-muted-foreground">Completed:</p>
                            <p>{format(new Date(log.completed), 'PPpp')}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Steps:</h4>
                        <div className="space-y-1 border rounded-md overflow-hidden">
                          {log.stepLogs.map((stepLog, index) => {
                            const step = workflow.steps.find(s => s.id === stepLog.stepId);
                            
                            return (
                              <div 
                                key={stepLog.stepId}
                                className={cn(
                                  "flex items-center text-sm py-2 px-4",
                                  stepLog.status === 'completed' && "bg-green-50 dark:bg-green-950/20",
                                  stepLog.status === 'failed' && "bg-red-50 dark:bg-red-950/20",
                                  stepLog.status === 'running' && "bg-blue-50 dark:bg-blue-950/20",
                                  index !== log.stepLogs.length - 1 && "border-b"
                                )}
                              >
                                <span className="mr-2">{index + 1}.</span>
                                <span className="mr-2">{getStepStatusIcon(stepLog.status)}</span>
                                <span className="flex-1">
                                  {step?.name || `Step ${index + 1}`}
                                </span>
                                {stepLog.error && (
                                  <span className="text-xs text-red-500 ml-2">
                                    Error: {stepLog.error}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
          
          {filteredLogs.length === 0 && isExecuting && (
            <div className="text-center p-6">
              <Clock className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-2" />
              <p className="text-muted-foreground">Executing workflow...</p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default WorkflowExecutionPanel;
