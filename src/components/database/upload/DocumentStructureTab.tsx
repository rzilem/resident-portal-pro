
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

interface DocumentCategoryProps {
  onOpenChange: (open: boolean) => void;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  access_level: string;
  sort_order: number;
}

const DocumentStructureTab: React.FC<DocumentCategoryProps> = ({ onOpenChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching document categories:', error);
      toast.error('Failed to load document categories');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addNewCategory = () => {
    const newCategory: Category = {
      id: `temp-${Date.now()}`, // Will be replaced with real ID after save
      name: '',
      description: '',
      access_level: 'all',
      sort_order: categories.length + 1
    };
    
    setCategories([...categories, newCategory]);
  };
  
  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };
  
  const updateCategory = (index: number, field: keyof Category, value: any) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value
    };
    setCategories(updatedCategories);
  };
  
  const saveCategories = async () => {
    // Validate categories
    const invalidCategories = categories.filter(cat => !cat.name.trim());
    if (invalidCategories.length > 0) {
      toast.error('All categories must have a name');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Filter out categories with temp IDs (new ones) to insert
      const newCategories = categories.filter(cat => cat.id.startsWith('temp-'));
      const existingCategories = categories.filter(cat => !cat.id.startsWith('temp-'));
      
      // Insert new categories
      if (newCategories.length > 0) {
        const { error: insertError } = await supabase
          .from('document_categories')
          .insert(newCategories.map(cat => ({
            name: cat.name,
            description: cat.description,
            access_level: cat.access_level,
            sort_order: cat.sort_order
          })));
        
        if (insertError) throw insertError;
      }
      
      // Update existing categories
      for (const category of existingCategories) {
        const { error: updateError } = await supabase
          .from('document_categories')
          .update({
            name: category.name,
            description: category.description,
            access_level: category.access_level,
            sort_order: category.sort_order
          })
          .eq('id', category.id);
          
        if (updateError) throw updateError;
      }
      
      toast.success('Document categories saved successfully');
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving document categories:', error);
      toast.error('Failed to save document categories');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document Categories</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addNewCategory}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">No document categories defined yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addNewCategory}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Category
            </Button>
          </div>
        ) : (
          categories.map((category, index) => (
            <div key={category.id} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <div className="font-medium">Category {index + 1}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeCategory(index)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`category-name-${index}`} className="mb-1">Category Name</Label>
                  <Input 
                    id={`category-name-${index}`}
                    value={category.name} 
                    onChange={(e) => updateCategory(index, 'name', e.target.value)}
                    placeholder="e.g., Financial Documents"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`category-desc-${index}`} className="mb-1">Description</Label>
                  <Textarea 
                    id={`category-desc-${index}`}
                    value={category.description || ''} 
                    onChange={(e) => updateCategory(index, 'description', e.target.value)}
                    placeholder="What types of documents belong in this category"
                    rows={2}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`category-access-${index}`}>Restrict Access</Label>
                  <Switch 
                    id={`category-access-${index}`}
                    checked={category.access_level === 'restricted'} 
                    onCheckedChange={(checked) => 
                      updateCategory(index, 'access_level', checked ? 'restricted' : 'all')
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {categories.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={saveCategories} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Categories</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentStructureTab;
