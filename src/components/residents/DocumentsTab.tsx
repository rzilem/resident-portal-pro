import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Document } from '@/types/resident';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentsTabProps {
  documents?: Document[];
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              All documents related to this resident
            </CardDescription>
          </div>
          <Button onClick={() => setShowUploadDialog(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, i) => (
                  <TableRow key={i}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No documents available
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentUploadDialog
        open={showUploadDialog}
        setOpen={setShowUploadDialog}
        onSuccess={() => {
          console.log("Document uploaded successfully");
          // Additional success handling if needed
        }}
      />
    </>
  );
};

export default DocumentsTab;
