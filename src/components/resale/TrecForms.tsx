
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBadge, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrecForms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">TREC Forms</CardTitle>
            <CardDescription>Manage Texas Real Estate Commission forms for property transactions</CardDescription>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New TREC Form
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileBadge className="h-20 w-20 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">TREC Forms Module</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Access, complete, and manage standardized Texas Real Estate Commission forms
            required for property transactions and resales.
          </p>
          <div className="flex gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New TREC Form
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Form Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrecForms;
