
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
  
  // Apply theme preset
  if (prefs.themePreset) {
    applyThemePresetToDOM(prefs.themePreset);
  }
  
  // Apply custom colors
  applyCustomColorsToDom(prefs.customColors);
  
  // Apply custom background
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
      applyThemePresetToDOM(value);
      break;
      
    case 'customColors':
      applyCustomColorsToDom(value);
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
