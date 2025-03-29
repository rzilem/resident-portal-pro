
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Shield, Lock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DocumentCategory } from '@/types/documents';
import { getDocumentCategories } from '@/utils/documents/categoryUtils';
import { useAuthRole } from '@/hooks/use-auth-role';

const DocumentAccess = () => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuthRole();
  
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getDocumentCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load document categories:", error);
        toast.error("Failed to load document categories");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  // Function to get a color for each access level (for visual indication)
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin':
        return 'text-red-500';
      case 'management':
        return 'text-purple-500';
      case 'board':
        return 'text-blue-500';
      case 'homeowner':
        return 'text-green-500';
      case 'all':
      default:
        return 'text-yellow-500';
    }
  };
  
  // Function to get a human-readable access level name
  const getAccessLevelName = (level: string) => {
    switch (level) {
      case 'admin':
        return 'Administrators Only';
      case 'management':
        return 'Management Staff';
      case 'board':
        return 'Board Members & Above';
      case 'homeowner':
        return 'Homeowners & Above';
      case 'all':
      default:
        return 'All Users';
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Document Access Control
          </CardTitle>
          <CardDescription>
            View access levels for different document categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-10 bg-muted rounded-md mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-muted rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Document Access Control
        </CardTitle>
        <CardDescription>
          View access levels for different document categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Access Level</TableHead>
                {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || 'No description'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`flex w-fit items-center gap-1 ${getAccessLevelColor(category.accessLevel || 'all')}`}
                    >
                      <Lock className="h-3 w-3" />
                      {getAccessLevelName(category.accessLevel || 'all')}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info("Edit permission settings in Security Settings")}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-md">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            Access Level Explanation
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-yellow-500">
                All Users
              </Badge>
              <span>Available to anyone with access to the system</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-500">
                Homeowners & Above
              </Badge>
              <span>Available to homeowners, board members, and staff</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-500">
                Board Members & Above
              </Badge>
              <span>Available to board members and staff only</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-500">
                Management Staff
              </Badge>
              <span>Available to management staff only</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-red-500">
                Administrators Only
              </Badge>
              <span>Available only to system administrators</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentAccess;
