
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TemplatesHeaderProps {
  onCreateClick: () => void;
}

const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-medium">Message Templates</h2>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Create Template
      </Button>
    </div>
  );
};

export default TemplatesHeader;
