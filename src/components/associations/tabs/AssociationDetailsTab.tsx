
import React from 'react';
import { Association } from '@/types/association';
import { GeneralInfoCard } from './details';

interface AssociationDetailsTabProps {
  association: Association;
}

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  return (
    <div className="mt-4 space-y-4">
      <GeneralInfoCard association={association} />
    </div>
  );
};

export default AssociationDetailsTab;
