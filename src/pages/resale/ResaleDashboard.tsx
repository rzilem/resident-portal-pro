
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ClipboardList } from 'lucide-react';
import ResaleCertificate from '@/components/resale/ResaleCertificate';

const ResaleDashboard = () => {
  return (
    <div className="container p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Resale Management</h1>
        <p className="text-muted-foreground mb-4">
          Streamline the resale process for HOA and condominium properties in Texas
        </p>

        <Tabs defaultValue="certificate">
          <TabsList className="grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="certificate">Resale Certificate</TabsTrigger>
            <TabsTrigger value="questionnaire">Condo Questionnaire</TabsTrigger>
            <TabsTrigger value="inspection">Property Inspection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="certificate" className="mt-4">
            <ResaleCertificate />
          </TabsContent>
          
          <TabsContent value="questionnaire" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Condo Questionnaire Tool</CardTitle>
                <CardDescription>
                  Coming soon - Create and manage condo questionnaires for lenders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Condo questionnaire feature will be implemented next.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inspection" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Inspection Scheduler</CardTitle>
                <CardDescription>
                  Coming soon - Schedule and manage property inspections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Property inspection scheduler will be implemented later.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResaleDashboard;
