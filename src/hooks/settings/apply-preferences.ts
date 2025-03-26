
import { UserPreferences } from "@/types/user";
import { applyUIPreferencesToDOM } from "./ui-utils";
import { 
  applyCustomColorsToDom,
  applyCustomBackgroundToDom
} from "./theme-utils";
import { applyThemePresetToDOM } from "./apply-theme-preset";

/**
 * Apply all preferences to the UI
 */
export const applyPreferencesToUI = (prefs: UserPreferences) => {
  // Apply UI preferences (card style, density, animations)
  applyUIPreferencesToDOM(prefs);
  
  // Handle theme preferences with proper precedence
  if (prefs.customColors) {
    // Custom colors override theme presets
    document.body.classList.remove('theme-applied');
    applyCustomColorsToDom(prefs.customColors);
    document.body.classList.add('custom-colors-applied');
  } else if (prefs.themePreset) {
    // Apply theme preset if no custom colors
    document.body.classList.remove('custom-colors-applied');
    applyThemePresetToDOM(prefs.themePreset);
  } else {
    // Reset if no theme preferences
    document.body.classList.remove('custom-colors-applied', 'theme-applied');
    
    // Remove all theme variables
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-secondary');
    document.documentElement.style.removeProperty('--theme-accent');
    document.documentElement.style.removeProperty('--theme-background');
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-secondary');
    document.documentElement.style.removeProperty('--color-accent');
    document.documentElement.style.removeProperty('--color-background');
    document.documentElement.style.removeProperty('--color-text');
    document.documentElement.style.removeProperty('--color-border');
  }
  
  // Apply custom background after themes (can be used with either theme option)
  applyCustomBackgroundToDom(prefs.customBackground);
};

/**
 * Apply a specific preference to UI
 */
export const applySpecificPreferenceToUI = (key: keyof UserPreferences, value: any, prefs: UserPreferences) => {
  switch (key) {
    case 'cardStyle':
      document.body.classList.remove('card-style-default', 'card-style-flat', 'card-style-glass');
      document.body.classList.add(`card-style-${value}`);
      break;
      
    case 'density':
      document.body.classList.remove('density-comfortable', 'density-compact', 'density-spacious');
      document.body.classList.add(`density-${value}`);
      break;
      
    case 'animations':
      if (value) {
        document.body.classList.remove('animations-disabled');
      } else {
        document.body.classList.add('animations-disabled');
      }
      break;
      
    case 'themePreset':
      if (value) {
        // Clear custom colors when applying a theme preset
        document.body.classList.remove('custom-colors-applied');
        document.documentElement.style.removeProperty('--color-primary');
        document.documentElement.style.removeProperty('--color-secondary');
        document.documentElement.style.removeProperty('--color-accent');
        document.documentElement.style.removeProperty('--color-background');
        document.documentElement.style.removeProperty('--color-text');
        document.documentElement.style.removeProperty('--color-border');
        
        // Apply the theme preset
        applyThemePresetToDOM(value);
      } else {
        // Reset theme if value is null
        document.body.classList.remove('theme-applied');
        document.documentElement.style.removeProperty('--theme-primary');
        document.documentElement.style.removeProperty('--theme-secondary');
        document.documentElement.style.removeProperty('--theme-accent');
        document.documentElement.style.removeProperty('--theme-background');
      }
      break;
      
    case 'customColors':
      if (value) {
        // Clear theme preset when applying custom colors
        document.body.classList.remove('theme-applied');
        document.body.classList.forEach(className => {
          if (className.startsWith('theme-preset-')) {
            document.body.classList.remove(className);
          }
        });
        document.documentElement.style.removeProperty('--theme-primary');
        document.documentElement.style.removeProperty('--theme-secondary');
        document.documentElement.style.removeProperty('--theme-accent');
        document.documentElement.style.removeProperty('--theme-background');
        
        // Apply custom colors
        applyCustomColorsToDom(value);
        document.body.classList.add('custom-colors-applied');
      } else {
        // Reset custom colors
        document.body.classList.remove('custom-colors-applied');
        document.documentElement.style.removeProperty('--color-primary');
        document.documentElement.style.removeProperty('--color-secondary');
        document.documentElement.style.removeProperty('--color-accent');
        document.documentElement.style.removeProperty('--color-background');
        document.documentElement.style.removeProperty('--color-text');
        document.documentElement.style.removeProperty('--color-border');
      }
      break;
      
    case 'customBackground':
      applyCustomBackgroundToDom(value);
      break;
      
    default:
      // For other preferences, we'll just update the full set
      if (Object.keys(prefs).length > 0) {
        applyPreferencesToUI(prefs);
      }
      break;
  }
};
