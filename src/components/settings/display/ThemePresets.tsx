
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ThemePresetController from './ThemePresetController';
import PresetSection from './PresetSection';
import { getPresetsByCategory, getAllPresets } from './ThemePresetsData';
import { applyThemePresetToDOM, applyThemeColorsFromPreset } from '@/hooks/settings/apply-theme-preset';

const ThemePresets: React.FC = () => {
  // Group presets by category
  const categories = getPresetsByCategory();

  // Get all presets for initial theme application
  const allPresets = getAllPresets();

  return (
    <ThemePresetController>
      {({ applyTheme, resetTheme, selectedPresetId }) => {
        // Apply saved theme on component mount
        useEffect(() => {
          if (selectedPresetId) {
            const selectedPreset = allPresets.find(preset => preset.id === selectedPresetId);
            if (selectedPreset) {
              // Remove any custom colors classes
              document.body.classList.remove('custom-colors-applied');
              
              // We don't want to trigger a toast on initial load, so we just apply the theme to DOM
              applyThemePresetToDOM(selectedPreset.id, selectedPreset);
            }
          }
        }, [selectedPresetId]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Theme Presets</Label>
              <Button variant="outline" size="sm" onClick={resetTheme}>
                Reset Theme
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Choose from our pre-designed themes to instantly transform your interface
            </p>
            
            {/* Classic Themes */}
            <PresetSection 
              title="Classic Themes" 
              presets={categories.classic}
              selectedPresetId={selectedPresetId}
              onSelectPreset={applyTheme}
            />
            
            {/* Seasonal Themes */}
            <PresetSection 
              title="Seasonal Themes" 
              presets={categories.seasonal}
              selectedPresetId={selectedPresetId}
              onSelectPreset={applyTheme}
            />
            
            {/* Gradient Themes */}
            <PresetSection 
              title="Gradient Themes" 
              presets={categories.gradient}
              selectedPresetId={selectedPresetId}
              onSelectPreset={applyTheme}
            />
          </div>
        );
      }}
    </ThemePresetController>
  );
};

export default ThemePresets;

