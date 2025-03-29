
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import ResidentTableHeader from './ResidentTableHeader';
import ResidentTableRow from './ResidentTableRow';
import ResidentMobileCard from './ResidentMobileCard';
import { ResidentColumn } from '@/pages/Residents';

interface ResidentTableProps {
  columns: ResidentColumn[];
  sortedResidents: any[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
  selectedResidents: number[];
  toggleResidentSelection: (id: number) => void;
  toggleSelectAll: () => void;
}

const ResidentTable: React.FC<ResidentTableProps> = ({
  columns,
  sortedResidents,
  sortField,
  sortDirection,
  handleSort,
  selectedResidents,
  toggleResidentSelection,
  toggleSelectAll,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4 md:hidden">
        {sortedResidents.map((resident, i) => (
          <ResidentMobileCard
            key={i}
            resident={resident}
            columns={columns}
            selectedResidents={selectedResidents}
            toggleResidentSelection={toggleResidentSelection}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <ResidentTableHeader
          columns={columns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          selectedResidents={selectedResidents}
          sortedResidents={sortedResidents}
          toggleSelectAll={toggleSelectAll}
        />
        <TableBody>
          {sortedResidents.map((resident, i) => (
            <ResidentTableRow
              key={i}
              resident={resident}
              columns={columns}
              selectedResidents={selectedResidents}
              toggleResidentSelection={toggleResidentSelection}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResidentTable;
