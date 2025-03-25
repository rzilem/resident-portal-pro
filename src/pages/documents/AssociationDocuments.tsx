
import React, { useState } from 'react';
import DashboardHeaderWithNav from '@/components/DashboardHeaderWithNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { File, Folder, FileText, Upload, Download, Search } from 'lucide-react';
import DocumentCategoryList from '@/components/documents/DocumentCategoryList';
import DocumentSearch from '@/components/documents/DocumentSearch';
import DocumentTable from '@/components/documents/DocumentTable';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { DOCUMENT_CATEGORIES } from '@/components/database/DocumentCategoryStructure';

const AssociationDocuments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <DashboardHeaderWithNav
        title="Association Documents"
        description="Manage and organize association documents"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar with document categories */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Categories</CardTitle>
                <CardDescription>Browse document categories</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentCategoryList 
                  categories={DOCUMENT_CATEGORIES}
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-3">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <DocumentSearch onSearch={setSearchQuery} />
                <DocumentUploader />
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {activeCategory 
                        ? DOCUMENT_CATEGORIES.find(c => c.id === activeCategory)?.name || 'Documents'
                        : 'All Documents'}
                    </CardTitle>
                    <Download className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                  </div>
                  <CardDescription>
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Browse and manage documents'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                      <TabsTrigger value="shared">Shared</TabsTrigger>
                      <TabsTrigger value="important">Important</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                      />
                    </TabsContent>
                    
                    <TabsContent value="recent" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        filter="recent"
                      />
                    </TabsContent>
                    
                    <TabsContent value="shared" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        filter="shared"
                      />
                    </TabsContent>
                    
                    <TabsContent value="important" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        filter="important"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssociationDocuments;
