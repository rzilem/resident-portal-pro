
import React from 'react';
import PresetCard from './PresetCard';
import { ThemePreset } from './ThemePresetsData';

interface PresetSectionProps {
  title: string;
  presets: ThemePreset[];
  selectedPresetId: string | undefined;
  onSelectPreset: (preset: ThemePreset) => void;
}

const PresetSection: React.FC<PresetSectionProps> = ({ 
  title, 
  presets, 
  selectedPresetId, 
  onSelectPreset 
}) => {
  return (
    <div className="space-y-2 mt-4">
      <h3 className="font-medium text-sm">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map(preset => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isSelected={selectedPresetId === preset.id}
            onSelect={onSelectPreset}
          />
        ))}
      </div>
    </div>
  );
};

export default PresetSection;
