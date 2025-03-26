
import React, { useState } from 'react';
import { PlusCircle, RefreshCw, Upload, Download, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatabaseExplorer from '@/components/database/DatabaseExplorer';
import DatabaseStats from '@/components/database/DatabaseStats';
import BulkUploadDialog from '@/components/database/BulkUploadDialog';
import { useToast } from '@/hooks/use-toast';

const Records = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Database records have been refreshed",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for export",
    });
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
                Refresh
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Record
              </Button>
            </div>
          </div>
        </section>
        
        <DatabaseExplorer />
        <div className="mt-6">
          <DatabaseStats />
        </div>
      </main>

      <BulkUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
      />
    </div>
  );
};

export default Records;
