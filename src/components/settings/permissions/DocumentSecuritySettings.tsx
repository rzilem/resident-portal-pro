
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentAccessLevel } from '@/types/documents';
import { LockIcon, Shield, FolderIcon, File, Users, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { roles } from '../permissions/roles';

interface CategorySecurity {
  id: string;
  name: string;
  accessLevel: DocumentAccessLevel;
  icon: React.ElementType;
}

const DocumentSecuritySettings = () => {
  const [categories, setCategories] = useState<CategorySecurity[]>([
    { id: "financial", name: "Financial Documents", accessLevel: "board", icon: File },
    { id: "governing", name: "Governing Documents", accessLevel: "homeowner", icon: Shield },
    { id: "meetings", name: "Meeting Minutes", accessLevel: "homeowner", icon: File },
    { id: "legal", name: "Legal Documents", accessLevel: "management", icon: File },
    { id: "rules", name: "Rules & Regulations", accessLevel: "all", icon: Shield },
    { id: "contracts", name: "Contracts & Agreements", accessLevel: "management", icon: File },
    { id: "communications", name: "Communications", accessLevel: "all", icon: File }
  ]);
  
  const handleAccessLevelChange = (categoryId: string, accessLevel: DocumentAccessLevel) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, accessLevel } : cat
      )
    );
  };
  
  const handleSave = () => {
    // In a real app, this would save to the database
    toast.success("Document security settings updated successfully");
  };
  
  const renderAccessLevelBadge = (accessLevel: DocumentAccessLevel) => {
    switch (accessLevel) {
      case 'admin':
        return <Badge variant="destructive" className="flex items-center gap-1"><LockIcon className="h-3 w-3" /> Admin Only</Badge>;
      case 'management':
        return <Badge variant="secondary" className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> Management</Badge>;
      case 'board':
        return <Badge variant="default" className="flex items-center gap-1"><Shield className="h-3 w-3" /> Board</Badge>;
      case 'homeowner':
        return <Badge variant="outline" className="flex items-center gap-1"><Users className="h-3 w-3" /> Homeowner</Badge>;
      case 'all':
        return <Badge variant="outline" className="flex items-center gap-1">All Users</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderIcon className="h-5 w-5" />
          Document Security Settings
        </CardTitle>
        <CardDescription>
          Configure who can access different document categories within your association
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Current Access Level</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Visibility to Homeowner Portal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderAccessLevelBadge(category.accessLevel)}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={category.accessLevel} 
                      onValueChange={(value) => handleAccessLevelChange(category.id, value as DocumentAccessLevel)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="homeowner">Homeowners & Above</SelectItem>
                        <SelectItem value="board">Board Members & Above</SelectItem>
                        <SelectItem value="management">Management Staff Only</SelectItem>
                        <SelectItem value="admin">Administrators Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {category.accessLevel === 'all' || category.accessLevel === 'homeowner' ? (
                      <Badge variant="success" className="bg-green-100 text-green-800">Visible</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">Not Visible</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Document Access Levels Explained</h3>
          <div className="text-sm space-y-2">
            <p><span className="font-medium">All Users:</span> Accessible to everyone, including the homeowner portal</p>
            <p><span className="font-medium">Homeowners & Above:</span> Accessible to homeowners, board members, and staff</p>
            <p><span className="font-medium">Board Members & Above:</span> Accessible to board members and staff only</p>
            <p><span className="font-medium">Management Staff Only:</span> Accessible to property managers and administrators</p>
            <p><span className="font-medium">Administrators Only:</span> Accessible only to system administrators</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button onClick={handleSave}>Save Security Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentSecuritySettings;
