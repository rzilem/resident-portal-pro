
import { UserPreferences } from "@/types/user";

/**
 * Apply theme preset to DOM elements
 */
export const applyThemePresetToDOM = (presetId: string | null) => {
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
};

/**
 * Apply custom colors to DOM elements
 */
export const applyCustomColorsToDom = (colors: UserPreferences['customColors'] | null) => {
  if (colors) {
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    document.documentElement.style.setProperty('--color-background', colors.background);
    document.documentElement.style.setProperty('--color-text', colors.text);
    document.documentElement.style.setProperty('--color-border', colors.border);
  } else {
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-secondary');
    document.documentElement.style.removeProperty('--color-accent');
    document.documentElement.style.removeProperty('--color-background');
    document.documentElement.style.removeProperty('--color-text');
    document.documentElement.style.removeProperty('--color-border');
  }
};

/**
 * Apply custom background to DOM elements
 */
export const applyCustomBackgroundToDom = (customBackground: UserPreferences['customBackground'] | null) => {
  if (customBackground) {
    document.body.classList.add('custom-background');
    
    if (customBackground.type === 'pattern') {
      document.body.classList.add('background-pattern');
      document.body.classList.remove('background-image');
      
      // Find the pattern from our patterns collection
      const patterns = [
        {
          id: 'grid',
          url: "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"
        },
        {
          id: 'dots',
          url: "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"
        },
        {
          id: 'stripes',
          url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E"
        },
        {
          id: 'waves',
          url: "data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.655-1.248 2.67-3.457 5.09-5.218 8.52 1.524 16.19 5.97 26.91 6.356 11.106.39 11.428-2.24 13.456-7.74.28-.744.746-2.258 1.084-3.246.34-1.188.37-2.095-.334-2.86-.704-.767-2.417-.85-3.656-.425-1.445.5-1.986 2.08-3.46 1.815-.55-.098-.662-.094-1.1.066-.855.316-1.066 1.683-1.3 2.505-.05.173-.097.408-.146.646-.278 1.32-.576 2.743-2.296 2.352-1.9-.15-2.955-1.725-4.35-3.126-3.91-3.922-11.29-5.16-17.03-3.366-3.27 1.015-5.43 5.256-5.43 5.256s-1.27-1.95-7.174-3.138c-5.86-1.177-9.9 1.093-9.9 1.093s-.027-1.238-.13-2.976c-.093-1.56-.477-3.98-1.42-4.14-1.373-.233-3.307.893-3.307 3.476 0 .883.224 1.656.868 2.307.47.468.984.66 1.358.66.53 0 1.075-.42 1.28-.978.13-.356.183-.557.613-.967.234-.224.542-.357.673-.613.363-.702-.007-1.843-.766-2.286-.357-.207-.625-.594-.754-.975-.19-.55-.19-1.2.094-1.88.934-2.21 2.307-5.6.934-8.376C29.885.12 25.935-.657 22.97.34c-3.07 1.035-4.887 5.162-6.7 8.35-1.034 1.797-1.957 3.332-2.584 4.29-2.688 4.08-3.48 3.907-3.813 8.412l-.02.338c-.076 2.643-.094 3.241-.73 5.603-.154.558.272 2.1.19 2.62-.09.56-.513 1.743-1.63 1.61-.524-.06-2.5-.55-2.852-.666-1.075-.345-1.735-.225-1.735-.225' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"
        }
      ];
      
      const selectedPattern = patterns.find(p => p.id === customBackground.value);
      if (selectedPattern) {
        document.body.style.backgroundImage = `url(${selectedPattern.url})`;
      }
    } else {
      // URL or data URL background
      document.body.classList.add('background-image');
      document.body.classList.remove('background-pattern');
      document.body.style.backgroundImage = `url(${customBackground.value})`;
    }
  } else {
    // No custom background
    document.body.classList.remove('custom-background', 'background-pattern', 'background-image');
    document.body.style.backgroundImage = 'none';
  }
};

/**
 * Apply theme colors to document root
 */
export const applyThemeColors = (
  primaryColor: string, 
  secondaryColor: string, 
  accentColor: string, 
  background: string
) => {
  document.documentElement.style.setProperty('--theme-primary', primaryColor);
  document.documentElement.style.setProperty('--theme-secondary', secondaryColor);
  document.documentElement.style.setProperty('--theme-accent', accentColor);
  document.documentElement.style.setProperty('--theme-background', background);
  
  // Apply primary color to button backgrounds for immediate visual feedback
  document.documentElement.style.setProperty('--primary', primaryColor.replace('#', 'hsl('));
};

/**
 * Reset theme colors on document root
 */
export const resetThemeColors = () => {
  document.documentElement.style.removeProperty('--theme-primary');
  document.documentElement.style.removeProperty('--theme-secondary');
  document.documentElement.style.removeProperty('--theme-accent');
  document.documentElement.style.removeProperty('--theme-background');
  document.documentElement.style.removeProperty('--primary');
};
