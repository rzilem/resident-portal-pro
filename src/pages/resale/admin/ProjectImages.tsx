
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectImagesManager from '../wizard/components/admin/ProjectImagesManager';

const ProjectImagesPage = () => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Project Images</h1>
        <p className="text-muted-foreground">
          Manage images used in project bid requests
        </p>
      </div>
      
      <ProjectImagesManager />
    </div>
  );
};

export default ProjectImagesPage;
