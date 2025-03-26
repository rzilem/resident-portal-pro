
import React from 'react';
import { Association } from '@/types/association';
import { 
  GeneralInfoCard, 
  CriticalDatesCard, 
  AssociationStatusCard 
} from './details';

interface AssociationDetailsTabProps {
  association: Association;
}

const mockCriticalDates = {
  insuranceExpiration: '2025-06-15',
  poolPermitExpiration: '2024-05-30',
  elevatorInspection: '2024-08-10',
  fireInspection: '2024-07-22',
  buildingPermit: '2025-03-15',
};

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  const hasPool = association.settings?.hasPool;
  const hasElevator = association.settings?.hasElevator;

  return (
    <div className="mt-4 space-y-4">
      <GeneralInfoCard association={association} />
      
      <CriticalDatesCard 
        criticalDates={mockCriticalDates} 
        hasPool={hasPool} 
        hasElevator={hasElevator} 
      />
      
      <AssociationStatusCard 
        status={association.status} 
        code={association.settings?.code || association.id} 
      />
    </div>
  );
};

export default AssociationDetailsTab;
