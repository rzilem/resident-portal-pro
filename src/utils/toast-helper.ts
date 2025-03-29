
import { toast as sonnerToast } from "sonner";

/**
 * Helper function to standardize toast notifications
 * Compatible with both the new Sonner toast system and providing backward compatibility
 * 
 * @param title The main message to display
 * @param options Additional options like description, variant, etc.
 */
export const showToast = (
  title: string, 
  options?: { 
    description?: string; 
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    duration?: number;
  }
) => {
  const { variant, description, duration } = options || {};
  
  // Map variants to sonner's methods
  if (variant === 'destructive' || variant === 'error') {
    return sonnerToast.error(title, { description, duration });
  } else if (variant === 'success') {
    return sonnerToast.success(title, { description, duration });
  } else if (variant === 'warning') {
    // Sonner doesn't have a direct warning method, use custom style
    return sonnerToast(title, { 
      description, 
      duration,
      className: 'bg-yellow-50 text-yellow-800 border-yellow-300'
    });
  } else if (variant === 'info') {
    // Sonner doesn't have a direct info method, use custom style
    return sonnerToast(title, { 
      description, 
      duration,
      className: 'bg-blue-50 text-blue-800 border-blue-300'
    });
  } else {
    // Default toast
    return sonnerToast(title, { description, duration });
  }
};

// For backward compatibility
export const toast = showToast;
