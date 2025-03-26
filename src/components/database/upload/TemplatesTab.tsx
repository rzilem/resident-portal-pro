
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface TemplatesTabProps {
  onOpenChange: () => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ onOpenChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileDown className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{template.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Format: {template.format}</span>
              <span>{template.size}</span>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={onOpenChange}>
              Download Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const templates = [
  {
    id: 1,
    name: 'Resident Data',
    description: 'Template for importing homeowner and resident information',
    format: 'Excel',
    size: '12KB'
  },
  {
    id: 2,
    name: 'Property Data',
    description: 'Template for importing property and unit information',
    format: 'Excel',
    size: '14KB'
  },
  {
    id: 3,
    name: 'Violation Types',
    description: 'Template for importing violation types and categories',
    format: 'Excel',
    size: '8KB'
  },
  {
    id: 4,
    name: 'Financial Accounts',
    description: 'Template for importing GL accounts and financial data',
    format: 'Excel',
    size: '15KB'
  },
  {
    id: 5,
    name: 'Vendors',
    description: 'Template for importing vendor information',
    format: 'Excel',
    size: '10KB'
  },
  {
    id: 6,
    name: 'Document Categories',
    description: 'Template for importing document structure',
    format: 'Excel',
    size: '6KB'
  },
];

export default TemplatesTab;
