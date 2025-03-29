
import { useState, useEffect, useCallback } from 'react';
import { AssociationCalendarSettings } from '@/types/calendar';
import { calendarSettingsService } from '@/services/calendar/calendarSettingsService';

interface UseCalendarSettingsProps {
  associationId?: string;
}

export function useCalendarSettings({ associationId }: UseCalendarSettingsProps) {
  const [calendarSettings, setCalendarSettings] = useState<AssociationCalendarSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch calendar settings
  const fetchCalendarSettings = useCallback(() => {
    if (!associationId) {
      setCalendarSettings(null);
      return;
    }
    
    try {
      const settings = calendarSettingsService.getCalendarSettingsByAssociationId(associationId);
      setCalendarSettings(settings);
      setError(null);
    } catch (err) {
      console.error('Error fetching calendar settings:', err);
      setError('Failed to load calendar settings');
    }
  }, [associationId]);
  
  // Update calendar settings
  const updateCalendarSettings = useCallback((settings: AssociationCalendarSettings) => {
    if (!associationId) {
      throw new Error('Association ID is required to update calendar settings');
    }
    
    try {
      const updatedSettings = calendarSettingsService.updateCalendarSettings(associationId, settings);
      setCalendarSettings(updatedSettings);
      setError(null);
      return updatedSettings;
    } catch (err) {
      console.error('Error updating calendar settings:', err);
      setError('Failed to update calendar settings');
      throw err;
    }
  }, [associationId]);
  
  // Load settings when associationId changes
  useEffect(() => {
    if (associationId) {
      fetchCalendarSettings();
    }
  }, [associationId, fetchCalendarSettings]);
  
  return {
    calendarSettings,
    error,
    fetchCalendarSettings,
    updateCalendarSettings
  };
}
