
import { useState, useEffect, useMemo } from 'react';
import { useAuthRole } from './use-auth-role';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { calendarService } from '@/services/calendar';
import { useAssociations } from './use-associations';

export function useManagerCalendar() {
  const { currentUser, isManager } = useAuthRole();
  const { associations, isLoading: associationsLoading } = useAssociations();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all associations managed by the current user
  const managedAssociations = useMemo(() => {
    if (!isManager) return [];
    return associations;
  }, [associations, isManager]);

  // Load events from all managed associations
  useEffect(() => {
    if (!currentUser || associationsLoading) return;
    
    const fetchAllAssociationsEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let allEvents: CalendarEvent[] = [];
        
        // If user is a manager, get events from all their associations
        if (isManager && managedAssociations.length > 0) {
          // For each association, fetch its events and combine them
          for (const association of managedAssociations) {
            const associationEvents = calendarService.getAllEvents(
              currentUser.id,
              'admin',
              association.id
            );
            allEvents = [...allEvents, ...associationEvents];
          }
        } else {
          // For non-managers, get events they have access to
          allEvents = calendarService.getAllEvents(
            currentUser.id,
            'residents'
          );
        }
        
        setEvents(allEvents);
      } catch (err) {
        console.error("Error loading manager calendar events:", err);
        setError("Failed to load calendar events");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllAssociationsEvents();
  }, [currentUser, isManager, managedAssociations, associationsLoading]);

  return {
    events,
    isLoading,
    error,
    managedAssociations
  };
}
