
import { useState, useCallback } from 'react';
import { AssociationCalendarSettings } from '@/types/calendar';
import { calendarService } from '@/services/calendar';
import { toast } from 'sonner';

interface UseCalendarSettingsProps {
  associationId?: string;
}

export function useCalendarSettings({ associationId }: UseCalendarSettingsProps) {
  const [calendarSettings, setCalendarSettings] = useState<AssociationCalendarSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch calendar settings
  const fetchCalendarSettings = useCallback(() => {
    if (!associationId) {
      setError('No association selected');
      return;
    }
    
    try {
      const settings = calendarService.getCalendarSettingsByAssociationId(associationId);
      setCalendarSettings(settings);
      setError(null);
    } catch (err) {
      console.error('Error fetching calendar settings:', err);
      setError('Failed to load calendar settings');
    }
  }, [associationId]);
  
  // Update calendar settings
  const updateCalendarSettings = useCallback((updates: Partial<AssociationCalendarSettings>) => {
    if (!associationId) {
      toast.error('No association selected');
      return null;
    }
    
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
  }, [associationId]);
  
  return {
    calendarSettings,
    error,
    fetchCalendarSettings,
    updateCalendarSettings
  };
}
