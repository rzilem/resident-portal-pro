import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProcessList from '@/components/system/processes/ProcessList';
import ProcessDialog from '@/components/system/processes/ProcessDialog';
import ProcessHistory from '@/components/system/processes/ProcessHistory';
import EmptyState from '@/components/system/processes/EmptyState';
import { processSchedulerService } from '@/services/processSchedulerService';
import { ScheduledProcess } from '@/types/process';
import { TooltipButton } from '@/components/ui/tooltip-button';

const ProcessScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [processes, setProcesses] = useState<ScheduledProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ScheduledProcess | null>(null);

  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      const data = await processSchedulerService.getProcesses();
      setProcesses(data);
    } catch (error) {
      console.error('Error fetching processes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleCreateNew = () => {
    setSelectedProcess(null);
    setIsDialogOpen(true);
  };

  const handleEditProcess = (process: ScheduledProcess) => {
    setSelectedProcess(process);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Workflow Schedule</h1>
          <p className="text-muted-foreground">
            Schedule and manage recurring system processes
          </p>
        </div>
        <TooltipButton 
          tooltipText="Create a new scheduled process"
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Process
        </TooltipButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Processes</CardTitle>
          <CardDescription>
            Manage automated tasks and background processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Processes</TabsTrigger>
              <TabsTrigger value="history">Execution History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading processes...</div>
              ) : processes.length > 0 ? (
                <ProcessList 
                  processes={processes} 
                  onEdit={handleEditProcess}
                  onRefresh={fetchProcesses}
                />
              ) : (
                <EmptyState onCreateNew={handleCreateNew} />
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <ProcessHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ProcessDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        process={selectedProcess}
        onSave={fetchProcesses}
      />
    </div>
  );
};

export default ProcessScheduler;
