
import React from 'react';
import { toast } from 'sonner';
import { ThemePreset } from './ThemePresetsData';
import { useSettings } from '@/hooks/use-settings';

export interface ThemePresetControllerProps {
  children: (methods: {
    applyTheme: (preset: ThemePreset) => void;
    resetTheme: () => void;
    selectedPresetId: string | undefined;
  }) => React.ReactNode;
}

const ThemePresetController: React.FC<ThemePresetControllerProps> = ({ children }) => {
  const { preferences, updatePreference } = useSettings();

  // Helper function to apply theme colors to DOM
  const applyThemeToDOM = (preset: ThemePreset) => {
    // Remove existing theme classes
    document.body.classList.forEach(className => {
      if (className.startsWith('theme-preset-')) {
        document.body.classList.remove(className);
      }
    });
    
    // Add the new theme class
    document.body.classList.add(`theme-preset-${preset.id}`);
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--theme-primary', preset.primaryColor);
    document.documentElement.style.setProperty('--theme-secondary', preset.secondaryColor);
    document.documentElement.style.setProperty('--theme-accent', preset.accentColor);
    document.documentElement.style.setProperty('--theme-background', preset.background);
    
    // Apply primary color to button backgrounds for immediate visual feedback
    document.documentElement.style.setProperty('--primary', preset.primaryColor.replace('#', 'hsl('));
    
    // Apply to specific UI elements for immediate feedback
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
      (button as HTMLElement).style.backgroundColor = preset.primaryColor;
    });
  };

  const applyTheme = (preset: ThemePreset) => {
    // Apply theme to DOM
    applyThemeToDOM(preset);
    
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
    // Remove existing theme classes
    document.body.classList.forEach(className => {
      if (className.startsWith('theme-preset-')) {
        document.body.classList.remove(className);
      }
    });
    
    // Reset all theme-related CSS variables
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-secondary');
    document.documentElement.style.removeProperty('--theme-accent');
    document.documentElement.style.removeProperty('--theme-background');
    document.documentElement.style.removeProperty('--primary');
    
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
