
import React from 'react';
import { Association } from '@/types/association';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe } from 'lucide-react';

interface AssociationDetailsTabProps {
  association: Association;
}

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Association Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{association.contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{association.contactInfo.phone}</span>
              </div>
              {association.contactInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={association.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {association.contactInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Association Type</h3>
            <Badge variant="outline" className="capitalize">
              {association.type}
            </Badge>
          </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Board Information</CardTitle>
        </CardHeader>
        <CardContent>
          {association.settings?.board ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Term Length:</span>
                <span className="font-medium">{association.settings.board.termLength} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maximum Members:</span>
                <span className="font-medium">{association.settings.board.maximumMembers}</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No board information available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationDetailsTab;
