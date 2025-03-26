
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckIcon, XIcon } from 'lucide-react';
import { DocumentAccessLevel } from '@/types/documents';

interface CategoryEditFormProps {
  categoryId: string;
  tempName: string;
  tempAccessLevel: DocumentAccessLevel;
  setTempName: (name: string) => void;
  setTempAccessLevel: (level: DocumentAccessLevel) => void;
  onSave: (categoryId: string) => void;
  onCancel: () => void;
}

const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
  categoryId,
  tempName,
  tempAccessLevel,
  setTempName,
  setTempAccessLevel,
  onSave,
  onCancel
}) => {
  return (
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
          onClick={() => onSave(categoryId)}
          className="flex-1"
        >
          <CheckIcon className="h-3.5 w-3.5 mr-1" />
          Save
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          <XIcon className="h-3.5 w-3.5 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CategoryEditForm;
