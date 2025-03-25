
import React from 'react';
import { Button } from "@/components/ui/button";
import { GLAccount } from '@/types/accounting';
import GlAccountSelector from './GlAccountSelector';

interface GlAccountMapping {
  [key: string]: string;
}

interface GlAccountMappingFormProps {
  accounts: GLAccount[];
  mappings: GlAccountMapping;
  onSave: (mappings: GlAccountMapping) => Promise<void>;
  categories: { id: string; label: string; description: string }[];
}

const GlAccountMappingForm: React.FC<GlAccountMappingFormProps> = ({
  accounts,
  mappings,
  onSave,
  categories
}) => {
  const [localMappings, setLocalMappings] = React.useState<GlAccountMapping>(mappings);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (category: string, accountId: string) => {
    setLocalMappings({
      ...localMappings,
      [category]: accountId
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(localMappings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id} className="space-y-1">
          <GlAccountSelector
            accounts={accounts}
            selectedAccount={localMappings[category.id] || ''}
            onChange={(value) => handleChange(category.id, value)}
            label={category.label}
            placeholder={`Select ${category.label} account`}
          />
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      ))}
      
      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className="mt-4"
      >
        {isSaving ? 'Saving...' : 'Save GL Mappings'}
      </Button>
    </div>
  );
};

export default GlAccountMappingForm;
