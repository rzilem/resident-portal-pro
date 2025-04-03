
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Stepper, Step } from '@/components/ui/stepper';
import { Check, ArrowLeft, ArrowRight, Save, Clock, Plus, FileText } from 'lucide-react';
import NewProjectDialog from '@/components/onboarding/NewProjectDialog';
import OnboardingTaskList from '@/components/onboarding/OnboardingTaskList';
import ClientSharingInfo from '@/components/onboarding/ClientSharingInfo';
import ProjectTimeline from '@/components/onboarding/ProjectTimeline';
import TemplateManagement from '@/components/onboarding/TemplateManagement';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/onboarding';

const OnboardingWizard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false); // Changed to false by default
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Steps for the wizard
  const steps = [
    { id: 'basics', label: 'Project Details' },
    { id: 'tasks', label: 'Task Management' },
    { id: 'timeline', label: 'Project Timeline' },
    { id: 'templates', label: 'Templates' },
    { id: 'sharing', label: 'Client Sharing' }
  ];

  useEffect(() => {
    if (projectId) {
      // Fetch project data
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setProject({
          id,
          name: 'Demo Association Onboarding',
          associationName: 'Lakeside HOA',
          address: '123 Main St, Austin, TX',
          contactName: 'John Smith',
          contactEmail: 'john@example.com',
          contactPhone: '(512) 555-1234',
          startDate: new Date().toISOString(),
          estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          notes: 'New association onboarding project',
          tasks: [],
          documents: []
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project data',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleCreateProject = (newProject: Partial<Project>) => {
    // Simulate creating a new project
    const createdProject = {
      id: Math.random().toString(36).substring(2, 9),
      name: newProject.name || 'New Onboarding Project',
      associationName: newProject.associationName || 'Unnamed Association',
      address: newProject.address || '',
      contactName: newProject.contactName || '',
      contactEmail: newProject.contactEmail || '',
      contactPhone: newProject.contactPhone || '',
      startDate: new Date().toISOString(),
      estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      notes: newProject.notes || '',
      tasks: [],
      documents: []
    };
    
    setProject(createdProject as Project);
    setShowNewProjectDialog(false);
    
    // Update URL with new project ID
    navigate(`/leads/onboarding/${createdProject.id}`, { replace: true });
    
    toast({
      title: 'Project Created',
      description: `Successfully created '${createdProject.name}'`
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: 'Onboarding Complete',
      description: 'Project has been successfully set up'
    });
    navigate('/leads');
  };

  const handleSaveProgress = () => {
    toast({
      title: 'Progress Saved',
      description: 'Your changes have been saved'
    });
  };

  // Render current step content
  const renderStepContent = () => {
    if (!project) return null;
    
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Association Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {project.associationName}</p>
                  <p><span className="font-medium">Address:</span> {project.address}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {project.contactName}</p>
                  <p><span className="font-medium">Email:</span> {project.contactEmail}</p>
                  <p><span className="font-medium">Phone:</span> {project.contactPhone}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Project Notes</h3>
              <p className="border p-2 rounded-md min-h-[80px] bg-muted/50">{project.notes || 'No notes added'}</p>
            </div>
          </div>
        );
      case 1:
        return <OnboardingTaskList project={project} />;
      case 2:
        return <ProjectTimeline project={project} />;
      case 3:
        return <TemplateManagement project={project} />;
      case 4:
        return <ClientSharingInfo project={project} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex animate-pulse flex-col space-y-4">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If no project is selected, display a landing page
  if (!project && !projectId) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Association Onboarding</h1>
          <p className="text-muted-foreground">
            Create and manage onboarding processes for new associations
          </p>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Onboarding Dashboard</CardTitle>
            <CardDescription>
              Guide associations through the onboarding process with structured tasks and timelines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-sm text-muted-foreground">Associations in onboarding</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-sm text-muted-foreground">Available templates</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Finished onboardings</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recent Onboarding Projects</h3>
                <TooltipButton
                  tooltipText="Start onboarding a new association"
                  onClick={() => setShowNewProjectDialog(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </TooltipButton>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: '1', name: 'Sunset Valley HOA', status: 'active', progress: 65, startDate: '2023-03-15' },
                  { id: '2', name: 'Oakridge Condominiums', status: 'active', progress: 30, startDate: '2023-03-22' },
                  { id: '3', name: 'Riverfront Estates', status: 'active', progress: 80, startDate: '2023-03-10' }
                ].map(item => (
                  <div 
                    key={item.id}
                    className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/leads/onboarding/${item.id}`)}
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Started: {new Date(item.startDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.progress}% Complete</span>
                        <div className="w-32 h-2 bg-muted rounded-full mt-1">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <TooltipButton
                        tooltipText="View this onboarding project"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/leads/onboarding/${item.id}`);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </TooltipButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex justify-between w-full text-sm">
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <TooltipButton
                tooltipText="View all onboarding projects"
                variant="outline"
                size="sm"
                className="gap-1"
              >
                View All Projects
              </TooltipButton>
            </div>
          </CardFooter>
        </Card>
        
        <NewProjectDialog 
          open={showNewProjectDialog} 
          onClose={() => setShowNewProjectDialog(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">
          {project ? `Onboarding: ${project.associationName}` : 'New Onboarding Project'}
        </h1>
        <p className="text-muted-foreground">
          Guide new associations through the onboarding process
        </p>
      </div>
      
      <NewProjectDialog 
        open={showNewProjectDialog} 
        onClose={() => setShowNewProjectDialog(false)}
        onSubmit={handleCreateProject}
      />
      
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Association Onboarding</CardTitle>
          <CardDescription>
            Follow the steps below to complete the onboarding process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper currentStep={currentStep}>
            {steps.map((step, index) => (
              <Step 
                key={step.id} 
                label={step.label} 
                completed={currentStep > index}
                active={currentStep === index}
              />
            ))}
          </Stepper>
          
          <div className="mt-8">
            {renderStepContent()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <TooltipButton 
                tooltipText="Go back to previous step"
                variant="outline" 
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </TooltipButton>
            )}
          </div>
          
          <div className="flex gap-2">
            <TooltipButton 
              tooltipText="Cancel and return to leads"
              variant="outline" 
              onClick={() => navigate('/leads')}
            >
              Cancel
            </TooltipButton>
            
            <TooltipButton 
              tooltipText="Save your current progress"
              variant="outline" 
              onClick={handleSaveProgress}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Progress
            </TooltipButton>
            
            {currentStep < steps.length - 1 ? (
              <TooltipButton 
                tooltipText="Proceed to next step"
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </TooltipButton>
            ) : (
              <TooltipButton 
                tooltipText="Complete the onboarding process"
                onClick={handleFinish}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Complete Onboarding
              </TooltipButton>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
