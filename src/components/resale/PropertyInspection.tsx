
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, PlusCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const inspectionTypes = [
  { value: 'standard', label: 'Standard Inspection' },
  { value: 'detailed', label: 'Detailed Inspection' },
  { value: 'reinspection', label: 'Re-Inspection' }
];

const inspectors = [
  { value: 'john', label: 'John Smith' },
  { value: 'sarah', label: 'Sarah Johnson' },
  { value: 'mike', label: 'Mike Davis' }
];

type ScheduledInspection = {
  id: string;
  propertyAddress: string;
  date: Date;
  time: string;
  type: string;
  inspector: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

const mockInspections: ScheduledInspection[] = [
  {
    id: '1',
    propertyAddress: '123 Main St, Austin, TX',
    date: new Date(2023, 10, 15),
    time: '10:00 AM',
    type: 'standard',
    inspector: 'john',
    status: 'scheduled'
  },
  {
    id: '2',
    propertyAddress: '456 Oak Ave, Houston, TX',
    date: new Date(2023, 10, 18),
    time: '2:00 PM',
    type: 'detailed',
    inspector: 'sarah',
    status: 'scheduled'
  },
  {
    id: '3',
    propertyAddress: '789 Pine St, Dallas, TX',
    date: new Date(2023, 10, 10),
    time: '9:00 AM',
    type: 'standard',
    inspector: 'mike',
    status: 'completed'
  }
];

const PropertyInspection = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [inspections, setInspections] = useState<ScheduledInspection[]>(mockInspections);
  
  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for the inspection.",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const propertyAddress = formData.get('propertyAddress') as string;
    const type = formData.get('inspectionType') as string;
    const inspector = formData.get('inspector') as string;
    
    const newInspection: ScheduledInspection = {
      id: Date.now().toString(),
      propertyAddress,
      date: date,
      time: selectedTime,
      type,
      inspector,
      status: 'scheduled'
    };
    
    setInspections([...inspections, newInspection]);
    
    toast({
      title: "Inspection Scheduled",
      description: `Inspection for ${propertyAddress} scheduled for ${format(date, 'PPP')} at ${selectedTime}.`,
    });
    
    // Reset form
    setDate(new Date());
    setSelectedTime(null);
    (e.target as HTMLFormElement).reset();
  };
  
  const getStatusBadge = (status: ScheduledInspection['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Tabs defaultValue="schedule">
      <TabsList>
        <TabsTrigger value="schedule">Schedule Inspection</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming Inspections</TabsTrigger>
        <TabsTrigger value="completed">Completed Inspections</TabsTrigger>
      </TabsList>
      
      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Property Inspection</CardTitle>
            <CardDescription>
              Choose a date and time for your property inspection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input id="propertyAddress" name="propertyAddress" placeholder="Enter property address" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspectionType">Inspection Type</Label>
                  <Select name="inspectionType" defaultValue="standard">
                    <SelectTrigger id="inspectionType">
                      <SelectValue placeholder="Select inspection type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inspectionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inspector">Inspector</Label>
                  <Select name="inspector" defaultValue="john">
                    <SelectTrigger id="inspector">
                      <SelectValue placeholder="Select inspector" />
                    </SelectTrigger>
                    <SelectContent>
                      {inspectors.map(inspector => (
                        <SelectItem key={inspector.value} value={inspector.value}>{inspector.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label className="block mb-2">Select Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                      disabled={(date) => {
                        // Disable weekends and past dates
                        const day = date.getDay();
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return day === 0 || day === 6 || date < today;
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Select Time</Label>
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="justify-start"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-4">
                Schedule Inspection
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="upcoming">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Inspections</CardTitle>
            <CardDescription>
              View and manage your scheduled property inspections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspections.filter(inspection => inspection.status === 'scheduled').map(inspection => (
                <Card key={inspection.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{inspection.propertyAddress}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {format(inspection.date, 'PPP')} at {inspection.time}
                          </span>
                        </div>
                        <div className="mt-2">
                          {getStatusBadge(inspection.status)}
                          <span className="ml-2 text-sm">
                            {inspectionTypes.find(t => t.value === inspection.type)?.label} with {inspectors.find(i => i.value === inspection.inspector)?.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {inspections.filter(inspection => inspection.status === 'scheduled').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming inspections</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[data-value="schedule"]')?.dispatchEvent(new Event('click'))}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Schedule an Inspection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="completed">
        <Card>
          <CardHeader>
            <CardTitle>Completed Inspections</CardTitle>
            <CardDescription>
              Review past inspections and access reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspections.filter(inspection => inspection.status === 'completed').map(inspection => (
                <Card key={inspection.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{inspection.propertyAddress}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {format(inspection.date, 'PPP')} at {inspection.time}
                          </span>
                        </div>
                        <div className="mt-2">
                          {getStatusBadge(inspection.status)}
                          <span className="ml-2 text-sm">
                            {inspectionTypes.find(t => t.value === inspection.type)?.label} with {inspectors.find(i => i.value === inspection.inspector)?.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Report</Button>
                        <Button variant="outline" size="sm">Download PDF</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {inspections.filter(inspection => inspection.status === 'completed').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed inspections</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyInspection;
