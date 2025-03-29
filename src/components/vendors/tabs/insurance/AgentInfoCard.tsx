
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';

interface AgentInfoCardProps {
  insurance: VendorInsurance;
}

const AgentInfoCard: React.FC<AgentInfoCardProps> = ({ insurance }) => {
  const agent = insurance.agent;
  
  if (!agent || !agent.name) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <User className="h-4 w-4 mr-2" />
            Agent Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground">No agent information available</p>
        </CardContent>
      </Card>
    );
  }

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
          <div className="text-muted-foreground">Name:</div>
          <div className="font-medium">{agent.name}</div>
          
          {agent.phone && (
            <>
              <div className="text-muted-foreground">Phone:</div>
              <div className="font-medium">{agent.phone}</div>
            </>
          )}
          
          {agent.email && (
            <>
              <div className="text-muted-foreground">Email:</div>
              <div className="font-medium">{agent.email}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentInfoCard;
