
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
      additionalCardClass = "card-style-glass backdrop-blur-sm bg-background/80 border border-muted/30 shadow-xl";
      break;
    case 'rounded':
      additionalCardClass = "card-style-rounded rounded-xl border-0 shadow-lg overflow-hidden";
      break;
    default:
      additionalCardClass = "card-style-default shadow-sm hover:shadow-md transition-shadow duration-300";
  }
  
  return {
    cardClass: `${defaultCardClass} ${additionalCardClass}`.trim(),
    cardStyle
  };
}
