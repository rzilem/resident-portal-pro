
import React from 'react';
import { Association } from '@/types/association';
import { GeneralInfoCard, AIAnalysisCard } from './details';

interface AssociationDetailsTabProps {
  association: Association;
}

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  return (
    <div className="mt-4 space-y-4">
      <AIAnalysisCard association={association} />
      <GeneralInfoCard association={association} />
    </div>
  );
};

export default AssociationDetailsTab;
