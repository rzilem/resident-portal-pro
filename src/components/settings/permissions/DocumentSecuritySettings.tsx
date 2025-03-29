import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderIcon } from 'lucide-react';
import { DocumentAccessLevel } from '@/types/documents';
import { getUploadDocumentCategories } from '@/utils/documents/uploadUtils';
import { DocumentCategory } from '@/types/documents';
import { useAuthRole } from '@/hooks/use-auth-role';
import SecuritySettingsLoading from './components/SecuritySettingsLoading';
import SecuritySettingsAccessDenied from './components/SecuritySettingsAccessDenied';
import SecurityLevelTable from './components/SecurityLevelTable';
import AccessLevelsExplanation from './components/AccessLevelsExplanation';
import SecuritySettingsFooter from './components/SecuritySettingsFooter';

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
        const fetchedCategories = await getUploadDocumentCategories();
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
    return <SecuritySettingsLoading />;
  }
  
  if (!isAdmin) {
    return <SecuritySettingsAccessDenied />;
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
        <SecurityLevelTable 
          categories={categories} 
          onAccessLevelChange={handleAccessLevelChange}
        />
        <AccessLevelsExplanation />
      </CardContent>
      <CardFooter>
        <SecuritySettingsFooter 
          hasChanges={hasChanges()}
          isSaving={isSaving}
          onReset={handleReset}
          onSave={handleSave}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentSecuritySettings;
