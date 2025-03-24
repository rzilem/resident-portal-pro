
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  FileText, 
  FileBarChart2, 
  Calculator, 
  FileImage 
} from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({ activeTab, onTabChange }) => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-5">
      <TabsTrigger value="all">All{!isMobile && " Documents"}</TabsTrigger>
      <TabsTrigger value="receipts" className="flex items-center gap-1">
        <FileCheck size={14} /> {!isMobile && "Receipts"}
      </TabsTrigger>
      <TabsTrigger value="invoices" className="flex items-center gap-1">
        <FileText size={14} /> {!isMobile && "Invoices"}
      </TabsTrigger>
      <TabsTrigger value="statements" className="flex items-center gap-1">
        <FileBarChart2 size={14} /> {!isMobile && "Statements"}
      </TabsTrigger>
      <TabsTrigger value="tax" className="flex items-center gap-1">
        <Calculator size={14} /> {!isMobile && "Tax"}
      </TabsTrigger>
    </TabsList>
  );
};

export default DocumentTabs;
