
import React from 'react';
import { Association } from '@/types/association';
import { Grid } from '@/components/ui/grid';
import { GeneralInfoCard, CriticalDatesCard, AssociationStatusCard, QuickContactCard, AIAnalysisCard } from './details';

interface AssociationDetailsTabProps {
  association: Association;
}

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  // Ensure address exists to prevent "Cannot read properties of undefined" errors
  const address = association?.address || { street: '', city: '', state: '', zipCode: '', country: '' };
  
  // Create fullAddress string for QuickContactCard
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  
  // Extract properties needed for CriticalDatesCard from association
  const mockCriticalDates = {
    insuranceExpiration: '2024-12-30',
    poolPermitExpiration: '2024-05-30',
    elevatorInspection: '2024-08-10',
    fireInspection: '2024-07-22',
    buildingPermit: '2024-10-15',
  };
  
  const hasPool = association?.settings?.hasPool;
  const hasElevator = association?.settings?.hasElevator;
  
  return (
    <div className="space-y-6 mt-4">
      <Grid columns={{ sm: 1, md: 2 }} className="gap-4">
        <GeneralInfoCard association={association} />
        <CriticalDatesCard 
          criticalDates={mockCriticalDates}
          hasPool={hasPool}
          hasElevator={hasElevator}
        />
        
        <AssociationStatusCard 
          status={association.status} 
          code={association.settings?.code}
        />
        <QuickContactCard 
          association={association} 
          fullAddress={fullAddress}
        />
        
        <AIAnalysisCard associationId={association.id} className="col-span-full md:col-span-1" />
      </Grid>
    </div>
  );
};

export default AssociationDetailsTab;
