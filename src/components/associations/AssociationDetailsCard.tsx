
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Association } from '@/types/association';

interface AssociationDetailsCardProps {
  association: Association;
}

const AssociationDetailsCard: React.FC<AssociationDetailsCardProps> = ({ association }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Association Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type:</span>
          <Badge variant="outline" className="capitalize">
            {association.type}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={association.status === 'active' ? 'secondary' : 'outline'}>
            {association.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        {association.managementCompanyId && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Management ID:</span>
            <span>{association.managementCompanyId}</span>
          </div>
        )}
        
        {association.tags && association.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {association.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="bg-muted">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationDetailsCard;
