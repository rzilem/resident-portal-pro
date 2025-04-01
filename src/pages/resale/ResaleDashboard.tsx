
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck, FileQuestion, FileSearch, FileText, FileBadge, ListOrdered } from 'lucide-react';
import ResaleCertificate from '@/components/resale/ResaleCertificate';
import CondoQuestionnaire from '@/components/resale/CondoQuestionnaire';
import PropertyInspection from '@/components/resale/PropertyInspection';
import AccountStatement from '@/components/resale/AccountStatement';
import TrecForms from '@/components/resale/TrecForms';
import ResaleRbacWrapper from '@/components/resale/ResaleRbacWrapper';
import ResaleOverview from '@/components/resale/dashboard/ResaleOverview';
import ResaleOrderQueue from '@/components/resale/dashboard/ResaleOrderQueue';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const ResaleDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes('/certificate')) return 'certificate';
    if (path.includes('/questionnaire')) return 'questionnaire';
    if (path.includes('/inspection')) return 'inspection';
    if (path.includes('/statements')) return 'statements';
    if (path.includes('/trec-forms')) return 'trec-forms';
    if (path.includes('/queue')) return 'queue';
    return 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const newPath = value === 'overview' 
      ? '/resale' 
      : `/resale/${value}`;
    
    navigate(newPath, { replace: true });
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Resale Management</h1>
          <p className="text-muted-foreground">Process and manage property resale documentation</p>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="gap-2" onClick={() => navigate('/resale/wizard')}>
                  <Plus className="h-4 w-4" />
                  New Resale Request
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-50">
                <p>Create a new resale documentation request</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resale Documentation Center</CardTitle>
          <CardDescription>
            Manage all resale-related documentation and processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>View all resale activities at a glance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="certificate" className="flex items-center gap-1">
                      <FileCheck className="h-4 w-4" />
                      <span className="hidden md:inline">Certificates</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>Manage resale certificates for property transfers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="questionnaire" className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      <span className="hidden md:inline">Questionnaires</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>Complete and manage condo questionnaires for lenders</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="inspection" className="flex items-center gap-1">
                      <FileSearch className="h-4 w-4" />
                      <span className="hidden md:inline">Inspections</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>Schedule and track property inspections for resales</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="statements" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className="hidden md:inline">Statements</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>Generate account statements for closing transactions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="trec-forms" className="flex items-center gap-1">
                      <FileBadge className="h-4 w-4" />
                      <span className="hidden md:inline">TREC Forms</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>Access Texas Real Estate Commission forms</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="queue" className="flex items-center gap-1">
                      <ListOrdered className="h-4 w-4" />
                      <span className="hidden md:inline">Order Queue</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p>Track and manage all pending resale document orders</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.overview.view">
                <ResaleOverview onNavigate={handleTabChange} />
              </ResaleRbacWrapper>
            </TabsContent>
            
            <TabsContent value="certificate" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.certificate.view">
                <ResaleCertificate />
              </ResaleRbacWrapper>
            </TabsContent>
            
            <TabsContent value="questionnaire" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.questionnaire.view">
                <CondoQuestionnaire />
              </ResaleRbacWrapper>
            </TabsContent>
            
            <TabsContent value="inspection" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.inspection.view">
                <PropertyInspection />
              </ResaleRbacWrapper>
            </TabsContent>
            
            <TabsContent value="statements" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.statements.view">
                <AccountStatement />
              </ResaleRbacWrapper>
            </TabsContent>
            
            <TabsContent value="trec-forms" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.trec.view">
                <TrecForms />
              </ResaleRbacWrapper>
            </TabsContent>
            
            <TabsContent value="queue" className="pt-4">
              <ResaleRbacWrapper requiredPermission="resale.queue.view">
                <ResaleOrderQueue />
              </ResaleRbacWrapper>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResaleDashboard;
