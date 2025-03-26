
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HomeownerFilters from './homeowners/HomeownerFilters';
import HomeownerTable from './homeowners/HomeownerTable';
import { useHomeowners } from './homeowners/useHomeowners';

const AssociationRecords = () => {
  const {
    homeowners,
    originalCount,
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    columns,
    handleColumnsChange,
    handleSort,
    getStatusVariant,
  } = useHomeowners();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Association Records</CardTitle>
        <CardDescription>
          View and manage all homeowner records within the association
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HomeownerFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          columns={columns}
          handleColumnsChange={handleColumnsChange}
        />
        
        <HomeownerTable
          columns={columns}
          homeowners={homeowners}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          getStatusVariant={getStatusVariant}
        />
        
        <div className="text-xs text-muted-foreground mt-4">
          Showing {homeowners.length} of {originalCount} homeowners
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationRecords;
