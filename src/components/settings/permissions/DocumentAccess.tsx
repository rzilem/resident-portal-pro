
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { FileText } from "lucide-react";

interface RolePermission {
  [key: string]: boolean;
}

interface DocumentPermissions {
  [key: string]: RolePermission;
}

interface DocumentAccessProps {
  documentPermissions: DocumentPermissions;
  setDocumentPermissions: React.Dispatch<React.SetStateAction<DocumentPermissions>>;
  roles: { value: string; label: string }[];
}

const DocumentAccess = ({ documentPermissions, setDocumentPermissions, roles }: DocumentAccessProps) => {
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
  );
};

export default DocumentAccess;
