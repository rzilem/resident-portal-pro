
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';

interface AgentInfoCardProps {
  insurance: VendorInsurance | null | undefined;
}

const AgentInfoCard: React.FC<AgentInfoCardProps> = ({ insurance }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <User className="h-4 w-4 mr-2" />
          Agent Information
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Agent Name:</div>
          <div className="font-medium">{insurance?.agent?.name || 'Not specified'}</div>
          
          <div className="text-muted-foreground">Agent Email:</div>
          <div className="font-medium">
            {insurance?.agent?.email ? (
              <a 
                href={`mailto:${insurance.agent.email}`} 
                className="text-primary hover:underline"
              >
                <Mail className="h-3 w-3 inline mr-1" />
                {insurance.agent.email}
              </a>
            ) : (
              'Not specified'
            )}
          </div>
          
          <div className="text-muted-foreground">Agent Phone:</div>
          <div className="font-medium">
            {insurance?.agent?.phone ? (
              <a 
                href={`tel:${insurance.agent.phone}`} 
                className="text-primary hover:underline"
              >
                <Phone className="h-3 w-3 inline mr-1" />
                {insurance.agent.phone}
              </a>
            ) : (
              'Not specified'
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentInfoCard;
