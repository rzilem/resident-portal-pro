
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, PlusCircle, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Records = () => {
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
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Record
                  </Button>
                </div>
              </div>
            </section>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Database Explorer</CardTitle>
                <CardDescription>
                  View and manage all database records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="properties">
                  <TabsList className="mb-4">
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="units">Units</TabsTrigger>
                    <TabsTrigger value="residents">Residents</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="properties" className="pt-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search properties..."
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Property Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Created Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { id: 'P001', name: 'Oakwood Heights', type: 'Condominium', units: '48', location: 'Seattle, WA', created: '2021-05-14' },
                          { id: 'P002', name: 'Willow Creek Estates', type: 'HOA', units: '86', location: 'Portland, OR', created: '2018-09-22' },
                          { id: 'P003', name: 'Riverfront Towers', type: 'Condominium', units: '64', location: 'Denver, CO', created: '2020-03-15' },
                          { id: 'P004', name: 'Sunset Gardens', type: 'HOA', units: '32', location: 'San Diego, CA', created: '2019-07-08' },
                          { id: 'P005', name: 'Pine Valley Community', type: 'HOA', units: '26', location: 'Austin, TX', created: '2021-11-29' },
                        ].map((property, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono">{property.id}</TableCell>
                            <TableCell className="font-medium">{property.name}</TableCell>
                            <TableCell>{property.type}</TableCell>
                            <TableCell>{property.units}</TableCell>
                            <TableCell>{property.location}</TableCell>
                            <TableCell>{property.created}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="units" className="pt-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search units..."
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Unit Number</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Sq Ft</TableHead>
                          <TableHead>Bedrooms</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { id: 'U001', unit: '101', property: 'Oakwood Heights', sqft: '850', bedrooms: '1', status: 'Occupied' },
                          { id: 'U002', unit: '205', property: 'Oakwood Heights', sqft: '1200', bedrooms: '2', status: 'Occupied' },
                          { id: 'U003', unit: '14', property: 'Willow Creek Estates', sqft: '1800', bedrooms: '3', status: 'Occupied' },
                          { id: 'U004', unit: '301', property: 'Riverfront Towers', sqft: '1100', bedrooms: '2', status: 'Vacant' },
                          { id: 'U005', unit: '7', property: 'Pine Valley Community', sqft: '2200', bedrooms: '4', status: 'Occupied' },
                        ].map((unit, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono">{unit.id}</TableCell>
                            <TableCell className="font-medium">{unit.unit}</TableCell>
                            <TableCell>{unit.property}</TableCell>
                            <TableCell>{unit.sqft}</TableCell>
                            <TableCell>{unit.bedrooms}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                unit.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {unit.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="residents" className="pt-4">
                    <div className="p-8 text-center">
                      <Database className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Resident Records Selected</h3>
                      <p className="text-muted-foreground mb-4">View and manage resident information.</p>
                      <Button>Load Resident Data</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="transactions" className="pt-4">
                    <div className="p-8 text-center">
                      <Database className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Transaction Records Selected</h3>
                      <p className="text-muted-foreground mb-4">View and manage financial transaction data.</p>
                      <Button>Load Transaction Data</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in animate-delay-200">
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
                <CardDescription>
                  Current database statistics and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Records', value: '12,456', desc: 'Across all tables' },
                    { title: 'Last Backup', value: '2 hours ago', desc: 'Auto-backup' },
                    { title: 'Storage Used', value: '1.2 GB', desc: '32% of quota' },
                    { title: 'System Status', value: 'Operational', desc: 'All systems normal' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="text-sm text-muted-foreground">{stat.title}</h4>
                      <div className="text-2xl font-semibold mt-1">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Records;
