
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, MoreHorizontal, Search, Download, Eye, Filter, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// Components
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

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for record ${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Editing record ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Deleting record ${id}`);
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="associations" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="associations">Associations</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={toggleFilters}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setCurrentView(currentView === 'table' ? 'card' : 'table')}
          >
            {currentView === 'table' ? 'Card View' : 'Table View'}
          </Button>
        </div>
      </div>

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

      <div className="mt-4">
        <TabsContent value="associations" className="mt-0">
          <AssociationRecords />
        </TabsContent>
        
        <TabsContent value="properties" className="mt-0">
          <PropertyRecords />
        </TabsContent>
        
        <TabsContent value="residents" className="mt-0">
          <ResidentRecords />
        </TabsContent>
        
        <TabsContent value="vendors" className="mt-0">
          <VendorRecords />
        </TabsContent>
      </div>
    </div>
  );
};

export default DatabaseExplorer;
