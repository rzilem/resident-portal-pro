
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { VendorColumn } from './VendorColumnsSelector';
import { Vendor } from '@/types/vendor';
import VendorRating from './VendorRating';

interface VendorTableProps {
  vendors: Vendor[];
  columns: VendorColumn[];
}

const VendorTable = ({ vendors, columns }: VendorTableProps) => {
  const navigate = useNavigate();
  const visibleColumns = columns.filter(col => col.checked);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleRowClick = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.map((column) => (
            <TableHead key={column.id}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor) => (
          <TableRow 
            key={vendor.id}
            onClick={() => handleRowClick(vendor.id)}
            className="cursor-pointer hover:bg-muted/50"
          >
            {visibleColumns.map((column) => (
              <TableCell key={`${vendor.id}-${column.id}`}>
                {column.id === 'name' && vendor.name}
                {column.id === 'contactName' && vendor.contactName}
                {column.id === 'email' && vendor.email}
                {column.id === 'phone' && vendor.phone}
                {column.id === 'category' && vendor.category}
                {column.id === 'status' && (
                  <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                    {vendor.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                )}
                {column.id === 'paymentTerms' && vendor.paymentTerms}
                {column.id === 'paymentMethod' && vendor.paymentMethod}
                {column.id === 'lastInvoiceDate' && formatDate(vendor.lastInvoiceDate)}
                {column.id === 'rating' && <VendorRating rating={vendor.rating || 0} />}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VendorTable;
