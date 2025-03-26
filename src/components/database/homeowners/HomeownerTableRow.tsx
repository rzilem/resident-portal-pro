
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { DatabaseColumn } from '../DatabaseColumnsSelector';
import { Homeowner } from '../types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface HomeownerTableRowProps {
  homeowner: Homeowner;
  columns: DatabaseColumn[];
  getStatusVariant: (status: string) => string;
}

const HomeownerTableRow: React.FC<HomeownerTableRowProps> = ({
  homeowner,
  columns,
  getStatusVariant,
}) => {
  return (
    <TableRow key={homeowner.id}>
      {columns.map(col => col.checked && (
        <TableCell key={col.id}>
          {col.id === 'id' ? (
            <span className="font-mono">{homeowner.id}</span>
          ) : col.id === 'fullName' ? (
            <Link 
              to={`/residents/${homeowner.id}`} 
              className="text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {homeowner.fullName}
            </Link>
          ) : col.id === 'property' ? (
            <Link 
              to={`/properties?filter=${encodeURIComponent(homeowner.property)}`}
              className="hover:underline hover:text-primary/80 transition-colors"
            >
              {homeowner.property}
            </Link>
          ) : col.id === 'contact' ? (
            <div className="flex flex-col">
              <a 
                href={`mailto:${homeowner.email}`}
                className="text-sm hover:underline hover:text-primary/80 transition-colors"
              >
                {homeowner.email}
              </a>
              <span className="text-xs text-muted-foreground">{homeowner.phone}</span>
            </div>
          ) : col.id === 'status' ? (
            <Badge variant={getStatusVariant(homeowner.status)}>
              {homeowner.status}
            </Badge>
          ) : col.id === 'moveInDate' ? (
            <div className="flex flex-col">
              <span>{homeowner.moveInDate}</span>
              {homeowner.moveOutDate && (
                <span className="text-xs text-muted-foreground">
                  to {homeowner.moveOutDate}
                </span>
              )}
            </div>
          ) : col.id === 'lastPayment' ? (
            <div className="flex flex-col">
              <span>{homeowner.lastPaymentAmount}</span>
              <span className="text-xs text-muted-foreground">
                {homeowner.lastPaymentDate} ({homeowner.paymentMethod})
              </span>
            </div>
          ) : (
            homeowner[col.id as keyof typeof homeowner]
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default HomeownerTableRow;
