
import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BudgetItem } from '@/components/settings/associations/types';

interface BudgetTableProps {
  budgetItems: BudgetItem[];
}

const BudgetTable: React.FC<BudgetTableProps> = ({ budgetItems }) => {
  const getVarianceBadge = (variance: number) => {
    if (variance > 0) {
      return <Badge className="bg-green-500 flex items-center gap-1"><ChevronDown size={14} /> Under Budget</Badge>;
    } else if (variance < 0) {
      return <Badge className="bg-red-500 flex items-center gap-1"><ChevronUp size={14} /> Over Budget</Badge>;
    } else {
      return <Badge className="bg-blue-500">On Budget</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Budgeted</TableHead>
            <TableHead className="text-right">Actual</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetItems.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">${item.budgetedAmount.toLocaleString()}</TableCell>
              <TableCell className="text-right">${item.actualAmount.toLocaleString()}</TableCell>
              <TableCell className="text-right">${Math.abs(item.variance).toLocaleString()}</TableCell>
              <TableCell>{getVarianceBadge(item.variance)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetTable;
