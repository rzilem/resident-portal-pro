
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  FileText, 
  FileBarChart2, 
  Calculator, 
  FileImage 
} from "lucide-react";

interface DocumentTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList>
      <TabsTrigger value="all">All Documents</TabsTrigger>
      <TabsTrigger value="receipts" className="flex items-center gap-1">
        <FileCheck size={14} /> Receipts
      </TabsTrigger>
      <TabsTrigger value="invoices" className="flex items-center gap-1">
        <FileText size={14} /> Invoices
      </TabsTrigger>
      <TabsTrigger value="statements" className="flex items-center gap-1">
        <FileBarChart2 size={14} /> Statements
      </TabsTrigger>
      <TabsTrigger value="tax" className="flex items-center gap-1">
        <Calculator size={14} /> Tax
      </TabsTrigger>
    </TabsList>
  );
};

export default DocumentTabs;
