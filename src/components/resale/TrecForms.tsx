
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

// Sample TREC forms data
const trecForms = [
  { id: '1', name: "Seller's Disclosure Notice", code: 'OP-H', updated: '2022-04-01', required: true },
  { id: '2', name: 'Condominium Resale Certificate', code: 'OP-C', updated: '2023-01-15', required: true },
  { id: '3', name: 'HOA Resale Certificate', code: 'OP-H', updated: '2023-03-10', required: true },
  { id: '4', name: "Notice of Buyer's Termination of Contract", code: 'OP-T', updated: '2021-11-05', required: false },
  { id: '5', name: 'Third Party Financing Addendum', code: 'OP-F', updated: '2022-08-22', required: false },
  { id: '6', name: 'Addendum for Property Subject to HOA', code: 'OP-A', updated: '2022-10-30', required: true }
];

const TrecForms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const filteredForms = trecForms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDownload = (form: any) => {
    // In a real app, this would download the actual PDF
    toast({
      title: "Form Downloaded",
      description: `${form.name} has been downloaded.`,
    });
  };
  
  const handlePreview = (form: any) => {
    setSelectedForm(form);
    setPreviewOpen(true);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Texas Real Estate Commission (TREC) Forms</CardTitle>
        <CardDescription>
          Access and manage standardized TREC forms required for property transactions in Texas
        </CardDescription>
        <div className="flex items-center space-x-2 pt-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search forms by name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Required</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.name}</TableCell>
                <TableCell>{form.code}</TableCell>
                <TableCell>{form.updated}</TableCell>
                <TableCell>
                  {form.required ? (
                    <Badge variant="default">Required</Badge>
                  ) : (
                    <Badge variant="outline">Optional</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(form)}>
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleDownload(form)}>
                      <Download className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedForm?.name}</DialogTitle>
            <DialogDescription>TREC Form Code: {selectedForm?.code}</DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-6 rounded-md flex flex-col items-center justify-center min-h-[400px]">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              This is a preview of the TREC form. In a production environment, this would display the actual PDF form.
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => selectedForm && handleDownload(selectedForm)}>
              <Download className="h-4 w-4 mr-2" />
              Download Form
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TrecForms;
