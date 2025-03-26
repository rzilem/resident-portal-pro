
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Association } from '@/types/association';

interface AssociationDocumentsTabProps {
  association: Association;
}

const AssociationDocumentsTab: React.FC<AssociationDocumentsTabProps> = ({ association }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Association Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Document Management</h3>
            <p className="text-muted-foreground mb-4">
              Access governing documents, meeting minutes, and other important files
            </p>
            <Button variant="outline" onClick={() => navigate('/documents/AssociationDocuments')}>
              View All Documents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationDocumentsTab;
