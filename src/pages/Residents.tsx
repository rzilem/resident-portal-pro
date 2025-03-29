
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResidentStats from '@/components/residents/ResidentStats';
import ResidentSearch from '@/components/residents/ResidentSearch';
import ResidentTable from '@/components/residents/ResidentTable';
import BulkActionBar from '@/components/residents/BulkActionBar';
import { useResidents } from '@/components/residents/useResidents';

// Column type definition for resident data
export type ResidentColumn = {
  id: string;
  label: string;
  checked: boolean;
};

const Residents = () => {
  const {
    columns,
    handleColumnToggle,
    sortField,
    sortDirection,
    handleSort,
    searchTerm,
    setSearchTerm,
    selectedResidents,
    toggleResidentSelection,
    toggleSelectAll,
    sortedResidents,
    handleBulkEmail,
    handleBulkExport,
    handleBulkTag,
    handleBulkDelete
  } = useResidents();

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Residents Management</h2>
          <p className="text-muted-foreground">View and manage all residents in your communities</p>
        </section>
        
        <ResidentStats />
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Resident Directory</CardTitle>
            <CardDescription>
              Search and manage all residents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResidentSearch 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
            />
            
            <BulkActionBar 
              selectedResidents={selectedResidents}
              handleBulkEmail={handleBulkEmail}
              handleBulkExport={handleBulkExport}
              handleBulkTag={handleBulkTag}
              handleBulkDelete={handleBulkDelete}
            />
            
            <ResidentTable 
              columns={columns}
              sortedResidents={sortedResidents}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              selectedResidents={selectedResidents}
              toggleResidentSelection={toggleResidentSelection}
              toggleSelectAll={toggleSelectAll}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Residents;
