
import React from 'react';
import { Shield, AlertTriangle, Droplet, ArrowUpDown, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/formatters';

interface CriticalDatesCardProps {
  criticalDates: {
    insuranceExpiration: string;
    poolPermitExpiration: string;
    elevatorInspection: string;
    fireInspection: string;
    buildingPermit: string;
  };
  hasPool: boolean | undefined;
  hasElevator: boolean | undefined;
}

const CriticalDatesCard: React.FC<CriticalDatesCardProps> = ({ 
  criticalDates, 
  hasPool, 
  hasElevator 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Dates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <div className="text-muted-foreground text-sm mb-1">Insurance Expiration</div>
              </div>
              <div className="font-medium mt-1">
                {formatDate(criticalDates.insuranceExpiration)}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div className="text-muted-foreground text-sm mb-1">Fire Inspection Due</div>
              </div>
              <div className="font-medium mt-1">
                {formatDate(criticalDates.fireInspection)}
              </div>
            </div>
            
            {hasPool && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-cyan-500" />
                  <div className="text-muted-foreground text-sm mb-1">Pool Permit Expiration</div>
                </div>
                <div className="font-medium mt-1">
                  {formatDate(criticalDates.poolPermitExpiration)}
                </div>
              </div>
            )}
            
            {hasElevator && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-violet-500" />
                  <div className="text-muted-foreground text-sm mb-1">Elevator Inspection Due</div>
                </div>
                <div className="font-medium mt-1">
                  {formatDate(criticalDates.elevatorInspection)}
                </div>
              </div>
            )}
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-green-500" />
                <div className="text-muted-foreground text-sm mb-1">Building Permit Expiration</div>
              </div>
              <div className="font-medium mt-1">
                {formatDate(criticalDates.buildingPermit)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalDatesCard;
