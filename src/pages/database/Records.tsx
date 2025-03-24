
import React, { useState } from 'react';
import { PlusCircle, RefreshCw, Upload, Download } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          <div className="grid gap-4 md:gap-6 mb-6">
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Database Records</h2>
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
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Record
                  </Button>
                </div>
              </div>
            </section>
            
            <DatabaseExplorer />
            <DatabaseStats />
          </div>
        </main>
      </div>

      <BulkUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
      />
    </div>
  );
};

export default Records;
