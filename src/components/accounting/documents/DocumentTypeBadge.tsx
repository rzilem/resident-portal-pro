
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  FileText, 
  FileBarChart2, 
  Calculator, 
  FileImage,
  File 
} from "lucide-react";

interface DocumentTypeBadgeProps {
  type: string;
}

const DocumentTypeBadge: React.FC<DocumentTypeBadgeProps> = ({ type }) => {
  switch (type) {
    case 'receipt':
      return <Badge className="bg-green-500 flex items-center gap-1"><FileCheck size={14} /> Receipt</Badge>;
    case 'invoice':
      return <Badge className="bg-blue-500 flex items-center gap-1"><FileText size={14} /> Invoice</Badge>;
    case 'statement':
      return <Badge className="bg-purple-500 flex items-center gap-1"><FileBarChart2 size={14} /> Statement</Badge>;
    case 'tax':
      return <Badge className="bg-red-500 flex items-center gap-1"><Calculator size={14} /> Tax</Badge>;
    case 'audit':
      return <Badge className="bg-yellow-500 flex items-center gap-1"><FileImage size={14} /> Audit</Badge>;
    default:
      return <Badge className="flex items-center gap-1"><File size={14} /> {type}</Badge>;
  }
};

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'receipt':
      return <FileCheck size={16} />;
    case 'invoice':
      return <FileText size={16} />;
    case 'statement':
      return <FileBarChart2 size={16} />;
    case 'tax':
      return <Calculator size={16} />;
    case 'audit':
      return <FileImage size={16} />;
    default:
      return <File size={16} />;
  }
};

export default DocumentTypeBadge;
