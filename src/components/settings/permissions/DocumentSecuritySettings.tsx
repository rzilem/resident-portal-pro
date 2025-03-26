import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentAccessLevel } from '@/types/documents';
import { LockIcon, Shield, FolderIcon, File, Users, UserIcon, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDocumentCategories } from '@/utils/documents/documentUtils';
import { DocumentCategory } from '@/types/documents';
import { useAuthRole } from '@/hooks/use-auth-role';
import { renderAccessLevelBadge } from '../../documents/utils/categoryUtils';

const DocumentSecuritySettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalCategories, setOriginalCategories] = useState<DocumentCategory[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const { isAdmin } = useAuthRole();
  
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getDocumentCategories();
        setCategories(fetchedCategories);
        setOriginalCategories([...fetchedCategories]);
      } catch (error) {
        console.error("Failed to load document categories:", error);
        toast.error("Failed to load document categories");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  const hasChanges = () => {
    return JSON.stringify(categories) !== JSON.stringify(originalCategories);
  };
  
  const handleAccessLevelChange = (categoryId: string, accessLevel: DocumentAccessLevel) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, accessLevel } : cat
      )
    );
  };
  
  const handleSave = async () => {
    if (!hasChanges()) {
      toast.info("No changes to save");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, this would save to the database
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update original categories to match current state
      setOriginalCategories([...categories]);
      
      toast.success("Document security settings updated successfully");
    } catch (error) {
      console.error("Failed to save document security settings:", error);
      toast.error("Failed to update document security settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = () => {
    setCategories([...originalCategories]);
    toast.info("Changes reset");
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Security Settings</CardTitle>
          <CardDescription>Loading document categories...</CardDescription>
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
          <CardTitle>Document Security Settings</CardTitle>
          <CardDescription>Configure document access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
            <p className="text-amber-800 dark:text-amber-300">
              You need administrator permissions to manage document security settings.
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
                      <File className="h-4 w-4" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderAccessLevelBadge(category.accessLevel || 'all')}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={category.accessLevel || 'all'} 
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
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Visible</Badge>
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
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={!hasChanges() || isSaving}
        >
          Reset Changes
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges() || isSaving}
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
              <span>Save Security Settings</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentSecuritySettings;
