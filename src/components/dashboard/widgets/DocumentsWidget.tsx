
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, ArrowUpDown, UserCircle, Calendar, FileCode, Bookmark, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentsWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const DocumentsWidget = ({ size = 'medium', cardClass = '' }: DocumentsWidgetProps) => {
  // Sample documents data with realistic HOA documents
  const documents = [
    { 
      id: 1, 
      name: 'Annual Budget 2023.pdf', 
      type: 'financial', 
      date: '2023-09-15',
      user: 'Maria Rodriguez',
      tags: ['Important', 'Board']
    },
    { 
      id: 2, 
      name: 'Board Meeting Minutes - October.docx', 
      type: 'meeting', 
      date: '2023-10-01',
      user: 'David Johnson',
      tags: ['Board']
    },
    { 
      id: 3, 
      name: 'Maintenance Schedule Q4.xlsx', 
      type: 'maintenance', 
      date: '2023-10-05',
      user: 'Sarah Williams',
      tags: ['Operations']
    },
    { 
      id: 4, 
      name: 'Community Guidelines Updated.pdf', 
      type: 'rules', 
      date: '2023-08-20',
      user: 'Thomas Miller',
      tags: ['Important', 'Residents']
    },
    { 
      id: 5, 
      name: 'Insurance Policy Renewal.pdf', 
      type: 'financial', 
      date: '2023-09-10',
      user: 'Alex Lee',
      tags: ['Legal', 'Important']
    },
    { 
      id: 6, 
      name: 'Pool Area Renovation Proposal.pdf', 
      type: 'proposal', 
      date: '2023-10-08',
      user: 'Maria Rodriguez',
      tags: ['Projects']
    },
  ];

  // Decide how many documents to show based on size
  const limit = size === 'small' ? 2 : size === 'medium' ? 3 : 5;
  const displayedDocs = documents.slice(0, limit);
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <FileText className="h-5 w-5 text-green-500 flex-shrink-0" />;
      case 'meeting':
        return <FileCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />;
      case 'maintenance':
        return <FileCode className="h-5 w-5 text-amber-500 flex-shrink-0" />;
      case 'rules':
        return <Bookmark className="h-5 w-5 text-purple-500 flex-shrink-0" />;
      case 'proposal':
        return <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    }
  };
  
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
            <li key={doc.id} className="flex items-start gap-3">
              {getDocumentIcon(doc.type)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                {size !== 'small' && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="mr-2">{new Date(doc.date).toLocaleDateString()}</span>
                    {size === 'large' && (
                      <>
                        <UserCircle className="h-3 w-3 mr-1" />
                        <span>{doc.user}</span>
                      </>
                    )}
                  </div>
                )}
                {size === 'large' && doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doc.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
