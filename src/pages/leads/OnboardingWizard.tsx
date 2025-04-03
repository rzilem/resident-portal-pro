
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOnboardingProjects } from '@/hooks/use-onboarding-projects';
import OnboardingDashboard from '@/components/onboarding/OnboardingDashboard';
import NewProjectDialog from '@/components/onboarding/NewProjectDialog';
import ProjectDetails from '@/components/onboarding/ProjectDetails';
import { ProjectFormData } from '@/components/onboarding/NewProjectDialog';

const OnboardingWizard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    projects,
    templates,
    isLoading,
    isCreating,
    getProjectById,
    createProject,
    updateTaskStatus,
    deleteProject
  } = useOnboardingProjects();
  
  // Generate shareable link
  const shareableLink = projectId 
    ? `https://app.hoamanagement.com/client/onboarding/${projectId}` 
    : '';
  
  // If projectId is provided, find the project
  const currentProject = projectId ? getProjectById(projectId) : undefined;
  
  const handleCreateProject = async (formData: ProjectFormData) => {
    try {
      await createProject(formData);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error in handleCreateProject:', error);
      // Error is already handled in the hook
    }
  };
  
  const handleUpdateTaskStatus = (
    taskGroupId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  ) => {
    if (projectId) {
      updateTaskStatus(projectId, taskGroupId, taskId, status);
    }
  };
  
  const handleDeleteProject = async () => {
    if (projectId) {
      return deleteProject(projectId);
    }
    return Promise.reject(new Error('No project ID provided'));
  };
  
  // Determine what to render based on if we have a projectId
  const renderContent = () => {
    if (projectId) {
      // Project details view
      return (
        <ProjectDetails
          project={currentProject!}
          shareableLink={shareableLink}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteProject={handleDeleteProject}
          isLoading={isLoading || !currentProject}
        />
      );
    } else {
      // Dashboard view
      return (
        <>
          <OnboardingDashboard 
            projects={projects}
            isLoading={isLoading}
            onCreateProject={() => setDialogOpen(true)}
          />
          <NewProjectDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            templates={templates}
            onCreateProject={handleCreateProject}
            isCreating={isCreating}
          />
        </>
      );
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      {renderContent()}
    </div>
  );
};

export default OnboardingWizard;
