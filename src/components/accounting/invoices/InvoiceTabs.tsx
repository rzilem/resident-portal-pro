
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Send, AlertCircle, CheckCircle } from "lucide-react";

interface InvoiceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const InvoiceTabs: React.FC<InvoiceTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList>
      <TabsTrigger value="all" className="flex items-center gap-1">
        <FileText size={14} /> All
      </TabsTrigger>
      <TabsTrigger value="draft" className="flex items-center gap-1">
        <Clock size={14} /> Draft
      </TabsTrigger>
      <TabsTrigger value="sent" className="flex items-center gap-1">
        <Send size={14} /> Sent
      </TabsTrigger>
      <TabsTrigger value="overdue" className="flex items-center gap-1">
        <AlertCircle size={14} /> Overdue
      </TabsTrigger>
      <TabsTrigger value="paid" className="flex items-center gap-1">
        <CheckCircle size={14} /> Paid
      </TabsTrigger>
    </TabsList>
  );
};

export default InvoiceTabs;
