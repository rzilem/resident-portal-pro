
import { ThemePreset } from "@/components/settings/display/ThemePresetsData";

/**
 * Apply theme preset to DOM elements
 */
export const applyThemePresetToDOM = (presetId: string | null, preset?: ThemePreset) => {
  if (!presetId) return;
  
  // Remove all possible theme preset classes
  const allThemeClasses = [
    // Original themes
    'theme-preset-ocean', 
    'theme-preset-forest', 
    'theme-preset-sunset', 
    'theme-preset-lavender', 
    'theme-preset-cherry', 
    'theme-preset-midnight',
    'theme-preset-emerald',
    'theme-preset-ruby',
    'theme-preset-graphite',
    // Christmas themes
    'theme-preset-christmas-traditional',
    'theme-preset-christmas-frost',
    // Summer themes
    'theme-preset-summer-beach',
    'theme-preset-summer-tropical',
    // Gradient themes
    'theme-preset-gradient-sunset',
    'theme-preset-gradient-cosmic',
    'theme-preset-gradient-emerald',
    'theme-preset-gradient-dusk'
  ];
  
  document.body.classList.remove(...allThemeClasses);
  document.body.classList.add(`theme-preset-${presetId}`);
  
  // If we have the preset object, apply its colors directly
  if (preset) {
    applyThemeColorsFromPreset(preset);
  }
};

/**
 * Apply theme colors from a preset
 */
export const applyThemeColorsFromPreset = (preset: ThemePreset) => {
  // Apply theme colors to CSS variables
  document.documentElement.style.setProperty('--theme-primary', preset.primaryColor);
  document.documentElement.style.setProperty('--theme-secondary', preset.secondaryColor);
  document.documentElement.style.setProperty('--theme-accent', preset.accentColor);
  document.documentElement.style.setProperty('--theme-background', preset.background);
  
  // Apply primary color to button backgrounds for immediate visual feedback
  document.documentElement.style.setProperty('--primary', preset.primaryColor.replace('#', 'hsl('));
};

/**
 * Apply a preset to the UI 
 */
export const applyPresetToUI = (preset: ThemePreset) => {
  // Remove existing theme classes
  document.body.classList.forEach(className => {
    if (className.startsWith('theme-preset-')) {
      document.body.classList.remove(className);
    }
  });
  
  // Add the new theme class
  document.body.classList.add(`theme-preset-${preset.id}`);
  
  // Apply theme colors
  applyThemeColorsFromPreset(preset);
};

/**
 * Reset theme colors on document root
 */
export const resetThemePreset = () => {
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
};
