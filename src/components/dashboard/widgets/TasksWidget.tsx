
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Plus, Clock, AlertTriangle, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TasksWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const TasksWidget = ({ size = 'small', cardClass = '' }: TasksWidgetProps) => {
  // Sample tasks data with realistic HOA management tasks
  const tasks = [
    { id: 1, title: 'Review maintenance requests', completed: false, priority: 'high', due: 'Today' },
    { id: 2, title: 'Sign financial documents', completed: false, priority: 'medium', due: 'Tomorrow' },
    { id: 3, title: 'Schedule quarterly board meeting', completed: true, priority: 'medium', due: 'Completed' },
    { id: 4, title: 'Send resident newsletter', completed: false, priority: 'low', due: 'Next week' },
    { id: 5, title: 'Update property documentation', completed: false, priority: 'high', due: 'Overdue' },
    { id: 6, title: 'Approve landscaping proposal', completed: false, priority: 'medium', due: 'Tomorrow' },
    { id: 7, title: 'Follow up on insurance claim', completed: false, priority: 'high', due: 'Overdue' },
    { id: 8, title: 'Review security vendor contract', completed: true, priority: 'medium', due: 'Completed' },
  ];

  // Decide how many tasks to show based on size
  const limit = size === 'small' ? 3 : size === 'medium' ? 4 : 6;
  const displayedTasks = tasks.slice(0, limit);
  const remainingCount = Math.max(0, tasks.length - limit);
  
  // Calculate completion percentage
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = Math.round((completedCount / tasks.length) * 100);

  const getDueElement = (due: string) => {
    if (due === 'Overdue') {
      return <Badge variant="destructive" className="text-xs ml-2 px-1 py-0 font-normal"><AlertTriangle className="h-3 w-3 mr-1" /> {due}</Badge>;
    }
    if (due === 'Today') {
      return <Badge variant="secondary" className="text-xs ml-2 px-1 py-0 font-normal"><Clock className="h-3 w-3 mr-1" /> {due}</Badge>;
    }
    if (due === 'Tomorrow') {
      return <Badge variant="outline" className="text-xs ml-2 px-1 py-0 font-normal bg-blue-50 text-blue-600 border-blue-200"><CalendarClock className="h-3 w-3 mr-1" /> {due}</Badge>;
    }
    if (due === 'Completed') {
      return null; // Don't show badge for completed items
    }
    return <Badge variant="outline" className="text-xs ml-2 px-1 py-0 font-normal">{due}</Badge>;
  };

  const getPriorityStyle = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
    }
  };

  return (
    <Card className={`${cardClass} overflow-hidden`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-md">Tasks</CardTitle>
            <Badge variant="outline">{tasks.filter(t => !t.completed).length} pending</Badge>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> {completionPercentage}%
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-1.5 mt-1" />
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {displayedTasks.map(task => (
            <li key={task.id} className="flex items-start gap-2 group">
              <div className="flex-shrink-0 mt-0.5">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "font-medium"} truncate`}>
                    {task.title}
                  </p>
                  {!task.completed && getDueElement(task.due)}
                </div>
                {size !== 'small' && !task.completed && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1.5 ${getPriorityStyle(task.priority)}`}
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>
            </li>
          ))}
          
          {remainingCount > 0 && (
            <li className="text-sm text-muted-foreground pt-1 text-center border-t mt-3 pt-3">
              + {remainingCount} more tasks
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button variant="outline" size="sm" className="w-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TasksWidget;
