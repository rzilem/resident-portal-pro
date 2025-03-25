
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Mail, 
  Phone, 
  Plus, 
  Search, 
  User, 
  Users 
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

interface Member {
  id: number;
  name: string;
  unit: string;
  email: string;
  phone: string;
  role: "Resident" | "Owner" | "Board Member" | "Tenant";
  joinDate: string;
}

const Members = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Sample members data
  const [members, setMembers] = useState<Member[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      unit: '101', 
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      role: 'Resident', 
      joinDate: '2023-06-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      unit: '202', 
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      role: 'Board Member',
      joinDate: '2022-04-10'
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      unit: '303', 
      email: 'robert.j@example.com',
      phone: '(555) 234-5678',
      role: 'Owner',
      joinDate: '2023-01-22'
    },
    { 
      id: 4, 
      name: 'Emily Williams', 
      unit: '104', 
      email: 'emily.w@example.com',
      phone: '(555) 876-5432',
      role: 'Tenant',
      joinDate: '2024-02-08'
    },
    { 
      id: 5, 
      name: 'Michael Brown', 
      unit: '205', 
      email: 'michael.b@example.com',
      phone: '(555) 345-6789',
      role: 'Board Member',
      joinDate: '2022-11-15'
    },
  ]);

  // Filter members based on search term and role filter
  const filteredMembers = members.filter(member => {
    // Search filter
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === 'all' || member.role.replace(' ', '').toLowerCase() === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Stats for display
  const memberStats = {
    totalMembers: members.length,
    boardMembers: members.filter(m => m.role === 'Board Member').length,
    owners: members.filter(m => m.role === 'Owner').length,
    tenants: members.filter(m => m.role === 'Tenant').length
  };

  const handleAddMember = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to add new members will be available in the next update.",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Members</h1>
      
      {/* Member Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Members</p>
              <div className="p-2 bg-blue-50 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{memberStats.totalMembers}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Board Members</p>
              <div className="p-2 bg-purple-50 rounded-full">
                <User className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{memberStats.boardMembers}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Owners</p>
              <div className="p-2 bg-green-50 rounded-full">
                <User className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{memberStats.owners}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Tenants</p>
              <div className="p-2 bg-orange-50 rounded-full">
                <User className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-600">{memberStats.tenants}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Member List */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Member List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="boardmember">Board Member</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddMember}
            >
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Name</th>
                  <th className="p-3 font-medium text-gray-600">Unit</th>
                  <th className="p-3 font-medium text-gray-600">Role</th>
                  <th className="p-3 font-medium text-gray-600">Contact</th>
                  <th className="p-3 font-medium text-gray-600">Join Date</th>
                  <th className="p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{member.name}</td>
                    <td className="p-3">Unit {member.unit}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${member.role === 'Board Member' ? 'bg-purple-100 text-purple-800' : 
                          member.role === 'Owner' ? 'bg-green-100 text-green-800' : 
                          member.role === 'Tenant' ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{member.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{new Date(member.joinDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          Message
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">Showing {filteredMembers.length} of {members.length} members</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
