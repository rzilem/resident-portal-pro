
import React from 'react';
import { Button } from '@/components/ui/button';

interface MappingFooterProps {
  onStepChange: (step: 'initial' | 'mapping' | 'validation') => void;
  onContinue: () => void;
}

const MappingFooter: React.FC<MappingFooterProps> = ({ onStepChange, onContinue }) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <Button variant="outline" onClick={() => onStepChange('initial')}>Back</Button>
      <Button onClick={onContinue}>Continue to Validation</Button>
    </div>
  );
};

export default MappingFooter;
