
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileQuestion, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CondoQuestionnaire: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Condo Questionnaires</CardTitle>
            <CardDescription>Manage questionnaires for lenders and property transactions</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => navigate('/resale/wizard')}>
            <Plus className="h-4 w-4" />
            New Questionnaire
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileQuestion className="h-20 w-20 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Condo Questionnaire Module</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Create, process, and manage condo questionnaires for lenders and buyers.
            Submit, track, and download completed questionnaires.
          </p>
          <div className="flex gap-3">
            <Button className="gap-2" onClick={() => navigate('/resale/wizard')}>
              <Plus className="h-4 w-4" />
              New Questionnaire
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              View Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CondoQuestionnaire;
