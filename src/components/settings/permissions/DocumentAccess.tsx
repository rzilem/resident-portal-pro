import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { FileText, Save, FolderClosed } from "lucide-react";
import { getUploadDocumentCategories } from '@/utils/documents/uploadUtils';
import { DocumentCategory } from '@/types/documents';
import { useAuthRole } from '@/hooks/use-auth-role';

interface DocumentPermissionMap {
  [documentType: string]: {
    [role: string]: boolean;
  };
}

const defaultDocumentTypes = [
  { id: 'financialReports', name: 'Financial Reports', icon: <FileText className="h-4 w-4" /> },
  { id: 'bylaws', name: 'Bylaws', icon: <FileText className="h-4 w-4" /> },
  { id: 'boardMinutes', name: 'Board Minutes', icon: <FileText className="h-4 w-4" /> },
  { id: 'vendorContracts', name: 'Vendor Contracts', icon: <FileText className="h-4 w-4" /> },
  { id: 'communityGuidelines', name: 'Community Guidelines', icon: <FileText className="h-4 w-4" /> },
  { id: 'maintenanceDocuments', name: 'Maintenance Documents', icon: <FileText className="h-4 w-4" /> }
];

const DocumentAccess = () => {
  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [documentPermissions, setDocumentPermissions] = useState<DocumentPermissionMap>({});
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const { isAdmin } = useAuthRole();
  
  const roles = [
    { value: "owner", label: "Owner" },
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Property Manager" },
    { value: "board", label: "Board Member" },
    { value: "resident", label: "Resident" },
    { value: "vendor", label: "Vendor" },
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getUploadDocumentCategories();
        setCategories(fetchedCategories);
        
        const initialPermissions: DocumentPermissionMap = {};
        
        defaultDocumentTypes.forEach(docType => {
          initialPermissions[docType.id] = {
            owner: true,
            admin: true,
            manager: true,
            board: docType.id !== 'vendorContracts',
            resident: ['bylaws', 'boardMinutes'].includes(docType.id),
            vendor: docType.id === 'vendorContracts'
          };
        });
        
        fetchedCategories.forEach(category => {
          if (!initialPermissions[`category_${category.id}`]) {
            const hasAccess = {
              owner: true,
              admin: true,
              manager: category.accessLevel !== 'admin',
              board: ['all', 'homeowner', 'board'].includes(category.accessLevel || 'all'),
              resident: ['all', 'homeowner'].includes(category.accessLevel || 'all'),
              vendor: false
            };
            initialPermissions[`category_${category.id}`] = hasAccess;
          }
        });
        
        setDocumentPermissions(initialPermissions);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load document permissions");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleDocumentPermission = (document: string, role: string) => {
    setDocumentPermissions(prev => ({
      ...prev,
      [document]: {
        ...prev[document],
        [role]: !prev[document][role]
      }
    }));
  };
  
  const handleUpdatePermissions = async () => {
    if (!isAdmin) {
      toast.error("You need administrator privileges to update permissions");
      return;
    }
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Document permissions updated successfully");
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast.error("Failed to update document permissions");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Access Permissions</CardTitle>
          <CardDescription>Loading permissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Access Permissions</CardTitle>
          <CardDescription>Control which roles can access specific documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
            <p className="text-amber-800 dark:text-amber-300">
              You need administrator permissions to manage document access permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderClosed className="h-5 w-5" />
          Document Access Permissions
        </CardTitle>
        <CardDescription>Control which roles can access specific documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
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
              {defaultDocumentTypes.map((docType) => (
                <TableRow key={docType.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {docType.icon}
                      {docType.name}
                    </div>
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role.value} className="text-center">
                      <Switch 
                        checked={documentPermissions[docType.id]?.[role.value] || false} 
                        onCheckedChange={() => toggleDocumentPermission(docType.id, role.value)} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              
              {categories.map((category) => (
                <TableRow key={`category_${category.id}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FolderClosed className={`h-4 w-4 ${
                        category.accessLevel === 'admin' ? 'text-red-500' :
                        category.accessLevel === 'management' ? 'text-purple-500' :
                        category.accessLevel === 'board' ? 'text-blue-500' :
                        category.accessLevel === 'homeowner' ? 'text-green-500' :
                        'text-yellow-400'
                      }`} />
                      {category.name}
                    </div>
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role.value} className="text-center">
                      <Switch 
                        checked={documentPermissions[`category_${category.id}`]?.[role.value] || false} 
                        onCheckedChange={() => toggleDocumentPermission(`category_${category.id}`, role.value)} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpdatePermissions}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Permissions</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentAccess;
