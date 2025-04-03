
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Users, 
  Building, 
  Share2, 
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { onboardingService } from '@/services/onboardingService';
import { OnboardingProject, OnboardingStats } from '@/types/onboarding';
import { toast } from 'sonner';
import OnboardingTaskList from '@/components/onboarding/OnboardingTaskList';
import NewProjectDialog from '@/components/onboarding/NewProjectDialog';
import ProjectTimeline from '@/components/onboarding/ProjectTimeline';
import ClientSharingInfo from '@/components/onboarding/ClientSharingInfo';
import { Skeleton } from '@/components/ui/skeleton';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<OnboardingProject | null>(null);
  const [projects, setProjects] = useState<OnboardingProject[]>([]);
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all projects first
        const allProjects = await onboardingService.getProjects();
        setProjects(allProjects);
        
        // If a project ID is specified in URL, load that project
        if (projectId) {
          const projectData = await onboardingService.getProjectById(projectId);
          if (projectData) {
            setProject(projectData);
            
            // Load stats for the project
            const statsData = await onboardingService.getProjectStats(projectId);
            if (statsData) {
              setStats(statsData.stats);
            }
          } else {
            toast.error('Project not found');
            navigate('/leads/onboarding');
          }
        } else if (allProjects.length > 0) {
          // If no project ID in URL but projects exist, use the first one
          setProject(allProjects[0]);
          
          // Load stats for the first project
          const statsData = await onboardingService.getProjectStats(allProjects[0].id);
          if (statsData) {
            setStats(statsData.stats);
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
        toast.error('Failed to load onboarding data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [projectId, navigate]);
  
  const handleCreateProject = async (
    associationId: string, 
    associationName: string, 
    templateId: string
  ) => {
    try {
      const newProject = await onboardingService.createProject(
        associationId, 
        associationName, 
        templateId
      );
      
      setProjects(prev => [...prev, newProject]);
      setProject(newProject);
      
      // Navigate to the new project
      navigate(`/leads/onboarding/${newProject.id}`);
      
      toast.success('New onboarding project created');
      setShowNewProjectDialog(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create onboarding project');
    }
  };
  
  const handleChangeProject = (projectId: string) => {
    navigate(`/leads/onboarding/${projectId}`);
  };
  
  const handleUpdateTaskStatus = async (
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ) => {
    if (!project) return;
    
    try {
      const updatedProject = await onboardingService.updateTaskStatus(
        project.id,
        taskGroupId,
        taskId,
        status
      );
      
      if (updatedProject) {
        setProject(updatedProject);
        
        // Refresh stats
        const statsData = await onboardingService.getProjectStats(project.id);
        if (statsData) {
          setStats(statsData.stats);
        }
        
        // Update in projects list
        setProjects(prev => prev.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        ));
        
        toast.success(`Task ${status === 'completed' ? 'completed' : 'updated'}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      );
    }
    
    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <Building className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Onboarding Projects</h3>
          <p className="text-muted-foreground mb-6">
            Create a new association onboarding project to get started
          </p>
          <Button onClick={() => setShowNewProjectDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Onboarding Project
          </Button>
        </div>
      );
    }
    
    if (!project) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <h3 className="text-xl font-medium mb-2">No Project Selected</h3>
          <p className="text-muted-foreground mb-6">
            Please select a project or create a new one
          </p>
          <Button onClick={() => setShowNewProjectDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Onboarding Project
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Project header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{project.associationName}</h2>
            <p className="text-muted-foreground text-sm">
              Started {new Date(project.startDate).toLocaleDateString()} 
              {project.status === 'completed' && ' • Completed'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Overall progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Onboarding Progress</CardTitle>
            <CardDescription>
              {stats?.completedTasks || 0} of {stats?.totalTasks || 0} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={project.progress} className="h-2" />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-muted-foreground text-sm">Completed</p>
                    <p className="font-medium">{stats?.completedTasks || 0} tasks</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-muted-foreground text-sm">Days Since Start</p>
                    <p className="font-medium">{stats?.daysElapsed || 0} days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground text-sm">Est. Days Remaining</p>
                    <p className="font-medium">{stats?.daysRemaining || 0} days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-muted-foreground text-sm">Client Access</p>
                    <p className="font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks & Timeline</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
            <TabsTrigger value="sharing">Client Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="md:col-span-1">
                <ProjectTimeline project={project} />
              </div>
              
              <div className="md:col-span-3">
                <OnboardingTaskList 
                  project={project}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
                <CardDescription>
                  Manage documents related to the onboarding process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <p className="text-muted-foreground mb-4">
                    No documents uploaded yet
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sharing" className="py-4">
            <ClientSharingInfo 
              project={project}
              shareableLink={project.shareableLink || ''}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Community Onboarding</h1>
        <p className="text-muted-foreground">
          Manage the onboarding process for new communities and associations
        </p>
      </div>
      
      {renderContent()}
      
      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default OnboardingWizard;
