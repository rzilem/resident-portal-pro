
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FolderOpen, Shield, Gavel, FileSpreadsheet, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Association } from '@/types/association';

interface AssociationDocumentsTabProps {
  association: Association;
}

interface DocumentCategory {
  name: string;
  icon: React.ElementType;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
}

const mockDocumentCategories: DocumentCategory[] = [
  {
    name: "Governing Documents",
    icon: Shield,
    documents: [
      { id: "1", name: "Articles of Incorporation", date: "2010-01-15", size: "1.2 MB", type: "pdf" },
      { id: "2", name: "Bylaws", date: "2010-01-15", size: "3.5 MB", type: "pdf" },
      { id: "3", name: "CC&Rs", date: "2010-01-15", size: "5.8 MB", type: "pdf" },
      { id: "4", name: "Rules and Regulations", date: "2022-06-10", size: "2.3 MB", type: "pdf" }
    ]
  },
  {
    name: "Financial Documents",
    icon: FileSpreadsheet,
    documents: [
      { id: "5", name: "2023 Annual Budget", date: "2022-12-10", size: "1.5 MB", type: "xlsx" },
      { id: "6", name: "2022 Financial Audit", date: "2023-03-15", size: "2.7 MB", type: "pdf" },
      { id: "7", name: "Q1 2023 Financial Report", date: "2023-04-15", size: "1.8 MB", type: "pdf" },
      { id: "8", name: "Reserve Study (2023)", date: "2023-01-20", size: "4.2 MB", type: "pdf" }
    ]
  },
  {
    name: "Meeting Minutes",
    icon: Calendar,
    documents: [
      { id: "9", name: "Annual Meeting (2023)", date: "2023-05-15", size: "1.1 MB", type: "pdf" },
      { id: "10", name: "Board Meeting - April 2023", date: "2023-04-10", size: "0.9 MB", type: "pdf" },
      { id: "11", name: "Board Meeting - March 2023", date: "2023-03-12", size: "1.0 MB", type: "pdf" },
      { id: "12", name: "Board Meeting - February 2023", date: "2023-02-14", size: "0.8 MB", type: "pdf" }
    ]
  },
  {
    name: "Legal Documents",
    icon: Gavel,
    documents: [
      { id: "13", name: "Insurance Policies Summary", date: "2023-01-30", size: "1.4 MB", type: "pdf" },
      { id: "14", name: "Easement Agreements", date: "2010-02-20", size: "3.2 MB", type: "pdf" },
      { id: "15", name: "Contractor Agreements Template", date: "2022-08-15", size: "0.6 MB", type: "docx" }
    ]
  }
];

const AssociationDocumentsTab: React.FC<AssociationDocumentsTabProps> = ({ association }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Governing Documents");
  
  const currentCategory = mockDocumentCategories.find(cat => cat.name === activeCategory) || mockDocumentCategories[0];
  
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Association Documents</CardTitle>
          <Button onClick={() => navigate('/documents/association')} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full flex overflow-auto">
              {mockDocumentCategories.map(category => (
                <TabsTrigger key={category.name} value={category.name} className="flex items-center gap-1">
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {mockDocumentCategories.map(category => (
              <TabsContent key={category.name} value={category.name} className="pt-4">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.documents.map(doc => (
                        <tr key={doc.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(doc.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{doc.size}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationDocumentsTab;
