
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Plus, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  const getDueElement = (due: string) => {
    if (due === 'Overdue') {
      return <Badge variant="destructive" className="text-xs ml-2 px-1 py-0"><AlertTriangle className="h-3 w-3 mr-1" /> {due}</Badge>;
    }
    if (due === 'Today') {
      return <Badge variant="secondary" className="text-xs ml-2 px-1 py-0"><Clock className="h-3 w-3 mr-1" /> {due}</Badge>;
    }
    if (due === 'Completed') {
      return null; // Don't show badge for completed items
    }
    return <Badge variant="outline" className="text-xs ml-2 px-1 py-0">{due}</Badge>;
  };

  return (
    <Card className={`${cardClass}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Tasks</CardTitle>
          <Badge variant="outline">{tasks.filter(t => !t.completed).length} pending</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayedTasks.map(task => (
            <li key={task.id} className="flex items-start gap-2">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center">
                  <p className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </p>
                  {!task.completed && getDueElement(task.due)}
                </div>
                {size !== 'small' && !task.completed && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>
            </li>
          ))}
          
          {remainingCount > 0 && (
            <li className="text-sm text-muted-foreground pt-1">
              + {remainingCount} more tasks...
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TasksWidget;
