
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { DatabaseColumn } from '../DatabaseColumnsSelector';
import { Homeowner } from '../types';
import HomeownerTableHeader from './HomeownerTableHeader';
import HomeownerTableRow from './HomeownerTableRow';

interface HomeownerTableProps {
  columns: DatabaseColumn[];
  homeowners: Homeowner[];
  sortColumn: keyof Homeowner;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof Homeowner) => void;
  getStatusVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
}

const HomeownerTable: React.FC<HomeownerTableProps> = ({
  columns,
  homeowners,
  sortColumn,
  sortDirection,
  handleSort,
  getStatusVariant,
}) => {
  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <HomeownerTableHeader 
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
        <TableBody>
          {homeowners.length > 0 ? (
            homeowners.map((homeowner) => (
              <HomeownerTableRow 
                key={homeowner.id}
                homeowner={homeowner}
                columns={columns}
                getStatusVariant={getStatusVariant}
              />
            ))
          ) : (
            <tr>
              <td colSpan={columns.filter(col => col.checked).length} className="h-24 text-center">
                No records found.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HomeownerTable;
