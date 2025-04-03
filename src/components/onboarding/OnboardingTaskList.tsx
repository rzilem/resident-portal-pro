
import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Project } from '@/types/onboarding';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface OnboardingTaskListProps {
  project: Project;
}

const OnboardingTaskList: React.FC<OnboardingTaskListProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Collect association documents', completed: false },
    { id: '2', name: 'Set up bank accounts', completed: false },
    { id: '3', name: 'Create resident directory', completed: false },
    { id: '4', name: 'Schedule initial board meeting', completed: false },
    { id: '5', name: 'Configure accounting system', completed: false },
  ]);
  
  const [newTaskName, setNewTaskName] = useState('');
  
  const handleTaskToggle = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleAddTask = () => {
    if (newTaskName.trim()) {
      setTasks([
        ...tasks, 
        { 
          id: Math.random().toString(36).substring(2, 9), 
          name: newTaskName.trim(), 
          completed: false 
        }
      ]);
      setNewTaskName('');
    }
  };
  
  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Onboarding Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <TooltipButton 
                tooltipText="Add a new task"
                onClick={handleAddTask}
                disabled={!newTaskName.trim()}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </TooltipButton>
            </div>
            
            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    task.completed ? 'bg-muted border-muted-foreground/20' : 'bg-card'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={`text-sm font-medium ${
                        task.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {task.name}
                    </label>
                  </div>
                  <TooltipButton 
                    tooltipText="Remove this task"
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </TooltipButton>
                </div>
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center p-4 border rounded-md border-dashed">
                  <p className="text-muted-foreground">No tasks added yet</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <TooltipButton 
                tooltipText="Mark all tasks as completed"
                variant="outline" 
                size="sm"
                onClick={() => setTasks(tasks.map(task => ({ ...task, completed: true })))}
                className="gap-2"
                disabled={tasks.length === 0 || tasks.every(task => task.completed)}
              >
                <Check className="h-4 w-4" />
                Complete All
              </TooltipButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTaskList;
