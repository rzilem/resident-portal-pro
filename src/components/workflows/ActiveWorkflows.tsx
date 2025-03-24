
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, Settings, MoreHorizontal, AlertTriangle, Zap, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample active workflows data
const activeWorkflows = [
  {
    id: '1',
    name: 'Delinquency Collection Process',
    category: 'Financial',
    lastRun: '2023-06-15T14:30:00Z',
    nextRun: '2023-06-22T14:30:00Z',
    status: 'active',
    priority: 'high',
    triggered: 28,
    completed: 22,
    failed: 6
  },
  {
    id: '2',
    name: 'Monthly Assessment Notices',
    category: 'Financial',
    lastRun: '2023-06-01T09:00:00Z',
    nextRun: '2023-07-01T09:00:00Z',
    status: 'active',
    priority: 'medium',
    triggered: 156,
    completed: 152,
    failed: 4
  },
  {
    id: '3',
    name: 'Compliance Violation Workflow',
    category: 'Compliance',
    lastRun: '2023-06-18T10:15:00Z',
    nextRun: '2023-06-19T10:15:00Z',
    status: 'active',
    priority: 'high',
    triggered: 42,
    completed: 35,
    failed: 7
  },
  {
    id: '4',
    name: 'Board Meeting Announcements',
    category: 'Governance',
    lastRun: '2023-05-25T16:00:00Z',
    nextRun: '2023-06-25T16:00:00Z',
    status: 'paused',
    priority: 'low',
    triggered: 18,
    completed: 18,
    failed: 0
  },
  {
    id: '5',
    name: 'New Resident Welcome Sequence',
    category: 'Resident Management',
    lastRun: '2023-06-17T11:45:00Z',
    nextRun: null, // Event-based
    status: 'active',
    priority: 'medium',
    triggered: 12,
    completed: 12,
    failed: 0
  },
  {
    id: '6',
    name: 'Payment Confirmation Emails',
    category: 'Financial',
    lastRun: '2023-06-18T18:30:00Z',
    nextRun: null, // Event-based
    status: 'active',
    priority: 'low',
    triggered: 75,
    completed: 73,
    failed: 2
  }
];

const ActiveWorkflows = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Active Workflows</h2>
        <Button>Activate New Workflow</Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Dashboard</CardTitle>
            <Tabs defaultValue="all" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
                <TabsTrigger value="issues">With Issues</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeWorkflows.map((workflow) => {
                // Calculate success rate
                const successRate = workflow.triggered > 0 
                  ? Math.round((workflow.completed / workflow.triggered) * 100) 
                  : 100;
                
                return (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell>{workflow.category}</TableCell>
                    <TableCell>
                      {workflow.status === 'active' ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Paused
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {workflow.priority === 'high' && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                          High
                        </Badge>
                      )}
                      {workflow.priority === 'medium' && (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
                          Medium
                        </Badge>
                      )}
                      {workflow.priority === 'low' && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                          Low
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {workflow.lastRun ? (
                        new Date(workflow.lastRun).toLocaleDateString()
                      ) : (
                        'Never'
                      )}
                    </TableCell>
                    <TableCell>
                      {workflow.nextRun ? (
                        new Date(workflow.nextRun).toLocaleDateString()
                      ) : (
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-amber-500" />
                          <span>Event-based</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className={`h-full rounded-full ${
                              successRate > 90 ? 'bg-green-500' : 
                              successRate > 75 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <span>{successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {workflow.status === 'active' ? (
                          <Button size="sm" variant="ghost">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Clock className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Edit Workflow</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Zap className="mr-2 h-4 w-4" />
                              <span>Run Now</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              <span>View Issues</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Steps Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Monthly Assessment Notices</TableCell>
                <TableCell>6/1/2023, 9:00 AM</TableCell>
                <TableCell>1m 42s</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </TableCell>
                <TableCell>4/4</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Compliance Violation Workflow</TableCell>
                <TableCell>6/18/2023, 10:15 AM</TableCell>
                <TableCell>3m 12s</TableCell>
                <TableCell>
                  <Badge className="bg-amber-100 text-amber-800">Partial</Badge>
                </TableCell>
                <TableCell>5/6</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment Confirmation Emails</TableCell>
                <TableCell>6/18/2023, 6:30 PM</TableCell>
                <TableCell>45s</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </TableCell>
                <TableCell>3/3</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveWorkflows;
