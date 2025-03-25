
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Tool 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  unit: string;
  status: "Open" | "In Progress" | "Completed" | "On Hold";
  priority: "Low" | "Medium" | "High" | "Urgent";
  date: string;
}

const Maintenance = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sample maintenance request data
  const [requests, setRequests] = useState<MaintenanceRequest[]>([
    { 
      id: 1, 
      title: 'Leaky Faucet', 
      description: 'Bathroom sink faucet is leaking continuously',
      unit: '101', 
      status: 'Open', 
      priority: 'Medium',
      date: '2025-03-20' 
    },
    { 
      id: 2, 
      title: 'Broken Light', 
      description: 'Hallway light fixture not working',
      unit: '202', 
      status: 'In Progress', 
      priority: 'Low',
      date: '2025-03-22' 
    },
    { 
      id: 3, 
      title: 'HVAC Not Working', 
      description: 'AC system not cooling properly',
      unit: '303', 
      status: 'Open', 
      priority: 'High',
      date: '2025-03-25' 
    },
    { 
      id: 4, 
      title: 'Water Damage', 
      description: 'Ceiling shows water stains from unit above',
      unit: '104', 
      status: 'In Progress', 
      priority: 'Urgent',
      date: '2025-03-18' 
    },
    { 
      id: 5, 
      title: 'Mailbox Repair', 
      description: 'Mailbox lock is jammed',
      unit: '205', 
      status: 'Completed', 
      priority: 'Low',
      date: '2025-03-15' 
    },
  ]);

  // Filter requests based on search term and status filter
  const filteredRequests = requests.filter(request => {
    // Search filter
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || request.status.replace(' ', '').toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'Urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleAddNewRequest = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to add new maintenance requests will be available in the next update.",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Maintenance</h1>
      
      {/* Maintenance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Open Requests</p>
              <div className="p-2 bg-blue-50 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'Open').length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">In Progress</p>
              <div className="p-2 bg-yellow-50 rounded-full">
                <Tool className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'In Progress').length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Completed</p>
              <div className="p-2 bg-green-50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Urgent Issues</p>
              <div className="p-2 bg-red-50 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.priority === 'Urgent').length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Maintenance Requests */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Maintenance Requests</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search requests..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="onhold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddNewRequest}
            >
              <Plus className="h-4 w-4" />
              Add New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Title</th>
                  <th className="p-3 font-medium text-gray-600">Unit</th>
                  <th className="p-3 font-medium text-gray-600">Priority</th>
                  <th className="p-3 font-medium text-gray-600">Status</th>
                  <th className="p-3 font-medium text-gray-600">Date</th>
                  <th className="p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-gray-500">{request.description}</p>
                      </div>
                    </td>
                    <td className="p-3">Unit {request.unit}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(request.priority)}
                        <span 
                          className={`text-sm ${
                            request.priority === 'Urgent' ? 'text-red-600' : 
                            request.priority === 'High' ? 'text-orange-600' : 
                            request.priority === 'Medium' ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}
                        >
                          {request.priority}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          request.status === 'On Hold' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">Showing {filteredRequests.length} of {requests.length} requests</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;
