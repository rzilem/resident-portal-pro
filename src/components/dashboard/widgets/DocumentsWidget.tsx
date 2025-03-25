
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const DocumentsWidget = ({ size = 'medium', cardClass = '' }: DocumentsWidgetProps) => {
  // Sample documents data
  const documents = [
    { id: 1, name: 'Annual Budget.pdf', type: 'financial', date: '2023-09-15' },
    { id: 2, name: 'Board Meeting Minutes.docx', type: 'meeting', date: '2023-10-01' },
    { id: 3, name: 'Maintenance Schedule.xlsx', type: 'maintenance', date: '2023-10-05' },
    { id: 4, name: 'Community Guidelines.pdf', type: 'rules', date: '2023-08-20' },
    { id: 5, name: 'Insurance Policy.pdf', type: 'financial', date: '2023-09-10' },
  ];

  // Decide how many documents to show based on size
  const limit = size === 'small' ? 2 : size === 'medium' ? 3 : 5;
  const displayedDocs = documents.slice(0, limit);
  
  return (
    <Card className={`${cardClass}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Recent Documents</CardTitle>
          {size === 'large' && (
            <Button variant="ghost" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {displayedDocs.map(doc => (
            <li key={doc.id} className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                {size !== 'small' && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentsWidget;
