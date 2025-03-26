
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  FolderIcon, FileIcon, FileTextIcon, BarChartIcon, 
  ClipboardIcon, FileSpreadsheetIcon, ShieldIcon,
  UsersIcon, UserIcon, LockIcon, InfoIcon, 
  PencilIcon, CheckIcon, XIcon
} from 'lucide-react';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { useDocumentPermissions } from '@/hooks/use-document-permissions';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DocumentCategoryListProps {
  categories: DocumentCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'financials':
    case 'financial':
    case 'monthlyFinancialReports':
      return <BarChartIcon className="h-4 w-4 text-blue-500" />;
    case 'forms':
      return <ClipboardIcon className="h-4 w-4 text-purple-500" />;
    case 'invoiceImages':
      return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />;
    case 'communityDocuments':
    case 'communityMeetings':
    case 'meetings':
      return <FileTextIcon className="h-4 w-4 text-amber-500" />;
    case 'governing':
      return <ShieldIcon className="h-4 w-4 text-red-500" />;
    case 'legal':
      return <ClipboardIcon className="h-4 w-4 text-red-500" />;
    case 'rules':
      return <ShieldIcon className="h-4 w-4 text-indigo-500" />;
    case 'contracts':
      return <FileTextIcon className="h-4 w-4 text-gray-500" />;
    default:
      return <FolderIcon className="h-4 w-4 text-yellow-400" />;
  }
};

const getAccessLevelIcon = (accessLevel?: DocumentAccessLevel) => {
  switch(accessLevel) {
    case 'admin':
      return <ShieldIcon className="h-3 w-3" />;
    case 'management':
      return <UserIcon className="h-3 w-3" />;
    case 'board':
      return <UsersIcon className="h-3 w-3" />;
    case 'homeowner':
      return <UsersIcon className="h-3 w-3" />;
    case 'all':
    default:
      return null;
  }
};

const getAccessLevelLabel = (accessLevel?: DocumentAccessLevel): string => {
  switch(accessLevel) {
    case 'admin':
      return 'Administrators Only';
    case 'management':
      return 'Management Staff';
    case 'board':
      return 'Board Members';
    case 'homeowner':
      return 'Homeowners';
    case 'all':
    default:
      return 'Public';
  }
};

const getSecurityLevelColor = (accessLevel?: DocumentAccessLevel): string => {
  switch(accessLevel) {
    case 'admin':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400';
    case 'management':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-400';
    case 'board':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400';
    case 'homeowner':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400';
    case 'all':
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700 dark:text-gray-400';
  }
};

const getFolderIconColor = (accessLevel?: DocumentAccessLevel): string => {
  switch(accessLevel) {
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
      return 'text-yellow-400';
  }
};

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
      <div className="bg-muted/30 rounded-md p-3 text-xs">
        <div className="font-medium mb-2 flex items-center gap-1">
          <InfoIcon className="h-3.5 w-3.5" />
          <span>Access Levels</span>
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
          <div className="flex items-center gap-1.5">
            <FolderIcon className="h-4 w-4 text-yellow-400" />
            <span>All Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderIcon className="h-4 w-4 text-green-500" />
            <span>Homeowners</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderIcon className="h-4 w-4 text-blue-500" />
            <span>Board Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderIcon className="h-4 w-4 text-purple-500" />
            <span>Management</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderIcon className="h-4 w-4 text-red-500" />
            <span>Administrators</span>
          </div>
        </div>
      </div>

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
          const securityColor = getSecurityLevelColor(category.accessLevel);
          const folderColor = getFolderIconColor(category.accessLevel);
          const isEditing = editingCategory === category.id;
          
          return (
            <div key={category.id} className="mb-1">
              {isEditing ? (
                // Edit Form
                <div className="p-2 border rounded-md bg-muted/40">
                  <div className="mb-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Category name"
                      className="mb-2"
                    />
                    <Select 
                      value={tempAccessLevel} 
                      onValueChange={(value) => setTempAccessLevel(value as DocumentAccessLevel)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Access Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="homeowner">Homeowners & Above</SelectItem>
                        <SelectItem value="board">Board Members & Above</SelectItem>
                        <SelectItem value="management">Management Staff Only</SelectItem>
                        <SelectItem value="admin">Administrators Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveEdit(category.id)}
                      className="flex-1"
                    >
                      <CheckIcon className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      <XIcon className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Normal View or Selection Mode
                <TooltipProvider key={category.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <button
                          onClick={() => !editMode && hasAccess && onSelectCategory(category.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md",
                            !hasAccess && "opacity-50 cursor-not-allowed",
                            activeCategory === category.id && !editMode
                              ? `${securityColor} font-medium border` 
                              : "text-muted-foreground hover:bg-muted"
                          )}
                          disabled={!hasAccess || editMode}
                        >
                          <div className="flex items-center gap-2">
                            <FolderIcon className={`h-5 w-5 ${folderColor}`} />
                            <span>{category.name}</span>
                          </div>
                          
                          {category.accessLevel && category.accessLevel !== 'all' && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "flex items-center p-1",
                                securityColor
                              )}
                            >
                              {getAccessLevelIcon(category.accessLevel)}
                            </Badge>
                          )}
                        </button>
                        {editMode && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 ml-1"
                            onClick={() => handleEditStart(category)}
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>
                        {hasAccess 
                          ? `Access Level: ${getAccessLevelLabel(category.accessLevel)}`
                          : `Restricted: ${getAccessLevelLabel(category.accessLevel)} Access Required`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentCategoryList;
