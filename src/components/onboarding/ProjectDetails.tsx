
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Calendar,
  Clock,
  Share,
  Edit,
  Trash2,
  ArrowUpRight,
  ClipboardList,
  BarChart3,
  UserPlus
} from 'lucide-react';
import { OnboardingProject, OnboardingTask, OnboardingTaskGroup } from '@/types/onboarding';
import { toast } from 'sonner';
import OnboardingTaskList from '@/components/onboarding/OnboardingTaskList';
import ProjectTimeline from '@/components/onboarding/ProjectTimeline';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ClientSharingInfo from '@/components/onboarding/ClientSharingInfo';

interface ProjectDetailsProps {
  project: OnboardingProject;
  shareableLink: string;
  onUpdateTaskStatus: (
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ) => void;
  onDeleteProject?: () => Promise<void>;
  isLoading: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  shareableLink,
  onUpdateTaskStatus,
  onDeleteProject,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Calculate project stats
  const totalTasks = project.taskGroups.reduce((acc, group) => acc + group.totalTasks, 0);
  const completedTasks = project.taskGroups.reduce((acc, group) => acc + group.completedTasks, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const goBack = () => {
    navigate('/leads/onboarding');
  };
  
  const handleDeleteProject = async () => {
    if (onDeleteProject) {
      try {
        await onDeleteProject();
        toast.success('Project deleted successfully');
        navigate('/leads/onboarding');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xl">Loading project details...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.associationName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Start Date</p>
            <p className="text-xl font-bold">
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Progress</p>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-24">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xl font-bold">{progress}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Tasks</p>
            <p className="text-xl font-bold">
              {completedTasks} / {totalTasks} <span className="text-sm font-normal">completed</span>
            </p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="tasks">
            <ClipboardList className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="sharing">
            <Share className="h-4 w-4 mr-2" />
            Client Access
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-6">
          <OnboardingTaskList 
            project={project}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline project={project} />
        </TabsContent>
        
        <TabsContent value="sharing" className="mt-6">
          <ClientSharingInfo 
            project={project}
            shareableLink={shareableLink}
          />
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated tasks and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetails;
