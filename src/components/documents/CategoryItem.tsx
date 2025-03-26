
import React from 'react';
import { cn } from '@/lib/utils';
import { FolderIcon, PencilIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DocumentCategory } from '@/types/documents';
import { getAccessLevelIcon, getAccessLevelLabel, getSecurityLevelColor, getFolderIconColor } from './utils/categoryUtils.tsx';

interface CategoryItemProps {
  category: DocumentCategory;
  activeCategory: string;
  editMode: boolean;
  hasAccess: boolean;
  onSelect: (categoryId: string) => void;
  onEditStart: (category: DocumentCategory) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  activeCategory,
  editMode,
  hasAccess,
  onSelect,
  onEditStart
}) => {
  const securityColor = getSecurityLevelColor(category.accessLevel);
  const folderColor = getFolderIconColor(category.accessLevel);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <button
              onClick={() => !editMode && hasAccess && onSelect(category.id)}
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
                onClick={() => onEditStart(category)}
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
  );
};

export default CategoryItem;
