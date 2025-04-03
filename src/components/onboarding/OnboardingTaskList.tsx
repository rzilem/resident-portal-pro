
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Users
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingProject, OnboardingTask, OnboardingTaskGroup } from '@/types/onboarding';
import { cn } from '@/lib/utils';

interface OnboardingTaskListProps {
  project: OnboardingProject;
  onUpdateTaskStatus: (
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ) => void;
}

const TaskItem = ({ 
  task, 
  taskGroupId,
  onUpdateTaskStatus 
}: { 
  task: OnboardingTask; 
  taskGroupId: string;
  onUpdateTaskStatus: (
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ) => void;
}) => {
  const isCompleted = task.status === 'completed';
  
  const handleToggleStatus = () => {
    onUpdateTaskStatus(
      taskGroupId,
      task.id,
      isCompleted ? 'not_started' : 'completed'
    );
  };
  
  return (
    <div className={cn(
      "border-b border-border py-3 px-2 hover:bg-accent/10 flex items-center space-x-3",
      isCompleted && "bg-accent/5"
    )}>
      <Checkbox 
        checked={isCompleted}
        onCheckedChange={handleToggleStatus}
      />
      
      <div className="flex-1">
        <p className={cn(
          "font-medium",
          isCompleted && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
        
        <div className="flex items-center mt-1 space-x-2 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {task.days} days
          </span>
          
          {task.teamAssigned && (
            <Badge variant="outline" className="px-1 py-0 text-xs">
              Team
            </Badge>
          )}
          
          {task.assignee && (
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {task.assignee}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {task.assigneeInitials && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white font-semibold text-sm">
            {task.assigneeInitials}
          </div>
        )}
        
        <Badge variant="outline" className="px-2 py-1">
          Team
        </Badge>
      </div>
    </div>
  );
};

const TaskGroup = ({ 
  group, 
  onUpdateTaskStatus 
}: { 
  group: OnboardingTaskGroup; 
  onUpdateTaskStatus: (
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent/5">
          <div className="flex items-center space-x-3">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
            
            <div>
              <h3 className="font-semibold">{group.title}</h3>
              <p className="text-xs text-muted-foreground">
                {group.completedTasks} of {group.totalTasks} tasks completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={group.completedTasks === group.totalTasks ? "success" : "outline"}>
              {group.completedTasks === group.totalTasks ? (
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </span>
              ) : (
                <span className="flex items-center">
                  <Circle className="h-3 w-3 mr-1" />
                  In Progress
                </span>
              )}
            </Badge>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="divide-y divide-border">
          {group.tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              taskGroupId={group.id}
              onUpdateTaskStatus={onUpdateTaskStatus} 
            />
          ))}
          
          {group.tasks.length === 0 && (
            <div className="py-4 px-4 text-center text-muted-foreground">
              No tasks in this group
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const OnboardingTaskList: React.FC<OnboardingTaskListProps> = ({ 
  project,
  onUpdateTaskStatus
}) => {
  const sortedTaskGroups = [...project.taskGroups].sort((a, b) => a.day - b.day);
  
  return (
    <div className="space-y-4">
      {sortedTaskGroups.map((group) => (
        <TaskGroup 
          key={group.id} 
          group={group} 
          onUpdateTaskStatus={onUpdateTaskStatus}
        />
      ))}
    </div>
  );
};

export default OnboardingTaskList;
