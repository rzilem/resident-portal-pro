
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useAssociations } from '@/hooks/use-associations';

interface AssociationSelectorProps {
  className?: string;
}

const AssociationSelector: React.FC<AssociationSelectorProps> = ({ className = '' }) => {
  const { 
    associations, 
    activeAssociation, 
    selectAssociation 
  } = useAssociations();

  const handlePrevious = () => {
    if (!activeAssociation || associations.length <= 1) return;
    
    const currentIndex = associations.findIndex(a => a.id === activeAssociation.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : associations.length - 1;
    selectAssociation(associations[prevIndex]);
  };

  const handleNext = () => {
    if (!activeAssociation || associations.length <= 1) return;
    
    const currentIndex = associations.findIndex(a => a.id === activeAssociation.id);
    const nextIndex = currentIndex < associations.length - 1 ? currentIndex + 1 : 0;
    selectAssociation(associations[nextIndex]);
  };

  const handleSelectChange = (value: string) => {
    const selected = associations.find(a => a.id === value);
    if (selected) {
      selectAssociation(selected);
    }
  };

  if (!activeAssociation) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handlePrevious}
        disabled={associations.length <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Select 
        value={activeAssociation.id} 
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="min-w-[220px]">
          <SelectValue placeholder="Select Association" />
        </SelectTrigger>
        <SelectContent>
          {associations.map(association => (
            <SelectItem key={association.id} value={association.id}>
              {association.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleNext}
        disabled={associations.length <= 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AssociationSelector;
