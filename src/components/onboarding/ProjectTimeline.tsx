
import React from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { OnboardingProject } from '@/types/onboarding';
import { cn } from '@/lib/utils';

interface ProjectTimelineProps {
  project: OnboardingProject;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  // Sort task groups by day
  const sortedTaskGroups = [...project.taskGroups].sort((a, b) => a.day - b.day);
  
  // Calculate the number of days since the start
  const startDate = new Date(project.startDate);
  const currentDate = new Date();
  const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-4">Timeline</h3>
      
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-gray-200" />
        
        {sortedTaskGroups.map((group, index) => {
          const isCompleted = group.completedTasks === group.totalTasks;
          const isCurrent = daysSinceStart >= group.day && 
                           (index === sortedTaskGroups.length - 1 || 
                            daysSinceStart < sortedTaskGroups[index + 1].day);
          const isPast = daysSinceStart >= group.day && !isCurrent;
          const isFuture = daysSinceStart < group.day;
          
          let statusIcon = null;
          let statusColorClass = '';
          
          if (isCompleted) {
            statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
            statusColorClass = 'text-green-500 border-green-500';
          } else if (isCurrent) {
            statusIcon = <Clock className="h-5 w-5 text-amber-500" />;
            statusColorClass = 'text-amber-500 border-amber-500';
          } else if (isPast && !isCompleted) {
            statusIcon = <AlertCircle className="h-5 w-5 text-red-500" />;
            statusColorClass = 'text-red-500 border-red-500';
          } else {
            statusIcon = <Clock className="h-5 w-5 text-gray-400" />;
            statusColorClass = 'text-gray-400 border-gray-400';
          }
          
          return (
            <div key={group.id} className="mb-6 relative">
              {/* Status dot */}
              <div className={cn(
                "absolute left-[-22px] -top-0.5 w-5 h-5 rounded-full bg-white border-2",
                statusColorClass
              )}>
                {statusIcon}
              </div>
              
              <div>
                <h4 className={cn(
                  "font-medium",
                  isCompleted && "text-green-600",
                  isCurrent && "text-amber-600",
                  isPast && !isCompleted && "text-red-600",
                  isFuture && "text-gray-600"
                )}>
                  {group.title}
                </h4>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {group.completedTasks} of {group.totalTasks} tasks completed
                </p>
                
                {group.tasks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {group.tasks.slice(0, 3).map(task => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "text-xs border-l-2 pl-2",
                          task.status === 'completed' ? "border-green-500" : "border-gray-300"
                        )}
                      >
                        <span className={cn(
                          task.status === 'completed' && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                    
                    {group.tasks.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        + {group.tasks.length - 3} more tasks
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;
