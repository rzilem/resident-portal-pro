
import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSettings } from '@/hooks/use-settings';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { LeadColumn } from './LeadColumnsSelector';
import LeadStatusBadge from './LeadStatusBadge';
import LeadBooleanBadge from './LeadBooleanBadge';
import LeadTableToolbar from './LeadTableToolbar';
import LeadEmptyState from './LeadEmptyState';
import LeadRowActions from './LeadRowActions';
import LeadsTableLoading from './LeadsTableLoading';
import LeadErrorAlert from './LeadErrorAlert';
import { useLeadsData } from './useLeadsData';
import { LeadTableFilters } from './types';

const LeadsTable: React.FC = () => {
  const [filters, setFilters] = useState<LeadTableFilters>({
    search: '',
    statusFilter: 'all',
  });
  
  const { preferences, updatePreference } = useSettings();
  const { settings } = useCompanySettings();
  const { leads, isLoading, error, filterLeads, refetch } = useLeadsData();
  
  const defaultColumns: LeadColumn[] = [
    { id: 'name', label: 'Name', checked: true },
    { id: 'email', label: 'Email', checked: true },
    { id: 'company', label: settings.companyName || 'Association', checked: true },
    { id: 'phone', label: 'Phone', checked: false },
    { id: 'status', label: 'Status', checked: true },
    { id: 'association_name', label: 'Association', checked: true },
    { id: 'association_type', label: 'Type', checked: false },
    { id: 'unit_count', label: 'Units', checked: false },
    { id: 'city', label: 'City', checked: false },
    { id: 'state', label: 'State', checked: false },
    { id: 'has_pool', label: 'Pool', checked: false },
    { id: 'has_gate', label: 'Gate', checked: false },
    { id: 'has_onsite_management', label: 'Onsite Mgmt', checked: false },
    { id: 'lastContacted', label: 'Last Contacted', checked: true },
    { id: 'source', label: 'Source', checked: false },
  ];
  
  const [columns, setColumns] = useState<LeadColumn[]>(defaultColumns);
  
  useEffect(() => {
    const savedColumns = preferences?.leadTableColumns as LeadColumn[] | undefined;
    if (savedColumns && savedColumns.length > 0) {
      setColumns(savedColumns);
    }
  }, [preferences]);

  // Filter leads based on search and status filter
  const filteredLeads = filterLeads(leads, filters);
  
  const handleFilterChange = (newFilters: Partial<LeadTableFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleColumnsChange = (newColumns: LeadColumn[]) => {
    setColumns(newColumns);
    updatePreference('leadTableColumns', newColumns);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LeadTableToolbar 
          filters={filters}
          onFilterChange={handleFilterChange}
          columns={columns}
          onColumnsChange={handleColumnsChange}
          onRefresh={handleRefresh}
        />
        <LeadsTableLoading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <LeadTableToolbar 
          filters={filters}
          onFilterChange={handleFilterChange}
          columns={columns}
          onColumnsChange={handleColumnsChange}
          onRefresh={handleRefresh}
        />
        <LeadErrorAlert 
          message={error.message}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <LeadTableToolbar 
        filters={filters}
        onFilterChange={handleFilterChange}
        columns={columns}
        onColumnsChange={handleColumnsChange}
        onRefresh={handleRefresh}
      />
      
      {filteredLeads.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.filter(col => col.checked).map(column => (
                  <TableHead key={column.id}>
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  {columns.find(c => c.id === 'name')?.checked && (
                    <TableCell className="font-medium">{lead.name}</TableCell>
                  )}
                  {columns.find(c => c.id === 'email')?.checked && (
                    <TableCell>{lead.email}</TableCell>
                  )}
                  {columns.find(c => c.id === 'company')?.checked && (
                    <TableCell>{lead.company || lead.association_name || settings.companyName || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'phone')?.checked && (
                    <TableCell>{lead.phone || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'status')?.checked && (
                    <TableCell>
                      <LeadStatusBadge status={lead.status} />
                    </TableCell>
                  )}
                  {columns.find(c => c.id === 'association_name')?.checked && (
                    <TableCell>{lead.association_name || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'association_type')?.checked && (
                    <TableCell>{lead.association_type || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'unit_count')?.checked && (
                    <TableCell>{lead.unit_count || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'city')?.checked && (
                    <TableCell>{lead.city || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'state')?.checked && (
                    <TableCell>{lead.state || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'has_pool')?.checked && (
                    <TableCell>
                      <LeadBooleanBadge value={lead.has_pool} />
                    </TableCell>
                  )}
                  {columns.find(c => c.id === 'has_gate')?.checked && (
                    <TableCell>
                      <LeadBooleanBadge value={lead.has_gate} />
                    </TableCell>
                  )}
                  {columns.find(c => c.id === 'has_onsite_management')?.checked && (
                    <TableCell>
                      <LeadBooleanBadge value={lead.has_onsite_management} />
                    </TableCell>
                  )}
                  {columns.find(c => c.id === 'lastContacted')?.checked && (
                    <TableCell>
                      {lead.lastContactedAt 
                        ? new Date(lead.lastContactedAt).toLocaleDateString() 
                        : 'Never'}
                    </TableCell>
                  )}
                  {columns.find(c => c.id === 'source')?.checked && (
                    <TableCell>{lead.source || '-'}</TableCell>
                  )}
                  <TableCell className="text-right">
                    <LeadRowActions lead={lead} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <LeadEmptyState filters={filters} />
      )}
    </div>
  );
};

export default LeadsTable;
