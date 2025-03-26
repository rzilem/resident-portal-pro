
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileIcon, PencilIcon, CheckIcon } from 'lucide-react';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { useDocumentPermissions } from '@/hooks/use-document-permissions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CategorySecurityGuide from './CategorySecurityGuide';
import CategoryItem from './CategoryItem';
import CategoryEditForm from './CategoryEditForm';

interface DocumentCategoryListProps {
  categories: DocumentCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const DocumentCategoryList: React.FC<DocumentCategoryListProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  const { checkCategoryAccess } = useDocumentPermissions();
  const [editMode, setEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategories, setEditedCategories] = useState<DocumentCategory[]>(categories);
  const [tempName, setTempName] = useState('');
  const [tempAccessLevel, setTempAccessLevel] = useState<DocumentAccessLevel>('all');

  // Start editing a category
  const handleEditStart = (category: DocumentCategory) => {
    setEditingCategory(category.id);
    setTempName(category.name);
    setTempAccessLevel(category.accessLevel || 'all');
  };

  // Save the edited category
  const handleSaveEdit = (categoryId: string) => {
    setEditedCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, name: tempName, accessLevel: tempAccessLevel } 
          : cat
      )
    );
    setEditingCategory(null);
    toast.success("Category updated");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // If exiting edit mode, reset to original categories
      // In a real app, you would save changes to a database here
      setEditMode(false);
      toast.success("Changes saved");
    } else {
      setEditMode(true);
      // Make a deep copy of categories for editing
      setEditedCategories([...categories]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Security Level Color Guide */}
      <CategorySecurityGuide />

      {/* Edit Mode Toggle */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5" 
          onClick={toggleEditMode}
        >
          {editMode ? (
            <>
              <CheckIcon className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <PencilIcon className="h-3.5 w-3.5" />
              <span>Customize Categories</span>
            </>
          )}
        </Button>
      </div>

      <button 
        onClick={() => onSelectCategory('')}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted",
          !activeCategory ? "bg-muted font-medium" : "text-muted-foreground"
        )}
        disabled={editMode}
      >
        <FileIcon className="h-5 w-5" />
        <span>All Documents</span>
      </button>
      
      <div className="pt-2">
        <div className="text-xs font-medium text-muted-foreground px-3 py-1">
          Categories
        </div>
        {(editMode ? editedCategories : categories).map(category => {
          const hasAccess = checkCategoryAccess(category);
          const isEditing = editingCategory === category.id;
          
          return (
            <div key={category.id} className="mb-1">
              {isEditing ? (
                <CategoryEditForm 
                  categoryId={category.id}
                  tempName={tempName}
                  tempAccessLevel={tempAccessLevel}
                  setTempName={setTempName}
                  setTempAccessLevel={setTempAccessLevel}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <CategoryItem
                  category={category}
                  activeCategory={activeCategory}
                  editMode={editMode}
                  hasAccess={hasAccess}
                  onSelect={onSelectCategory}
                  onEditStart={handleEditStart}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentCategoryList;
