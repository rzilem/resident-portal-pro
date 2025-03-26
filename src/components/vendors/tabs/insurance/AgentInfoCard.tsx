
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Phone } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';

interface AgentInfoCardProps {
  insurance: VendorInsurance;
}

export const AgentInfoCard: React.FC<AgentInfoCardProps> = ({ insurance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Agent Information</CardTitle>
      </CardHeader>
      <CardContent>
        {!insurance.agent?.name && !insurance.agent?.email && !insurance.agent?.phone ? (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground text-center">No agent information has been added.</p>
            <Button variant="outline" className="mt-4">Add Agent Details</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Agent Name</p>
                <p className="text-sm text-muted-foreground">{insurance.agent?.name || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{insurance.agent?.email || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{insurance.agent?.phone || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
