
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ScheduledProcess } from '@/types/process';
import EmptyState from '@/components/system/processes/EmptyState';
import { supabase } from '@/integrations/supabase/client';

const ProcessScheduler = () => {
  const [processes, setProcesses] = useState<ScheduledProcess[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_processes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProcesses(data || []);
    } catch (error) {
      console.error('Error fetching processes:', error);
      toast.error('Failed to load scheduled processes');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProcesses = () => {
    if (activeTab === 'all') return processes;
    if (activeTab === 'enabled') return processes.filter(p => p.enabled);
    if (activeTab === 'disabled') return processes.filter(p => !p.enabled);
    if (activeTab === 'daily') return processes.filter(p => p.frequency === 'daily');
    if (activeTab === 'weekly') return processes.filter(p => p.frequency === 'weekly');
    if (activeTab === 'monthly') return processes.filter(p => p.frequency === 'monthly');
    return processes;
  };

  const handleRefresh = () => {
    fetchProcesses();
    toast.success('Process list refreshed');
  };

  const renderFrequencyBadge = (frequency: string) => {
    let color = 'bg-blue-100 text-blue-800';
    switch (frequency) {
      case 'hourly':
        color = 'bg-purple-100 text-purple-800';
        break;
      case 'daily':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'weekly':
        color = 'bg-green-100 text-green-800';
        break;
      case 'monthly':
        color = 'bg-amber-100 text-amber-800';
        break;
      case 'custom':
        color = 'bg-gray-100 text-gray-800';
        break;
    }
    return <Badge variant="outline" className={color}>{frequency}</Badge>;
  };

  const renderStatusBadge = (enabled: boolean) => {
    return enabled ? 
      <Badge variant="outline" className="bg-green-100 text-green-800">active</Badge> : 
      <Badge variant="outline" className="bg-gray-100 text-gray-800">disabled</Badge>;
  };

  const filteredProcesses = getFilteredProcesses();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Process Scheduler</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Button onClick={handleRefresh} size="sm" variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Process
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Process Manager</CardTitle>
          <CardDescription>
            Manage scheduled processes and background tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 py-2 border-b">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="enabled">Enabled</TabsTrigger>
                <TabsTrigger value="disabled">Disabled</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProcesses.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Next Run</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProcesses.map((process) => (
                        <TableRow key={process.id}>
                          <TableCell className="font-medium">{process.name}</TableCell>
                          <TableCell>{process.process_type}</TableCell>
                          <TableCell>{renderFrequencyBadge(process.frequency)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              {process.start_date} {process.run_time}
                            </div>
                          </TableCell>
                          <TableCell>
                            {process.last_run ? (
                              format(new Date(process.last_run), 'MMM d, h:mm a')
                            ) : (
                              <span className="text-muted-foreground text-sm">Never</span>
                            )}
                          </TableCell>
                          <TableCell>{renderStatusBadge(process.enabled)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Clock className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState 
                  title="No processes found" 
                  description="There are no scheduled processes in this category. Click the button below to add a new process."
                  actionLabel="Add Process"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessScheduler;
