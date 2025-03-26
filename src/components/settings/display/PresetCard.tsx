
import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ThemePreset } from './ThemePresetsData';

interface PresetCardProps {
  preset: ThemePreset;
  isSelected: boolean;
  onSelect: (preset: ThemePreset) => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, isSelected, onSelect }) => {
  return (
    <div 
      className="cursor-pointer group"
      onClick={() => onSelect(preset)}
    >
      <Card className={`overflow-hidden h-40 transition-all hover:scale-105 hover:shadow-md border-2 relative ${isSelected ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
        {preset.icon}
        <div 
          className="h-24 w-full" 
          style={{ background: preset.background }}
        />
        <div className="p-2 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-sm">{preset.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
          </div>
          {isSelected && (
            <span className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PresetCard;
