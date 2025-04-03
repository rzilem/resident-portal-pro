
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OnboardingProject } from '@/types/onboarding';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface OnboardingDashboardProps {
  projects: OnboardingProject[];
  isLoading: boolean;
  onCreateProject: () => void;
}

const OnboardingDashboard: React.FC<OnboardingDashboardProps> = ({
  projects,
  isLoading,
  onCreateProject
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Onboarding Projects</h1>
        <Button onClick={onCreateProject}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Onboarding Project
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Onboarding Projects</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start your first client onboarding project to track tasks and monitor progress
            </p>
            <Button onClick={onCreateProject}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard: React.FC<{ project: OnboardingProject }> = ({ project }) => {
  // Calculate project stats
  const totalTasks = project.taskGroups.reduce((acc, group) => acc + group.totalTasks, 0);
  const completedTasks = project.taskGroups.reduce((acc, group) => acc + group.completedTasks, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Format dates
  const startDate = new Date(project.startDate);
  const timeAgo = formatDistanceToNow(startDate, { addSuffix: true });
  
  // Determine status icon
  let StatusIcon = Clock;
  let statusColor = "text-amber-500";
  
  if (project.status === 'completed') {
    StatusIcon = CheckCircle;
    statusColor = "text-green-500";
  } else if (project.status === 'on_hold') {
    StatusIcon = AlertCircle;
    statusColor = "text-red-500";
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant={project.processType === 'onboarding' ? 'default' : 'destructive'}>
            {project.processType === 'onboarding' ? 'Onboarding' : 'Offboarding'}
          </Badge>
          <Badge variant={project.status === 'completed' ? 'outline' : 'secondary'}>
            {project.status === 'active' ? 'Active' : 
             project.status === 'completed' ? 'Completed' : 'On Hold'}
          </Badge>
        </div>
        <CardTitle className="text-xl truncate" title={project.name}>{project.name}</CardTitle>
        <p className="text-sm text-muted-foreground truncate" title={project.associationName}>
          {project.associationName}
        </p>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">Started {timeAgo}</span>
            </div>
            <div className="flex items-center">
              <StatusIcon className={`h-4 w-4 mr-1 ${statusColor}`} />
              <span className={statusColor}>
                {completedTasks} / {totalTasks} tasks
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/leads/onboarding/${project.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingDashboard;
