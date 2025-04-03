import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from 'lucide-react';
import { DocumentTemplate } from '@/types/documents';

const DocumentTemplates = () => {
  // Mock template data
  const templates = [
    {
      id: '1',
      name: 'Welcome Letter',
      description: 'Standard welcome letter for new residents',
      category: 'resident',
      createdAt: '2023-01-15',
      lastUsed: '2023-05-20',
      lastModified: '2023-04-10',
      usageCount: 45,
      version: 2
    },
    {
      id: '2',
      name: 'Maintenance Request Form',
      description: 'Form for residents to submit maintenance requests',
      category: 'maintenance',
      createdAt: '2023-02-20',
      lastUsed: '2023-06-01',
      lastModified: '2023-05-15',
      usageCount: 62,
      version: 1
    },
    {
      id: '3',
      name: 'Payment Reminder',
      description: 'Reminder for upcoming payment due dates',
      category: 'financial',
      createdAt: '2023-03-01',
      lastUsed: '2023-06-15',
      lastModified: '2023-05-28',
      usageCount: 38,
      version: 3
    },
  ];

  const sortedTemplates = templates.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Templates</CardTitle>
        <CardDescription>Manage and customize document templates for your association</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>{template.lastUsed}</TableCell>
                  <TableCell>{template.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplates;
