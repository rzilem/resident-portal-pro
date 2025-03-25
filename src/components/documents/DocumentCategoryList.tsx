
import React from 'react';
import { cn } from '@/lib/utils';
import { FolderIcon, FileIcon, FileTextIcon, BarChartIcon, ClipboardIcon, FileSpreadsheetIcon } from 'lucide-react';

interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  examples?: string[];
}

interface DocumentCategoryListProps {
  categories: DocumentCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'financials':
    case 'monthlyFinancialReports':
      return <BarChartIcon className="h-4 w-4 text-blue-500" />;
    case 'forms':
      return <ClipboardIcon className="h-4 w-4 text-purple-500" />;
    case 'invoiceImages':
      return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />;
    case 'communityDocuments':
    case 'communityMeetings':
      return <FileTextIcon className="h-4 w-4 text-amber-500" />;
    default:
      return <FolderIcon className="h-4 w-4 text-yellow-400" />;
  }
};

const DocumentCategoryList: React.FC<DocumentCategoryListProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
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
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted",
              activeCategory === category.id ? "bg-muted font-medium" : "text-muted-foreground"
            )}
          >
            {getCategoryIcon(category.id)}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentCategoryList;
