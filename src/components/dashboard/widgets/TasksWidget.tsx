
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TasksWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const TasksWidget = ({ size = 'small', cardClass = '' }: TasksWidgetProps) => {
  // Sample tasks data
  const tasks = [
    { id: 1, title: 'Review maintenance requests', completed: false, priority: 'high' },
    { id: 2, title: 'Sign financial documents', completed: false, priority: 'medium' },
    { id: 3, title: 'Schedule board meeting', completed: true, priority: 'medium' },
    { id: 4, title: 'Send resident newsletter', completed: false, priority: 'low' },
    { id: 5, title: 'Update property documentation', completed: false, priority: 'high' },
  ];

  // Decide how many tasks to show based on size
  const limit = size === 'small' ? 3 : size === 'medium' ? 4 : 6;
  const displayedTasks = tasks.slice(0, limit);
  const remainingCount = Math.max(0, tasks.length - limit);

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
                <p className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </p>
                {size !== 'small' && (
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
