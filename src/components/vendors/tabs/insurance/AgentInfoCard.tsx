
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';

interface AgentInfoCardProps {
  insurance: VendorInsurance | null | undefined;
}

const AgentInfoCard: React.FC<AgentInfoCardProps> = ({ insurance }) => {
  // Safely access agent properties with null checks
  const agent = insurance?.agent || {};
  const agentName = agent?.name;
  const agentEmail = agent?.email;
  const agentPhone = agent?.phone;

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
          <div className="font-medium">{agentName || 'Not specified'}</div>
          
          <div className="text-muted-foreground">Agent Email:</div>
          <div className="font-medium">
            {agentEmail ? (
              <a 
                href={`mailto:${agentEmail}`} 
                className="text-primary hover:underline flex items-center"
              >
                <Mail className="h-3 w-3 mr-1" />
                {agentEmail}
              </a>
            ) : (
              'Not specified'
            )}
          </div>
          
          <div className="text-muted-foreground">Agent Phone:</div>
          <div className="font-medium">
            {agentPhone ? (
              <a 
                href={`tel:${agentPhone}`} 
                className="text-primary hover:underline flex items-center"
              >
                <Phone className="h-3 w-3 mr-1" />
                {agentPhone}
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
