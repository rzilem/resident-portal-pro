
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PrintQueueToolbar from '@/components/print-queue/PrintQueueToolbar';
import PrintQueueTable from '@/components/print-queue/PrintQueueTable';
import PrintQueueSettings from '@/components/print-queue/PrintQueueSettings';
import { usePrintQueue } from '@/hooks/use-print-queue';
import PrintQueueFilters from '@/components/print-queue/PrintQueueFilters';
import { useToast } from '@/components/ui/use-toast';

const PrintQueue = () => {
  const {
    printJobs,
    selectedJobs,
    loading,
    toggleJobSelection,
    selectAllJobs,
    clearSelection,
    deleteJob,
    reprintJob,
    printSelectedJobs,
    sendToHOAMailers,
    stats
  } = usePrintQueue();
  
  const { toast } = useToast();
  const [includeMailingLabels, setIncludeMailingLabels] = useState(true);
  const [printPreview, setPrintPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [associationFilter, setAssociationFilter] = useState<string | undefined>(undefined);
  const [associationName, setAssociationName] = useState<string | undefined>(undefined);

  const handleIncludeMailingLabelsChange = (checked: boolean) => {
    setIncludeMailingLabels(checked);
  };

  const handlePrintPreviewChange = (checked: boolean) => {
    setPrintPreview(checked);
  };

  const handleSetCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    toast({
      title: "Filter applied",
      description: `Showing print jobs in category: ${category}`,
    });
  };

  const handleSetAssociationFilter = (id: string, name: string) => {
    setAssociationFilter(id);
    setAssociationName(name);
    toast({
      title: "Filter applied",
      description: `Showing print jobs for: ${name}`,
    });
  };

  const handleClearCategoryFilter = () => {
    setCategoryFilter(undefined);
    toast({
      title: "Filter cleared",
      description: "Category filter has been removed",
    });
  };

  const handleClearAssociationFilter = () => {
    setAssociationFilter(undefined);
    setAssociationName(undefined);
    toast({
      title: "Filter cleared",
      description: "Association filter has been removed",
    });
  };
  
  const handleDeleteJob = (id: string) => {
    deleteJob(id);
  };
  
  const handleReprintJob = (id: string) => {
    reprintJob(id);
  };

  const filteredJobs = printJobs.filter(job => {
    const matchesCategory = categoryFilter ? job.category === categoryFilter : true;
    const matchesAssociation = associationFilter ? job.associationId === associationFilter : true;
    return matchesCategory && matchesAssociation;
  });

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Print Queue</h1>
        <p className="text-muted-foreground">Manage and process print jobs for your community</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Print Queue Management</CardTitle>
          <CardDescription>
            View, organize, and process batch print jobs for your community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PrintQueueToolbar
            selectedJobs={selectedJobs}
            onPrint={printSelectedJobs}
            onSendToHOAMailers={sendToHOAMailers}
            onIncludeMailingLabelsChange={handleIncludeMailingLabelsChange}
            onPrintPreviewChange={handlePrintPreviewChange}
            includeMailingLabels={includeMailingLabels}
            printPreview={printPreview}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {categoryFilter || associationFilter ? (
            <PrintQueueFilters
              categoryFilter={categoryFilter}
              associationFilter={associationFilter}
              associationName={associationName}
              onClearCategoryFilter={handleClearCategoryFilter}
              onClearAssociationFilter={handleClearAssociationFilter}
            />
          ) : null}
          
          {activeTab === 'queue' && (
            <PrintQueueTable
              jobs={filteredJobs}
              selectedJobs={selectedJobs}
              onToggleSelect={toggleJobSelection}
              onSelectAll={selectAllJobs}
              onSetCategoryFilter={handleSetCategoryFilter}
              onSetAssociationFilter={handleSetAssociationFilter}
              onDeleteJob={handleDeleteJob}
              onReprintJob={handleReprintJob}
            />
          )}
          
          {activeTab === 'jobs' && (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium">Job History</h3>
                <p className="text-muted-foreground">View and search through previously processed print jobs</p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
          )}
          
          {activeTab === 'third-party-orders' && (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium">Third Party Print Orders</h3>
                <p className="text-muted-foreground">Track bulk printing orders managed by external vendors</p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <PrintQueueSettings />
    </div>
  );
};

export default PrintQueue;
