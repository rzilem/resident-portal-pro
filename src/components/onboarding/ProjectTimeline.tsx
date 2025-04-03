
import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, Edit, Save, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Project } from '@/types/onboarding';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

interface ProjectTimelineProps {
  project: Project;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  const { toast } = useToast();
  const startDate = new Date(project.startDate);
  
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      title: 'Project Kickoff',
      date: format(startDate, 'yyyy-MM-dd'),
      time: '09:00 AM',
      description: 'Initial meeting to discuss onboarding plan and collect necessary information',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Documentation Collection',
      date: format(addDays(startDate, 7), 'yyyy-MM-dd'),
      description: 'Deadline for the client to submit all required documentation',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Data Migration',
      date: format(addDays(startDate, 14), 'yyyy-MM-dd'),
      description: 'Transfer all association data to the management system',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Financial Setup',
      date: format(addDays(startDate, 21), 'yyyy-MM-dd'),
      description: 'Set up banking, payments, and accounting systems',
      status: 'upcoming'
    },
    {
      id: '5',
      title: 'Board Training',
      date: format(addDays(startDate, 28), 'yyyy-MM-dd'),
      time: '10:00 AM',
      description: 'Training session for board members on using the management platform',
      status: 'upcoming'
    },
  ]);
  
  const [editing, setEditing] = useState(false);
  
  const handleToggleEditing = () => {
    if (editing) {
      toast({
        title: "Timeline Saved",
        description: "Your changes to the timeline have been saved"
      });
    }
    setEditing(!editing);
  };
  
  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };
  
  const handleAddEvent = () => {
    const lastEvent = events[events.length - 1];
    const lastDate = new Date(lastEvent.date);
    
    const newEvent: TimelineEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'New Milestone',
      date: format(addDays(lastDate, 7), 'yyyy-MM-dd'),
      description: 'Description for this milestone',
      status: 'upcoming'
    };
    
    setEvents([...events, newEvent]);
    
    toast({
      title: "Event Added",
      description: "A new milestone has been added to the timeline"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Onboarding Timeline</h2>
        <div className="flex gap-2">
          <TooltipButton 
            tooltipText="Add a new milestone"
            variant="outline" 
            size="sm"
            onClick={handleAddEvent}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </TooltipButton>
          
          <TooltipButton 
            tooltipText={editing ? "Save timeline changes" : "Edit timeline"}
            variant={editing ? "default" : "outline"} 
            size="sm"
            onClick={handleToggleEditing}
            className="gap-2"
          >
            {editing ? (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )}
          </TooltipButton>
        </div>
      </div>
      
      <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 pl-6 space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-9 mt-1.5 w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
              {index === 0 && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
            
            <Card className="shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  
                  <Badge className={`ml-auto ${getStatusColor(event.status)}`} variant="secondary">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-sm">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;
