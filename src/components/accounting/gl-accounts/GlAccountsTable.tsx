
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { GLAccount } from '@/types/accounting';

interface GlAccountsTableProps {
  accounts: GLAccount[];
  onEditAccount: (account: GLAccount) => void;
  onDeleteAccount: (id: string) => void;
}

type SortField = 'code' | 'name' | 'type' | 'category';
type SortDirection = 'asc' | 'desc';

const GlAccountsTable: React.FC<GlAccountsTableProps> = ({
  accounts,
  onEditAccount,
  onDeleteAccount
}) => {
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    // Determine how to sort based on field type
    if (sortField === 'code') {
      // Handle numeric sorting for codes
      const codeA = parseInt(a.code.replace(/\D/g, '')) || 0;
      const codeB = parseInt(b.code.replace(/\D/g, '')) || 0;
      return sortDirection === 'asc' ? codeA - codeB : codeB - codeA;
    } else {
      // Handle alphabetical sorting for other fields
      const valueA = a[sortField].toLowerCase();
      const valueB = b[sortField].toLowerCase();
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center gap-1">
                Code
                <SortIcon field="code" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Description
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center gap-1">
                GL Type
                <SortIcon field="type" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center gap-1">
                Category
                <SortIcon field="category" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAccounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No accounts match your search criteria
              </TableCell>
            </TableRow>
          ) : (
            sortedAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>{account.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEditAccount(account)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteAccount(account.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GlAccountsTable;
