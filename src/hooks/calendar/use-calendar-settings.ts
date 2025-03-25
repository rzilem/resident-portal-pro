
import { useState, useCallback } from 'react';
import { AssociationCalendarSettings } from '@/types/calendar';
import { calendarService } from '@/services/calendarService';
import { toast } from 'sonner';

interface UseCalendarSettingsProps {
  associationId?: string;
}

export function useCalendarSettings({ associationId }: UseCalendarSettingsProps) {
  const [calendarSettings, setCalendarSettings] = useState<AssociationCalendarSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch calendar settings
  const fetchCalendarSettings = useCallback(() => {
    if (!associationId) return;
    
    try {
      const settings = calendarService.getCalendarSettingsByAssociationId(associationId);
      setCalendarSettings(settings);
    } catch (err) {
      console.error('Error fetching calendar settings:', err);
      setError('Failed to load calendar settings');
    }
  }, [associationId]);
  
  // Update calendar settings
  const updateCalendarSettings = useCallback((updates: Partial<AssociationCalendarSettings>) => {
    if (!associationId || !calendarSettings) return;
    
    try {
      const updatedSettings = calendarService.updateCalendarSettings(associationId, updates);
      setCalendarSettings(updatedSettings);
      toast.success('Calendar settings updated successfully');
      return updatedSettings;
    } catch (err) {
      console.error('Error updating calendar settings:', err);
      toast.error('Failed to update calendar settings');
      throw err;
    }
  }, [associationId, calendarSettings]);
  
  return {
    calendarSettings,
    error,
    fetchCalendarSettings,
    updateCalendarSettings
  };
}
