
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface TransactionFiltersProps {
  searchQuery: string;
  transactionType: string;
  setSearchQuery: (query: string) => void;
  setTransactionType: (type: string) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ 
  searchQuery, 
  transactionType, 
  setSearchQuery, 
  setTransactionType 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search transactions..." 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select value={transactionType} onValueChange={setTransactionType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Transactions</SelectItem>
          <SelectItem value="credit">Income (Credits)</SelectItem>
          <SelectItem value="debit">Expense (Debits)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionFilters;
