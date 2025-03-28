import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck, FileQuestion, FileSearch, FileText, FileBadge } from 'lucide-react';
import ResaleCertificate from '@/components/resale/ResaleCertificate';
import CondoQuestionnaire from '@/components/resale/CondoQuestionnaire';
import PropertyInspection from '@/components/resale/PropertyInspection';
import AccountStatement from '@/components/resale/AccountStatement';
import TrecForms from '@/components/resale/TrecForms';
import ResaleRbacWrapper from '@/components/resale/ResaleRbacWrapper';

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
        
        <Button className="gap-2" onClick={() => navigate('/resale/wizard')}>
          <Plus className="h-4 w-4" />
          New Resale Request
        </Button>
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
            <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="certificate" className="flex items-center gap-1">
                <FileCheck className="h-4 w-4" />
                <span className="hidden md:inline">Certificates</span>
              </TabsTrigger>
              <TabsTrigger value="questionnaire" className="flex items-center gap-1">
                <FileQuestion className="h-4 w-4" />
                <span className="hidden md:inline">Questionnaires</span>
              </TabsTrigger>
              <TabsTrigger value="inspection" className="flex items-center gap-1">
                <FileSearch className="h-4 w-4" />
                <span className="hidden md:inline">Inspections</span>
              </TabsTrigger>
              <TabsTrigger value="statements" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Statements</span>
              </TabsTrigger>
              <TabsTrigger value="trec-forms" className="flex items-center gap-1">
                <FileBadge className="h-4 w-4" />
                <span className="hidden md:inline">TREC Forms</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <ResaleOverview onNavigate={handleTabChange} />
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ResaleOverview = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const resaleModules = [
    {
      id: 'certificate',
      title: 'Resale Certificates',
      description: 'Generate and manage property resale certificates',
      icon: <FileCheck className="h-8 w-8 text-blue-500" />,
      count: 12
    },
    {
      id: 'questionnaire',
      title: 'Condo Questionnaires',
      description: 'Complete and track lender questionnaires',
      icon: <FileQuestion className="h-8 w-8 text-purple-500" />,
      count: 8
    },
    {
      id: 'inspection',
      title: 'Property Inspections',
      description: 'Schedule and document property inspections',
      icon: <FileSearch className="h-8 w-8 text-green-500" />,
      count: 6
    },
    {
      id: 'statements',
      title: 'Account Statements',
      description: 'Generate account statements for closing',
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      count: 15
    },
    {
      id: 'trec-forms',
      title: 'TREC Forms',
      description: 'Standard Texas Real Estate Commission forms',
      icon: <FileBadge className="h-8 w-8 text-red-500" />,
      count: 4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resaleModules.map(module => (
        <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(module.id)}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              {module.icon}
              <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">{module.count}</span>
            </div>
            <CardTitle className="text-xl mt-2">{module.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{module.description}</CardDescription>
            <Button variant="link" className="mt-2 p-0" onClick={() => onNavigate(module.id)}>
              View {module.title}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResaleDashboard;
