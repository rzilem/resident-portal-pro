
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Search, 
  Mail, 
  Clock, 
  ListChecks,
  Trash,
  Plus,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const FollowUpEmails: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [search, setSearch] = useState('');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="sequences">Email Sequences</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create {activeTab === 'templates' ? 'Template' : 'Sequence'}
            </Button>
          </div>
        </div>
        
        <TabsContent value="templates" className="space-y-6">
          <EmailTemplates search={search} />
        </TabsContent>
        
        <TabsContent value="sequences" className="space-y-6">
          <EmailSequences search={search} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmailTemplates: React.FC<{ search: string }> = ({ search }) => {
  // Mock templates data
  const templates = [
    {
      id: '1',
      name: 'Initial Contact',
      subject: 'Following up on our conversation',
      category: 'Lead Nurturing',
      createdAt: '2023-05-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Proposal Follow-up',
      subject: 'Regarding the proposal I shared',
      category: 'Proposal',
      createdAt: '2023-06-20T14:45:00Z',
    },
    {
      id: '3',
      name: 'Check-in',
      subject: 'Checking in on your progress',
      category: 'Lead Nurturing',
      createdAt: '2023-07-05T09:15:00Z',
    },
  ];
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(search.toLowerCase()) ||
    template.subject.toLowerCase().includes(search.toLowerCase()) ||
    template.category.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map(template => (
        <Card key={template.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{template.category}</p>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-sm mb-2">Subject: {template.subject}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Created on {new Date(template.createdAt).toLocaleDateString()}
            </p>
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline">Edit Template</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredTemplates.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {search 
                ? 'No templates match your search criteria' 
                : 'No email templates found'}
            </p>
            <Button>
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const EmailSequences: React.FC<{ search: string }> = ({ search }) => {
  // Mock sequences data
  const sequences = [
    {
      id: '1',
      name: 'New Lead Nurturing',
      description: 'A 3-email sequence for new leads',
      steps: [
        { id: '1', templateId: '1', delay: 1, delayUnit: 'days' },
        { id: '2', templateId: '2', delay: 3, delayUnit: 'days' },
        { id: '3', templateId: '3', delay: 7, delayUnit: 'days' },
      ],
      active: true,
      createdAt: '2023-05-20T11:30:00Z',
    },
    {
      id: '2',
      name: 'Proposal Follow-up',
      description: 'Follow up after sending a proposal',
      steps: [
        { id: '1', templateId: '2', delay: 2, delayUnit: 'days' },
        { id: '2', templateId: '3', delay: 5, delayUnit: 'days' },
      ],
      active: false,
      createdAt: '2023-06-25T13:45:00Z',
    },
  ];
  
  const filteredSequences = sequences.filter(sequence => 
    sequence.name.toLowerCase().includes(search.toLowerCase()) ||
    sequence.description.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSequences.map(sequence => (
        <Card key={sequence.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg">{sequence.name}</CardTitle>
              <div className={`px-2 py-1 rounded-full text-xs ${
                sequence.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {sequence.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {sequence.description}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <ListChecks className="h-4 w-4 text-muted-foreground" />
                <span>{sequence.steps.length} emails</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Runs for {sequence.steps.reduce((acc, step) => acc + step.delay, 0)} days
                </span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Created on {new Date(sequence.createdAt).toLocaleDateString()}
            </p>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                size="sm" 
                variant={sequence.active ? "default" : "outline"}
                onClick={() => toast.success(`Sequence ${sequence.active ? 'deactivated' : 'activated'}`)}
              >
                {sequence.active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredSequences.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {search 
                ? 'No sequences match your search criteria' 
                : 'No email sequences found'}
            </p>
            <Button>
              Create Your First Sequence
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FollowUpEmails;
