
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
  Calendar,
  FileText,
  BarChart3,
  PieChart
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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { onboardingService } from '@/services/onboardingService';
import { OnboardingProject, OnboardingStats } from '@/types/onboarding';
import { toast } from 'sonner';
import OnboardingTaskList from '@/components/onboarding/OnboardingTaskList';
import NewProjectDialog from '@/components/onboarding/NewProjectDialog';
import ProjectTimeline from '@/components/onboarding/ProjectTimeline';
import ClientSharingInfo from '@/components/onboarding/ClientSharingInfo';
import TemplateManagement from '@/components/onboarding/TemplateManagement';
import { Skeleton } from '@/components/ui/skeleton';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('tasks');
  const [activeSection, setActiveSection] = useState<'projects' | 'templates'>('projects');
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
        } else {
          // If no project ID, just show the dashboard with all projects
          setProject(null);
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

  // Render the dashboard view when no project is selected
  const renderDashboard = () => {
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

    // Calculate some summary statistics
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const onHoldProjects = projects.filter(p => p.status === 'on_hold').length;
    const onboardingProjects = projects.filter(p => p.processType === 'onboarding').length;
    const offboardingProjects = projects.filter(p => p.processType === 'offboarding').length;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{activeProjects}</div>
                <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {activeProjects === 1 ? '1 association' : `${activeProjects} associations`} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{completedProjects}</div>
                <div className="p-2 bg-green-100 text-green-700 rounded-full">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {completedProjects === 1 ? '1 project' : `${completedProjects} projects`} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">By Process Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Onboarding: {onboardingProjects}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">Offboarding: {offboardingProjects}</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Active Onboarding Projects</CardTitle>
              <Button onClick={() => setShowNewProjectDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <CardDescription>
              Manage and track your community onboarding projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Association</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Process Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleChangeProject(project.id)}>
                    <TableCell className="font-medium">{project.associationName}</TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          project.status === 'active' 
                            ? 'bg-green-500' 
                            : project.status === 'on_hold'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                        }`}></div>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="h-2 w-full max-w-[100px]" />
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.processType === 'onboarding' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {project.processType.charAt(0).toUpperCase() + project.processType.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChangeProject(project.id);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recently Completed Projects */}
        {completedProjects > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Completed</CardTitle>
              <CardDescription>
                Projects that have completed the onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Association</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Process Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects
                    .filter(p => p.status === 'completed')
                    .sort((a, b) => {
                      if (!a.completedDate || !b.completedDate) return 0;
                      return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
                    })
                    .slice(0, 5)
                    .map((project) => (
                      <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleChangeProject(project.id)}>
                        <TableCell className="font-medium">{project.associationName}</TableCell>
                        <TableCell>{project.completedDate ? new Date(project.completedDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.processType === 'onboarding' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {project.processType.charAt(0).toUpperCase() + project.processType.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChangeProject(project.id);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  const renderDetailedProject = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[400px] w-full" />
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
            <Button variant="outline" onClick={() => navigate('/leads/onboarding')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
  
  const renderContent = () => {
    if (activeSection === 'templates') {
      return <TemplateManagement />;
    }
    
    if (projectId && project) {
      return renderDetailedProject();
    } else {
      return renderDashboard();
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Community Onboarding</h1>
          <div className="flex space-x-2">
            <Button 
              variant={activeSection === 'projects' ? 'default' : 'outline'}
              onClick={() => setActiveSection('projects')}
            >
              <Building className="h-4 w-4 mr-2" />
              Projects
            </Button>
            <Button 
              variant={activeSection === 'templates' ? 'default' : 'outline'}
              onClick={() => setActiveSection('templates')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          {activeSection === 'projects' 
            ? 'Manage the onboarding process for new communities and associations'
            : 'Create and manage templates for different types of client onboarding'}
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
