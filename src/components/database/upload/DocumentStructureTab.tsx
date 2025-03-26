
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FolderPlus, FileText, MoreHorizontal } from 'lucide-react';

interface DocumentStructureTabProps {
  onOpenChange: () => void;
}

const DocumentStructureTab: React.FC<DocumentStructureTabProps> = ({ onOpenChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Document Categories</h3>
        <Button size="sm" onClick={onOpenChange}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="border rounded-lg divide-y">
        {categories.map((category) => (
          <div key={category.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FolderPlus className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{category.name}</span>
                {category.isRestricted && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                    Restricted
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onOpenChange}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            {category.children && category.children.length > 0 && (
              <div className="ml-8 mt-2 space-y-2">
                {category.children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{child.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onOpenChange}>
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const categories = [
  {
    id: 1,
    name: 'Board Documents',
    isRestricted: true,
    children: [
      { id: 101, name: 'Meeting Minutes' },
      { id: 102, name: 'Resolutions' },
      { id: 103, name: 'Election Results' }
    ]
  },
  {
    id: 2,
    name: 'Architectural',
    isRestricted: false,
    children: [
      { id: 201, name: 'Requests' },
      { id: 202, name: 'Approvals' },
      { id: 203, name: 'Denials' }
    ]
  },
  {
    id: 3,
    name: 'Financial',
    isRestricted: true,
    children: [
      { id: 301, name: 'Budgets' },
      { id: 302, name: 'Financial Statements' },
      { id: 303, name: 'Tax Returns' }
    ]
  },
  {
    id: 4,
    name: 'Compliance',
    isRestricted: false,
    children: [
      { id: 401, name: 'Violations' },
      { id: 402, name: 'Hearings' },
      { id: 403, name: 'Appeals' }
    ]
  }
];

export default DocumentStructureTab;
