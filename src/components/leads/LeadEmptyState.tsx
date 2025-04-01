
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadTableFilters } from './types';

interface LeadEmptyStateProps {
  filters: LeadTableFilters;
}

const LeadEmptyState: React.FC<LeadEmptyStateProps> = ({ filters }) => {
  return (
    <Card className="p-8 flex flex-col items-center justify-center">
      <p className="text-muted-foreground mb-4">
        {filters.search || filters.statusFilter !== 'all'
          ? 'No leads match your search criteria'
          : 'No leads found'}
      </p>
      <Button>
        Add Your First Lead
      </Button>
    </Card>
  );
};

export default LeadEmptyState;
