
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

const DocumentsWidget = ({ size = 'medium' }: DocumentsWidgetProps) => {
  // Mock documents data
  const documents = [
    { id: '1', name: 'March Meeting Minutes.pdf', date: '2024-03-15', type: 'PDF' },
    { id: '2', name: 'Annual Budget Report.xlsx', date: '2024-02-28', type: 'XLSX' },
    { id: '3', name: 'Community Newsletter.pdf', date: '2024-03-01', type: 'PDF' },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" /> Recent Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsWidget;
