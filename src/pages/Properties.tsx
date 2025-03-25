
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Users, Home, ChevronRight, CalendarClock, DollarSign, MapPin, Download, Check, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import PropertyColumnsSelector, { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import { useSettings } from '@/hooks/use-settings';
import { exportToExcel } from '@/utils/exportToExcel';

const Properties = () => {
  const isMobile = useIsMobile();
  const { preferences, updatePreference } = useSettings();
  
  // Enhanced property data with additional fields
  const properties = [
    { 
      name: 'Oakwood Heights', 
      type: 'Condominium', 
      units: '48', 
      location: 'Seattle, WA',
      county: 'King',
      taxId: 'TX-12345',
      hasPool: true,
      hasGate: true,
      hasPedestrianGate: false,
      status: 'Active',
      foundedDate: '2010-05-14',
      annualFees: '$125,000',
      manager: 'John Smith',
      contactEmail: 'info@oakwoodheights.com',
      contactPhone: '(206) 555-1234',
      residents: '112'
    },
    { 
      name: 'Willow Creek Estates', 
      type: 'HOA', 
      units: '86', 
      location: 'Portland, OR',
      county: 'Multnomah',
      taxId: 'TX-23456',
      hasPool: true,
      hasGate: false,
      hasPedestrianGate: true,
      status: 'Active',
      foundedDate: '2008-09-22',
      annualFees: '$215,000',
      manager: 'Sarah Johnson',
      contactEmail: 'info@willowcreek.org',
      contactPhone: '(503) 555-6789',
      residents: '192'
    },
    { 
      name: 'Riverfront Towers', 
      type: 'Condominium', 
      units: '64', 
      location: 'Denver, CO',
      county: 'Denver',
      taxId: 'TX-34567',
      hasPool: true,
      hasGate: true,
      hasPedestrianGate: true,
      status: 'Active',
      foundedDate: '2015-03-15',
      annualFees: '$176,000',
      manager: 'Michael Brown',
      contactEmail: 'info@riverfronttowers.com',
      contactPhone: '(303) 555-4321',
      residents: '143'
    },
    { 
      name: 'Sunset Gardens', 
      type: 'HOA', 
      units: '32', 
      location: 'San Diego, CA',
      county: 'San Diego',
      taxId: 'TX-45678',
      hasPool: false,
      hasGate: false,
      hasPedestrianGate: false,
      status: 'Maintenance',
      foundedDate: '2012-07-08',
      annualFees: '$78,000',
      manager: 'Emily Wilson',
      contactEmail: 'info@sunsetgardens.org',
      contactPhone: '(619) 555-8765',
      residents: '76'
    },
    { 
      name: 'Pine Valley Community', 
      type: 'HOA', 
      units: '26', 
      location: 'Austin, TX',
      county: 'Travis',
      taxId: 'TX-56789',
      hasPool: false,
      hasGate: true,
      hasPedestrianGate: false,
      status: 'Active',
      foundedDate: '2018-11-29',
      annualFees: '$62,000',
      manager: 'Robert Lee',
      contactEmail: 'info@pinevalley.org',
      contactPhone: '(512) 555-3456',
      residents: '58'
    },
  ];
  
  // Define all available columns
  const defaultColumns: PropertyColumn[] = [
    { id: 'name', label: 'Property Name', checked: true },
    { id: 'type', label: 'Type', checked: true },
    { id: 'units', label: 'Units', checked: true },
    { id: 'residents', label: 'Residents', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'county', label: 'County', checked: false },
    { id: 'taxId', label: 'Tax ID', checked: false },
    { id: 'foundedDate', label: 'Founded Date', checked: true },
    { id: 'annualFees', label: 'Annual Fees', checked: true },
    { id: 'manager', label: 'Manager', checked: true },
    { id: 'hasPool', label: 'Has Pool', checked: false },
    { id: 'hasGate', label: 'Has Gate', checked: false },
    { id: 'hasPedestrianGate', label: 'Has Pedestrian Gate', checked: false },
    { id: 'status', label: 'Status', checked: true }
  ];
  
  // State for selected columns
  const [columns, setColumns] = useState<PropertyColumn[]>(
    preferences?.propertyTableColumns || defaultColumns
  );
  
  // Update columns when preferences change
  useEffect(() => {
    if (preferences?.propertyTableColumns) {
      setColumns(preferences.propertyTableColumns);
    }
  }, [preferences]);
  
  // Handle column selection changes
  const handleColumnsChange = (newColumns: PropertyColumn[]) => {
    // Make sure at least one column is selected
    const hasCheckedColumn = newColumns.some(col => col.checked);
    
    if (hasCheckedColumn) {
      setColumns(newColumns);
    }
  };
  
  // Handle export to Excel
  const handleExport = () => {
    // Only include visible columns and format data for export
    const visibleColumns = columns.filter(col => col.checked);
    const exportData = properties.map(property => {
      const exportObj: Record<string, any> = {};
      
      visibleColumns.forEach(col => {
        let value = property[col.id as keyof typeof property];
        
        // Format boolean values
        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        }
        
        exportObj[col.label] = value;
      });
      
      return exportObj;
    });
    
    exportToExcel(exportData, 'Property_Report');
  };
  
  // Render Yes/No for boolean values
  const renderBooleanValue = (value: boolean) => (
    <span className="flex items-center">
      {value ? (
        <Check className="h-4 w-4 text-green-600 mr-1" />
      ) : (
        <X className="h-4 w-4 text-red-600 mr-1" />
      )}
      {value ? 'Yes' : 'No'}
    </span>
  );
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Properties Management</h2>
          <p className="text-muted-foreground">Overview of all properties in your portfolio</p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Total Properties', value: '12', desc: 'Across 3 communities', icon: Building, color: 'bg-blue-50 text-blue-600' },
            { title: 'Total Units', value: '256', desc: '92% occupancy rate', icon: Home, color: 'bg-green-50 text-green-600' },
            { title: 'Total Residents', value: '418', desc: 'Active residents', icon: Users, color: 'bg-purple-50 text-purple-600' },
          ].map((item, i) => (
            <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <div className={`${item.color} p-2 rounded-full`}>
                  <item.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Property List</CardTitle>
              <CardDescription>
                Complete list of properties in your portfolio
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <PropertyColumnsSelector 
                columns={columns} 
                onChange={handleColumnsChange} 
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile view */}
            {isMobile && (
              <div className="space-y-4 md:hidden">
                {properties.map((property, i) => (
                  <Card key={i} className="p-4 border">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{property.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {columns.filter(col => col.checked && col.id !== 'name' && col.id !== 'status').map(col => (
                        <div key={col.id} className="flex justify-between">
                          <span className="text-muted-foreground">{col.label}:</span>
                          <span>
                            {typeof property[col.id as keyof typeof property] === 'boolean' 
                              ? (property[col.id as keyof typeof property] ? 'Yes' : 'No')
                              : property[col.id as keyof typeof property]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-3 justify-between">
                      View Details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Desktop view */}
            <div className={isMobile ? "hidden" : "overflow-auto"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map(col => col.checked && (
                      <TableHead key={col.id}>
                        {col.id === 'foundedDate' ? (
                          <div className="flex items-center">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            {col.label}
                          </div>
                        ) : col.id === 'annualFees' ? (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {col.label}
                          </div>
                        ) : col.id === 'location' ? (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {col.label}
                          </div>
                        ) : col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property, i) => (
                    <TableRow key={i} className="cursor-pointer hover:bg-muted">
                      {columns.map(col => col.checked && (
                        <TableCell key={col.id}>
                          {col.id === 'name' ? (
                            <span className="font-medium">{property.name}</span>
                          ) : col.id === 'status' ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {property.status}
                            </span>
                          ) : col.id === 'foundedDate' ? (
                            new Date(property.foundedDate).toLocaleDateString()
                          ) : typeof property[col.id as keyof typeof property] === 'boolean' ? (
                            renderBooleanValue(property[col.id as keyof typeof property] as boolean)
                          ) : (
                            property[col.id as keyof typeof property]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Properties;
