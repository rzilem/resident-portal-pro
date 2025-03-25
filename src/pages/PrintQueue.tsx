
import React, { useState } from 'react';
import { usePrintQueue } from '@/hooks/use-print-queue';
import { PrintCategory } from '@/services/printQueueService';
import PrintQueueToolbar from '@/components/print-queue/PrintQueueToolbar';
import PrintQueueFilters from '@/components/print-queue/PrintQueueFilters';
import PrintQueueTable from '@/components/print-queue/PrintQueueTable';
import PrintQueueSettings from '@/components/print-queue/PrintQueueSettings';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Printer, Calendar } from 'lucide-react';

const PrintQueue: React.FC = () => {
  const [includeMailingLabels, setIncludeMailingLabels] = useState(true);
  const [printPreview, setPrintPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('queue');
  const [associationName, setAssociationName] = useState<string | undefined>();
  
  const {
    printJobs,
    isLoading,
    selectedJobs,
    filters,
    toggleJobSelection,
    selectAllJobs,
    sendToHOAMailers,
    setFilter,
    clearFilters
  } = usePrintQueue();

  const handlePrint = () => {
    if (selectedJobs.length === 0) {
      toast.warning('No jobs selected for printing');
      return;
    }
    
    if (printPreview) {
      toast.info('Opening print preview...');
    } else {
      toast.success(`Printing ${selectedJobs.length} jobs`);
    }
  };

  const handleSendToHOAMailers = async () => {
    if (selectedJobs.length === 0) {
      toast.warning('No jobs selected to send to HOA Mailers');
      return;
    }
    
    await sendToHOAMailers();
  };

  const handleSetCategoryFilter = (category: PrintCategory) => {
    setFilter('category', category);
  };

  const handleSetAssociationFilter = (id: string, name: string) => {
    setFilter('associationId', id);
    setAssociationName(name);
  };

  const handleClearCategoryFilter = () => {
    setFilter('category', undefined);
  };

  const handleClearAssociationFilter = () => {
    setFilter('associationId', undefined);
    setAssociationName(undefined);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Print Queue</h1>
          <p className="text-muted-foreground">
            Manage and send print jobs to internal printers or HOA Mailers
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Print Jobs
          </Button>
          <PrintQueueSettings />
        </div>
      </div>
      
      <PrintQueueToolbar
        selectedJobs={selectedJobs}
        onPrint={handlePrint}
        onSendToHOAMailers={handleSendToHOAMailers}
        onIncludeMailingLabelsChange={setIncludeMailingLabels}
        onPrintPreviewChange={setPrintPreview}
        includeMailingLabels={includeMailingLabels}
        printPreview={printPreview}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <PrintQueueFilters
        categoryFilter={filters.category}
        associationFilter={filters.associationId}
        associationName={associationName}
        onClearCategoryFilter={handleClearCategoryFilter}
        onClearAssociationFilter={handleClearAssociationFilter}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PrintQueueTable
          jobs={printJobs}
          selectedJobs={selectedJobs}
          onToggleSelect={toggleJobSelection}
          onSelectAll={selectAllJobs}
          onSetCategoryFilter={handleSetCategoryFilter}
          onSetAssociationFilter={handleSetAssociationFilter}
        />
      )}
    </div>
  );
};

export default PrintQueue;
