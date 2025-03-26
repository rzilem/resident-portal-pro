
import React from 'react';
import { Association } from '@/types/association';
import { Grid } from '@/components/ui/grid';
import { GeneralInfoCard, CriticalDatesCard, AssociationStatusCard, QuickContactCard, AIAnalysisCard } from './details';

interface AssociationDetailsTabProps {
  association: Association;
}

const AssociationDetailsTab: React.FC<AssociationDetailsTabProps> = ({ association }) => {
  return (
    <div className="space-y-6 mt-4">
      <Grid columns={{ sm: 1, md: 2 }} className="gap-4">
        <GeneralInfoCard association={association} />
        <CriticalDatesCard association={association} />
        
        <AssociationStatusCard association={association} />
        <QuickContactCard association={association} />
        
        <AIAnalysisCard associationId={association.id} className="col-span-full md:col-span-1" />
      </Grid>
    </div>
  );
};

export default AssociationDetailsTab;
