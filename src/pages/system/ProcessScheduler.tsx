
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { processSchedulerService } from '@/services/processSchedulerService';
import { ScheduledProcess } from '@/types/process';
import ProcessList from '@/components/system/processes/ProcessList';
import ProcessDialog from '@/components/system/processes/ProcessDialog';
import EmptyState from '@/components/system/processes/EmptyState';
import { Clock, Plus } from 'lucide-react';
import ProcessHistory from '@/components/system/processes/ProcessHistory';
import { Skeleton } from '@/components/ui/skeleton';

const ProcessScheduler = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<ScheduledProcess | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const { data: processes, isLoading, error, refetch } = useQuery({
    queryKey: ['scheduled-processes'],
    queryFn: processSchedulerService.getProcesses
  });

  const handleAddProcess = () => {
    setEditingProcess(null);
    setIsDialogOpen(true);
  };

  const handleEditProcess = (process: ScheduledProcess) => {
    setEditingProcess(process);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh: boolean = false) => {
    setIsDialogOpen(false);
    setEditingProcess(null);
    if (shouldRefresh) {
      refetch();
    }
  };

  const activeProcesses = processes?.filter(p => p.enabled) || [];
  const inactiveProcesses = processes?.filter(p => !p.enabled) || [];

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Process Scheduler</h1>
          <p className="text-muted-foreground mt-1">
            Manage automated background processes and system workflows
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleAddProcess}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Process
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="active">Active Processes</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Processes</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Active Scheduled Processes
              </CardTitle>
              <CardDescription>
                These processes are currently running on schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">
                  Error loading processes. Please try again.
                </div>
              ) : activeProcesses.length === 0 ? (
                <EmptyState 
                  title="No active processes" 
                  description="You don't have any active scheduled processes. Create one to get started."
                  onAction={handleAddProcess}
                  actionLabel="Schedule Process"
                />
              ) : (
                <ProcessList 
                  processes={activeProcesses}
                  onEdit={handleEditProcess}
                  onRefresh={refetch}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Processes</CardTitle>
              <CardDescription>
                These processes are configured but not currently active
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">
                  Error loading processes. Please try again.
                </div>
              ) : inactiveProcesses.length === 0 ? (
                <EmptyState 
                  title="No inactive processes" 
                  description="You don't have any inactive processes."
                  hideAction
                />
              ) : (
                <ProcessList 
                  processes={inactiveProcesses}
                  onEdit={handleEditProcess}
                  onRefresh={refetch}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Process History</CardTitle>
            <CardDescription>
              Recent execution history of scheduled processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProcessHistory />
          </CardContent>
        </Card>
      </div>

      <ProcessDialog 
        open={isDialogOpen} 
        onClose={handleDialogClose} 
        process={editingProcess} 
      />
    </div>
  );
};

export default ProcessScheduler;
