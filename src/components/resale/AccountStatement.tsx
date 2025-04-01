
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { FileText, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountStatement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Account Statements</CardTitle>
            <CardDescription>Generate and manage account statements for property closings</CardDescription>
          </div>
          <TooltipButton 
            tooltipText="Generate a new account statement"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Statement
          </TooltipButton>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-20 w-20 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Account Statement Module</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Generate account statements showing assessments, dues, and fees for property closings.
            Create, manage, and distribute statements to owners and title companies.
          </p>
          <div className="flex gap-3">
            <TooltipButton 
              tooltipText="Generate a new account statement"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Statement
            </TooltipButton>
            <TooltipButton 
              tooltipText="Download statement templates"
              variant="outline" 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Templates
            </TooltipButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountStatement;
