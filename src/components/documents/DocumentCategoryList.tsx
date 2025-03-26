
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  FolderIcon, FileIcon, FileTextIcon, BarChartIcon, 
  ClipboardIcon, FileSpreadsheetIcon, ShieldIcon,
  UsersIcon, UserIcon, LockIcon
} from 'lucide-react';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { useDocumentPermissions } from '@/hooks/use-document-permissions';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const DocumentCategoryList: React.FC<DocumentCategoryListProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  const { checkCategoryAccess } = useDocumentPermissions();

  return (
    <div className="space-y-1">
      <button 
        onClick={() => onSelectCategory('')}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted",
          !activeCategory ? "bg-muted font-medium" : "text-muted-foreground"
        )}
      >
        <FileIcon className="h-4 w-4" />
        <span>All Documents</span>
      </button>
      
      <div className="pt-4">
        <div className="text-xs font-medium text-muted-foreground px-3 py-1">
          Categories
        </div>
        {categories.map(category => {
          const hasAccess = checkCategoryAccess(category);
          
          return (
            <TooltipProvider key={category.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => hasAccess && onSelectCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md",
                      !hasAccess && "opacity-50 cursor-not-allowed",
                      activeCategory === category.id ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted"
                    )}
                    disabled={!hasAccess}
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category.id)}
                      <span>{category.name}</span>
                    </div>
                    
                    {category.accessLevel && category.accessLevel !== 'all' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {getAccessLevelIcon(category.accessLevel)}
                        <span className="hidden sm:inline">{category.accessLevel}</span>
                      </Badge>
                    )}
                  </button>
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
          );
        })}
      </div>
    </div>
  );
};

export default DocumentCategoryList;
