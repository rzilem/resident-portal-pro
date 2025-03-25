
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Users, Home, ChevronRight, CalendarClock, DollarSign, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Properties = () => {
  const isMobile = useIsMobile();
  
  const properties = [
    { 
      name: 'Oakwood Heights', 
      type: 'Condominium', 
      units: '48', 
      location: 'Seattle, WA', 
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
      status: 'Active',
      foundedDate: '2018-11-29',
      annualFees: '$62,000',
      manager: 'Robert Lee',
      contactEmail: 'info@pinevalley.org',
      contactPhone: '(512) 555-3456',
      residents: '58'
    },
  ];
  
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
          <CardHeader>
            <CardTitle>Property List</CardTitle>
            <CardDescription>
              Complete list of properties in your portfolio
            </CardDescription>
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
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{property.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Units:</span>
                        <span>{property.units}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{property.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span>{new Date(property.foundedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Manager:</span>
                        <span>{property.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Residents:</span>
                        <span>{property.residents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual Fees:</span>
                        <span>{property.annualFees}</span>
                      </div>
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
                    <TableHead>Property Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Residents</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Founded
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Annual Fees
                      </div>
                    </TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property, i) => (
                    <TableRow key={i} className="cursor-pointer hover:bg-muted">
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>{property.units}</TableCell>
                      <TableCell>{property.residents}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {property.location}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(property.foundedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{property.annualFees}</TableCell>
                      <TableCell>{property.manager}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {property.status}
                        </span>
                      </TableCell>
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
