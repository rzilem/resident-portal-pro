
import React from 'react';
import { Users, CalendarDays, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Association } from '@/types/association';

interface AssociationStatsProps {
  association: Association;
}

const AssociationStats: React.FC<AssociationStatsProps> = ({ association }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4 inline mr-1" /> Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{association.units}</div>
          <p className="text-muted-foreground">Total residential units</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <CalendarDays className="h-4 w-4 inline mr-1" /> Founded
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium">
            {new Date(association.foundedDate).toLocaleDateString()}
          </div>
          <p className="text-muted-foreground">
            {new Date().getFullYear() - new Date(association.foundedDate).getFullYear()} years ago
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4 inline mr-1" /> {association.settings?.feesFrequency || 'Monthly'} Fee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium">
            {association.settings?.currencySymbol || '$'}{association.settings?.annualFees ? 
              (Number(association.settings.annualFees) / (association.settings?.feesFrequency === 'quarterly' ? 4 : 
                                                         association.settings?.feesFrequency === 'annually' ? 1 : 12)).toFixed(2) : 
              'N/A'}
          </div>
          <p className="text-muted-foreground">Per unit average</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationStats;
