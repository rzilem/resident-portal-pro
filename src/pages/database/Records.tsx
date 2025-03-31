
import React, { useState } from 'react';
import { PlusCircle, RefreshCw, Upload, Download, Database, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import components
import DatabaseExplorer from '@/components/database/DatabaseExplorer';
import DatabaseStats from '@/components/database/DatabaseStats';
import BulkUploadDialog from '@/components/database/BulkUploadDialog';
import ExportDialog from '@/components/database/ExportDialog';

const Records = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('explorer');

  const handleRefresh = () => {
    toast.success("Database records have been refreshed");
  };

  const handleExport = () => {
    setIsExportDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <section className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Database Records
              </h2>
              <p className="text-muted-foreground">Manage and search all database records</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Bulk Upload</span>
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Add Record</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="explorer" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="explorer">Database Explorer</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>
        
        {currentTab === 'explorer' ? (
          <DatabaseExplorer />
        ) : (
          <DatabaseStats />
        )}
      </main>

      <BulkUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
      />
      
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
      />
    </div>
  );
};

export default Records;
