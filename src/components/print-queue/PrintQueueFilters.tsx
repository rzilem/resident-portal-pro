
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrintCategory } from '@/services/printQueueService';

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ label, onRemove }) => (
  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
    {label}
    <Button
      variant="ghost"
      size="sm"
      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
      onClick={onRemove}
    >
      <X className="h-3 w-3" />
      <span className="sr-only">Remove {label} filter</span>
    </Button>
  </Badge>
);

interface PrintQueueFiltersProps {
  categoryFilter?: PrintCategory;
  associationFilter?: string;
  associationName?: string;
  onClearCategoryFilter: () => void;
  onClearAssociationFilter: () => void;
}

const PrintQueueFilters: React.FC<PrintQueueFiltersProps> = ({
  categoryFilter,
  associationFilter,
  associationName,
  onClearCategoryFilter,
  onClearAssociationFilter
}) => {
  if (!categoryFilter && !associationFilter) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categoryFilter && (
        <FilterBadge
          label={`Category: ${categoryFilter}`}
          onRemove={onClearCategoryFilter}
        />
      )}
      {associationFilter && associationName && (
        <FilterBadge
          label={`Association: ${associationName}`}
          onRemove={onClearAssociationFilter}
        />
      )}
    </div>
  );
};

export default PrintQueueFilters;
