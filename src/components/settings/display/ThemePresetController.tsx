
import React from 'react';
import { toast } from 'sonner';
import { ThemePreset } from './ThemePresetsData';
import { useSettings } from '@/hooks/use-settings';
import { applyPresetToUI, resetThemePreset } from '@/hooks/settings/apply-theme-preset';

export interface ThemePresetControllerProps {
  children: (methods: {
    applyTheme: (preset: ThemePreset) => void;
    resetTheme: () => void;
    selectedPresetId: string | undefined;
  }) => React.ReactNode;
}

const ThemePresetController: React.FC<ThemePresetControllerProps> = ({ children }) => {
  const { preferences, updatePreference } = useSettings();

  const applyTheme = (preset: ThemePreset) => {
    // Apply theme to DOM
    applyPresetToUI(preset);
    
    // Clear any custom colors when applying a preset
    if (preferences?.customColors) {
      updatePreference('customColors', null);
    }
    
    // Clear any custom background when applying a preset
    if (preferences?.customBackground) {
      updatePreference('customBackground', null);
      // This will ensure body background is cleared
      document.body.style.backgroundImage = 'none';
      document.body.classList.remove('custom-background', 'background-pattern', 'background-image');
    }
    
    // Save theme preference
    updatePreference('themePreset', preset.id);
    toast.success(`${preset.name} theme applied`);
  };

  const resetTheme = () => {
    // Reset theme
    resetThemePreset();
    
    // Update preference
    updatePreference('themePreset', null);
    toast.success('Theme reset to default');
  };

  return (
    <>
      {children({
        applyTheme,
        resetTheme,
        selectedPresetId: preferences?.themePreset
      })}
    </>
  );
};

export default ThemePresetController;
