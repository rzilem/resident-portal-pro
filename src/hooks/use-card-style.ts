
import { useSettings } from './use-settings';

export function useCardStyle() {
  const { preferences } = useSettings();
  
  // Default card class
  const defaultCardClass = "";
  
  // Get the current card style from preferences
  const cardStyle = preferences?.cardStyle || "default";
  
  // Map card style to CSS classes
  let additionalCardClass = "";
  switch (cardStyle) {
    case 'flat':
      additionalCardClass = "card-style-flat border-0 shadow-none bg-background";
      break;
    case 'glass':
      additionalCardClass = "card-style-glass backdrop-blur-sm bg-background/80 border border-muted/30";
      break;
    default:
      additionalCardClass = "card-style-default";
  }
  
  return {
    cardClass: `${defaultCardClass} ${additionalCardClass}`.trim(),
    cardStyle
  };
}
