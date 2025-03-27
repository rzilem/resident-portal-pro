import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/utils/formatters';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  account: string;
  reference: string;
  associationId?: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.id}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
            <TableCell>
              <Badge variant={transaction.type === 'credit' ? 'success' : 'destructive'}>
                {transaction.type}
              </Badge>
            </TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.account}</TableCell>
            <TableCell>{transaction.reference}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
