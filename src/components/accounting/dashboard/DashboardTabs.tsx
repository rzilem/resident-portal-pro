
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  ReceiptText, 
  CreditCard, 
  BarChart4, 
  FileBarChart, 
  Building, 
  FileCheck 
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab }) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
      <TabsTrigger value="overview" className="flex items-center gap-1">
        <DollarSign size={14} /> Overview
      </TabsTrigger>
      <TabsTrigger value="invoices" className="flex items-center gap-1">
        <ReceiptText size={14} /> Invoices
      </TabsTrigger>
      <TabsTrigger value="transactions" className="flex items-center gap-1">
        <CreditCard size={14} /> Transactions
      </TabsTrigger>
      <TabsTrigger value="budget" className="flex items-center gap-1">
        <BarChart4 size={14} /> Budget
      </TabsTrigger>
      <TabsTrigger value="statements" className="flex items-center gap-1">
        <FileBarChart size={14} /> Statements
      </TabsTrigger>
      <TabsTrigger value="vendors" className="flex items-center gap-1">
        <Building size={14} /> Vendors
      </TabsTrigger>
      <TabsTrigger value="documents" className="flex items-center gap-1">
        <FileCheck size={14} /> Documents
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTabs;
