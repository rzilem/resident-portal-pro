
import React from 'react';
import { Shield, AlertTriangle, Droplet, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/formatters';

interface CriticalDatesCardProps {
  criticalDates: {
    insuranceExpiration: string;
    poolPermitExpiration: string;
    elevatorInspection: string;
    fireInspection: string;
    buildingPermit: string; // Keeping in the interface for backward compatibility
  };
  hasPool: boolean | undefined;
  hasElevator: boolean | undefined;
}

const CriticalDatesCard: React.FC<CriticalDatesCardProps> = ({
  criticalDates,
  hasPool,
  hasElevator
}) => {
  // Create an array of dates to display based on conditions
  const datesToDisplay = [{
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    label: "Insurance Expiration",
    date: criticalDates.insuranceExpiration,
    condition: true // Always show
  }, {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    label: "Fire Inspection Due",
    date: criticalDates.fireInspection,
    condition: true // Always show
  }, {
    icon: <Droplet className="h-5 w-5 text-cyan-500" />,
    label: "Pool Permit Expiration",
    date: criticalDates.poolPermitExpiration,
    condition: hasPool === true
  }, {
    icon: <ArrowUpDown className="h-5 w-5 text-violet-500" />,
    label: "Elevator Inspection Due",
    date: criticalDates.elevatorInspection,
    condition: hasElevator === true
  }].filter(item => item.condition);

  // Determine grid columns based on number of items
  const getGridClass = () => {
    const count = datesToDisplay.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };

  return <Card>
      <CardHeader>
        <CardTitle>Critical Dates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`grid ${getGridClass()} gap-4`}>
            {datesToDisplay.map((item, index) => <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <div className="text-muted-foreground text-sm mb-1">{item.label}</div>
                </div>
                <div className="font-medium mt-1">
                  {formatDate(item.date)}
                </div>
              </div>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default CriticalDatesCard;
