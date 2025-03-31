
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyInspection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Property Inspections</CardTitle>
            <CardDescription>Schedule and manage property inspections for resale transactions</CardDescription>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Inspection
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileSearch className="h-20 w-20 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Property Inspection Module</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Schedule, manage, and document property inspections required for resale transactions.
            Track inspection status and generate inspection reports.
          </p>
          <div className="flex gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Inspection
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              View Inspection Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyInspection;
