
/**
 * Apply custom colors to DOM elements
 */
export const applyCustomColorsToDom = (customColors: any) => {
  if (!customColors) return;
  
  // Clear any theme preset classes first
  document.body.classList.forEach(className => {
    if (className.startsWith('theme-preset-')) {
      document.body.classList.remove(className);
    }
  });
  
  // Clear theme variables
  document.documentElement.style.removeProperty('--theme-primary');
  document.documentElement.style.removeProperty('--theme-secondary');
  document.documentElement.style.removeProperty('--theme-accent');
  document.documentElement.style.removeProperty('--theme-background');
  
  // Apply custom colors
  document.documentElement.style.setProperty('--color-primary', customColors.primary);
  document.documentElement.style.setProperty('--color-secondary', customColors.secondary);
  document.documentElement.style.setProperty('--color-accent', customColors.accent);
  document.documentElement.style.setProperty('--color-background', customColors.background);
  document.documentElement.style.setProperty('--color-text', customColors.text);
  document.documentElement.style.setProperty('--color-border', customColors.border);
  
  // Also update primary variable for immediate feedback
  document.documentElement.style.setProperty('--primary', customColors.primary);
  
  // Add class to indicate custom colors are applied
  document.body.classList.add('custom-colors-applied');
  document.body.classList.remove('theme-applied');
};

/**
 * Apply custom background to DOM elements
 */
export const applyCustomBackgroundToDom = (customBackground: any) => {
  if (!customBackground) {
    document.body.style.backgroundImage = 'none';
    document.body.classList.remove('custom-background', 'background-pattern', 'background-image');
    return;
  }

  document.body.classList.add('custom-background');
  
  if (customBackground.type === 'pattern') {
    document.body.style.backgroundImage = `url(${customBackground.pattern})`;
    document.body.classList.add('background-pattern');
    document.body.classList.remove('background-image');
  } else if (customBackground.type === 'image') {
    document.body.style.backgroundImage = `url(${customBackground.image})`;
    document.body.classList.add('background-image');
    document.body.classList.remove('background-pattern');
  }
};
