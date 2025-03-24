
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, Phone, MessageSquare, FileWarning, FileText, 
  Calendar, UserCheck, Filter, RefreshCw, Download, 
  PlusCircle, Search, Clock, CheckCircle, AlertCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Interaction } from '@/components/settings/associations/types';

interface InteractionTrackerProps {
  className?: string;
}

const InteractionTracker: React.FC<InteractionTrackerProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: "INT-001",
      type: "email",
      date: "2023-06-15",
      subject: "Late Payment Reminder",
      description: "Sent reminder about overdue HOA fees",
      associationId: "ASSOC-001",
      residentId: "RES-456",
      propertyId: "PROP-123",
      status: "completed",
      createdBy: "STAFF-001",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2023-06-15T10:30:00Z",
      referenceCode: "EM-20230615-001"
    },
    {
      id: "INT-002",
      type: "call",
      date: "2023-06-16",
      subject: "Maintenance Request Follow-up",
      description: "Called resident regarding their recent maintenance request",
      associationId: "ASSOC-001",
      residentId: "RES-789",
      propertyId: "PROP-124",
      status: "completed",
      createdBy: "STAFF-002",
      createdAt: "2023-06-16T11:45:00Z",
      updatedAt: "2023-06-16T11:45:00Z",
      referenceCode: "CA-20230616-001"
    },
    {
      id: "INT-003",
      type: "meeting",
      date: "2023-06-20",
      subject: "Board Meeting",
      description: "Monthly HOA board meeting",
      associationId: "ASSOC-001",
      status: "scheduled",
      createdBy: "STAFF-001",
      createdAt: "2023-06-01T09:00:00Z",
      updatedAt: "2023-06-01T09:00:00Z",
      referenceCode: "MT-20230620-001"
    },
    {
      id: "INT-004",
      type: "violation",
      date: "2023-06-17",
      subject: "Landscaping Violation",
      description: "Notice of violation for unmaintained yard",
      associationId: "ASSOC-001",
      residentId: "RES-101",
      propertyId: "PROP-125",
      status: "pending",
      createdBy: "STAFF-003",
      createdAt: "2023-06-17T13:20:00Z",
      updatedAt: "2023-06-17T13:20:00Z",
      referenceCode: "VL-20230617-001"
    },
    {
      id: "INT-005",
      type: "letter",
      date: "2023-06-18",
      subject: "Delinquency Notice",
      description: "Formal delinquency letter for unpaid assessments",
      associationId: "ASSOC-001",
      residentId: "RES-456",
      propertyId: "PROP-123",
      status: "completed",
      attachments: ["delinquency_letter.pdf"],
      createdBy: "STAFF-001",
      createdAt: "2023-06-18T15:10:00Z",
      updatedAt: "2023-06-18T15:10:00Z",
      referenceCode: "LT-20230618-001"
    }
  ]);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail size={16} />;
      case 'call':
        return <Phone size={16} />;
      case 'meeting':
        return <Calendar size={16} />;
      case 'violation':
        return <FileWarning size={16} />;
      case 'letter':
        return <FileText size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle size={14} /> Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock size={14} /> Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 flex items-center gap-1"><Calendar size={14} /> Scheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 flex items-center gap-1"><AlertCircle size={14} /> Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Interaction Tracker
        </CardTitle>
        <CardDescription>
          Track and manage all interactions with residents and vendors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-1">
                <Mail size={14} /> Emails
              </TabsTrigger>
              <TabsTrigger value="call" className="flex items-center gap-1">
                <Phone size={14} /> Calls
              </TabsTrigger>
              <TabsTrigger value="violation" className="flex items-center gap-1">
                <FileWarning size={14} /> Violations
              </TabsTrigger>
              <TabsTrigger value="other" className="flex items-center gap-1">
                <MessageSquare size={14} /> Other
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw size={16} /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} /> Export
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle size={16} /> New Interaction
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search interactions..." 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Reference Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interactions.map(interaction => (
                    <TableRow key={interaction.id}>
                      <TableCell className="font-medium">{interaction.id}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {interaction.referenceCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(interaction.type)}
                          <span className="capitalize">{interaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(interaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{interaction.subject}</TableCell>
                      <TableCell>
                        {interaction.residentId ? `Resident ${interaction.residentId}` : 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(interaction.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Filter for other tab values */}
          {['email', 'call', 'violation', 'other'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    {tabValue === 'other' 
                      ? 'Showing meetings, letters, and other interactions'
                      : `Showing only ${tabValue} interactions`
                    }
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Reference Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interactions
                      .filter(interaction => 
                        tabValue === 'other' 
                          ? !['email', 'call', 'violation'].includes(interaction.type)
                          : interaction.type === tabValue
                      )
                      .map(interaction => (
                        <TableRow key={interaction.id}>
                          <TableCell className="font-medium">{interaction.id}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {interaction.referenceCode}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(interaction.type)}
                              <span className="capitalize">{interaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(interaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{interaction.subject}</TableCell>
                          <TableCell>
                            {interaction.residentId ? `Resident ${interaction.residentId}` : 'N/A'}
                          </TableCell>
                          <TableCell>{getStatusBadge(interaction.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractionTracker;
