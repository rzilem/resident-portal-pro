
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ClipboardList, DollarSign, FileCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResaleCertificate from '@/components/resale/ResaleCertificate';
import CondoQuestionnaire from '@/components/resale/CondoQuestionnaire';
import PropertyInspection from '@/components/resale/PropertyInspection';
import AccountStatement from '@/components/resale/AccountStatement';

const ResaleDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Resale Management</h1>
            <p className="text-muted-foreground mb-4">
              Streamline the resale process for HOA and condominium properties in Texas
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/resale/wizard')}
            className="flex items-center gap-2"
          >
            <span>Start Wizard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 days</div>
              <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,480</div>
              <p className="text-xs text-muted-foreground">+$650 from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="certificate">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="certificate" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resale Certificate</span>
              <span className="sm:hidden">Certificate</span>
            </TabsTrigger>
            <TabsTrigger value="questionnaire" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Condo Questionnaire</span>
              <span className="sm:hidden">Questionnaire</span>
            </TabsTrigger>
            <TabsTrigger value="inspection" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Property Inspection</span>
              <span className="sm:hidden">Inspection</span>
            </TabsTrigger>
            <TabsTrigger value="statement" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Account Statement</span>
              <span className="sm:hidden">Statement</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="certificate" className="mt-4">
            <ResaleCertificate />
          </TabsContent>
          
          <TabsContent value="questionnaire" className="mt-4">
            <CondoQuestionnaire />
          </TabsContent>
          
          <TabsContent value="inspection" className="mt-4">
            <PropertyInspection />
          </TabsContent>
          
          <TabsContent value="statement" className="mt-4">
            <AccountStatement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResaleDashboard;
