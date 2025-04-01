import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Search, Download, Filter, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// Import record type components
import AssociationRecords from './AssociationRecords';
import PropertyRecords from './PropertyRecords';
import ResidentRecords from './ResidentRecords';
import VendorRecords from './VendorRecords';

const DatabaseExplorer = () => {
  const [activeTab, setActiveTab] = useState('associations');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('table'); // table or card
  const [filterOpen, setFilterOpen] = useState(false);

  const handleExport = (format: string) => {
    toast.success(`Exporting data to ${format.toUpperCase()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs
          defaultValue="associations"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="associations">Associations</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
          
          {/* Content Areas */}
          <div className="mt-4">
            <TabsContent value="associations">
              <AssociationRecords />
            </TabsContent>

            <TabsContent value="properties">
              <PropertyRecords />
            </TabsContent>

            <TabsContent value="residents">
              <ResidentRecords />
            </TabsContent>

            <TabsContent value="vendors">
              <VendorRecords />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </form>

        <div className="flex gap-2 ml-auto">
          <TooltipButton 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={toggleFilters}
            tooltipText="Filter records"
          >
            <Filter className="h-4 w-4" />
            Filters
          </TooltipButton>

          <TooltipButton 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => {
              const dropdownMenu = document.querySelector('[data-dropdown-menu="export"]') as HTMLElement;
              dropdownMenu?.click();
            }}
            tooltipText="Export records"
          >
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-3 w-3 opacity-50" />
          </TooltipButton>

          <TooltipButton
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setCurrentView(currentView === 'table' ? 'card' : 'table')}
            tooltipText={`Switch to ${currentView === 'table' ? 'card' : 'table'} view`}
          >
            {currentView === 'table' ? 'Card View' : 'Table View'}
          </TooltipButton>
        </div>
      </div>

      {/* Filters Panel */}
      {filterOpen && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>All Types</option>
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Date Range</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline" className="mr-2">Reset</Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseExplorer;
