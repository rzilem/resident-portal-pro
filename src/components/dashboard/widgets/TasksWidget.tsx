
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TasksWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

const TasksWidget = ({ size = 'medium' }: TasksWidgetProps) => {
  // Mock tasks data
  const tasks = [
    { id: '1', title: 'Review monthly financials', completed: false },
    { id: '2', title: 'Prepare for board meeting', completed: true },
    { id: '3', title: 'Approve maintenance request', completed: false },
    { id: '4', title: 'Follow up on resident complaint', completed: false },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-2">
              <Checkbox id={`task-${task.id}`} checked={task.completed} />
              <label
                htmlFor={`task-${task.id}`}
                className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {task.title}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksWidget;
