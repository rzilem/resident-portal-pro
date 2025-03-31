
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { toast } from 'sonner';

// Import record type components
import ResidentRecords from './ResidentRecords';
import VendorRecords from './VendorRecords';

// Mock property data for filter
const properties = [
  { id: 'prop1', name: 'Oakwood Heights' },
  { id: 'prop2', name: 'Willow Creek Estates' },
  { id: 'prop3', name: 'Riverfront Towers' }
];

const DatabaseExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(properties[0].id);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handlePropertyChange = (value: string) => {
    setSelectedProperty(value);
    toast.info(`Filtered by ${properties.find(p => p.id === value)?.name || 'All Properties'}`);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Select value={selectedProperty} onValueChange={handlePropertyChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            {properties.map(property => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Record Type Tabs */}
      <Tabs defaultValue="properties" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="residents">Residents</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="associations">Associations</TabsTrigger>
        </TabsList>
        
        {/* Content based on selected tab */}
        {activeTab === 'properties' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Property Records</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage all properties in your database
                </p>
                <Button>View Properties</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'residents' && <ResidentRecords />}
        
        {activeTab === 'vendors' && <VendorRecords />}
        
        {activeTab === 'associations' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Association Records</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage all associations in your database
                </p>
                <Button>View Associations</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  );
};

export default DatabaseExplorer;
