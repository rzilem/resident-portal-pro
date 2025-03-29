
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { PROJECT_TYPES, PROJECT_QUESTIONS } from '../wizard/bid-request-data';
import StatusBadge from './StatusBadge';
import { ProjectInfoProps } from './types';

const ProjectInfo: React.FC<ProjectInfoProps> = ({ bidRequest }) => {
  const getProjectTypeName = (typeId: string) => {
    const projectType = PROJECT_TYPES.find(type => type.id === typeId);
    return projectType?.name || typeId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{getProjectTypeName(bidRequest.project_type)}</CardTitle>
            <CardDescription>
              Created on {format(new Date(bidRequest.created_at), 'MMMM d, yyyy')}
            </CardDescription>
          </div>
          <StatusBadge status={bidRequest.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bidRequest.due_date && (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Due by {format(new Date(bidRequest.due_date), 'MMMM d, yyyy')}</span>
          </div>
        )}
        
        {bidRequest.answers && Object.keys(bidRequest.answers).length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Details</h3>
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                {Object.entries(bidRequest.answers).map(([questionId, answer]) => {
                  // Find the question by ID across all project types
                  let question = null;
                  const questions = PROJECT_QUESTIONS[bidRequest.project_type] || [];
                  for (const q of questions) {
                    if (q.id === questionId) {
                      question = q;
                      break;
                    }
                  }
                  
                  return (
                    <div key={questionId} className="mb-3">
                      <p className="font-medium">{question?.text || questionId}</p>
                      <p>{typeof answer === 'object' ? JSON.stringify(answer) : answer?.toString()}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
        
        {bidRequest.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</h3>
            <div className="p-4 bg-muted/40 rounded-md">
              <p className="whitespace-pre-line">{bidRequest.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
