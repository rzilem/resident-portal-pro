
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, UserPlus, Shield, Eye, EyeOff, FileText, Trash2, Edit, Plus, Lock } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const roles = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Property Manager" },
  { value: "board", label: "Board Member" },
  { value: "resident", label: "Resident" },
  { value: "vendor", label: "Vendor" },
];

const PermissionSettings = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Alice Johnson', email: 'alice@example.com', role: 'board', status: 'active' },
    { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'resident', status: 'pending' },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'resident'
  });
  
  const [documentPermissions, setDocumentPermissions] = useState({
    financialReports: {
      owner: true, admin: true, manager: true, board: true, resident: false, vendor: false
    },
    bylaws: {
      owner: true, admin: true, manager: true, board: true, resident: true, vendor: false
    },
    boardMinutes: {
      owner: true, admin: true, manager: true, board: true, resident: true, vendor: false
    },
    vendorContracts: {
      owner: true, admin: true, manager: true, board: false, resident: false, vendor: true
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const openNewUserDialog = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'resident' });
    setDialogOpen(true);
  };
  
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role 
    });
    setDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: formData.name, 
              email: formData.email, 
              role: formData.role 
            } 
          : u
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully");
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'pending'
      };
      setUsers([...users, newUser]);
      toast.success("User invited successfully");
    }
    
    setDialogOpen(false);
  };
  
  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === id);
    toast.success(`${user?.name} ${user?.status === 'active' ? 'deactivated' : 'activated'}`);
  };
  
  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    toast.success(`${user?.name} removed`);
  };
  
  const toggleDocumentPermission = (document: string, role: string) => {
    setDocumentPermissions(prev => ({
      ...prev,
      [document]: {
        ...prev[document as keyof typeof prev],
        [role]: !prev[document as keyof typeof prev][role as keyof typeof prev[keyof typeof prev]]
      }
    }));
  };
  
  const handleUpdatePermissions = () => {
    toast.success("Document permissions updated successfully");
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and their roles in the system</CardDescription>
          </div>
          <Button onClick={openNewUserDialog}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.status === 'active'} 
                      onCheckedChange={() => toggleUserStatus(user.id)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Access Permissions</CardTitle>
          <CardDescription>Control which roles can access specific documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.value} className="text-center">
                    {role.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(documentPermissions).map(([document, permissions]) => (
                <TableRow key={document}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {document.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role.value} className="text-center">
                      <Switch 
                        checked={permissions[role.value as keyof typeof permissions]} 
                        onCheckedChange={() => toggleDocumentPermission(document, role.value)} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleUpdatePermissions}>
            Save Permissions
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Invite New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Update user details and permissions" 
                : "Enter the details of the user you want to invite"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? "Save Changes" : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionSettings;
