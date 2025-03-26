
import { UserPreferences } from "@/types/user";

/**
 * Apply card style to DOM
 */
export const applyCardStyle = (cardStyle: string | undefined) => {
  if (cardStyle) {
    document.body.classList.remove('card-style-default', 'card-style-flat', 'card-style-glass');
    document.body.classList.add(`card-style-${cardStyle}`);
  }
};

/**
 * Apply density to DOM
 */
export const applyDensity = (density: string | undefined) => {
  if (density) {
    document.body.classList.remove('density-comfortable', 'density-compact', 'density-spacious');
    document.body.classList.add(`density-${density}`);
  }
};

/**
 * Apply animations setting to DOM
 */
export const applyAnimationsSetting = (animations: boolean | undefined) => {
  if (animations !== undefined) {
    if (animations) {
      document.body.classList.remove('animations-disabled');
    } else {
      document.body.classList.add('animations-disabled');
    }
  }
};

/**
 * Apply all UI preferences to the DOM
 */
export const applyUIPreferencesToDOM = (prefs: UserPreferences) => {
  // Apply card style
  applyCardStyle(prefs.cardStyle);
  
  // Apply density
  applyDensity(prefs.density);
  
  // Apply animations setting
  applyAnimationsSetting(prefs.animations);
};
