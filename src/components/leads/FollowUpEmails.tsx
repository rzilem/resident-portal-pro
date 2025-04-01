
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Clock, Edit, Trash, MoreHorizontal, Copy, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  createdAt: string;
}

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  steps: {
    id: string;
    templateId: string;
    delay: number;
    delayUnit: 'hours' | 'days' | 'weeks';
  }[];
  active: boolean;
  createdAt: string;
}

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Initial Consultation Follow-up',
    subject: 'Thank you for your time today!',
    body: '<p>Dear {firstName},</p><p>Thank you for meeting with us today to discuss your property management needs. We\'re excited about the possibility of working with you and your association.</p><p>I\'ve attached some additional information about our services that I think will be helpful. Please feel free to reach out if you have any questions.</p><p>Best regards,<br/>Your Name</p>',
    category: 'follow-up',
    createdAt: new Date().toISOString()
  },
  {
    id: 'template-2',
    name: 'Proposal Follow-up',
    subject: 'Following up on our proposal',
    body: '<p>Dear {firstName},</p><p>I wanted to follow up on the proposal we sent last week. Do you have any questions or concerns that I can address?</p><p>We\'re excited about the possibility of working with {companyName} and would love to schedule a time to discuss next steps.</p><p>Best regards,<br/>Your Name</p>',
    category: 'follow-up',
    createdAt: new Date().toISOString()
  },
  {
    id: 'template-3',
    name: 'Monthly Check-in',
    subject: 'Checking in - how can we help?',
    body: '<p>Hello {firstName},</p><p>I hope this email finds you well. I wanted to check in and see if there\'s anything our team can assist you with regarding your property management needs.</p><p>We\'re always here to help, so please don\'t hesitate to reach out.</p><p>Best regards,<br/>Your Name</p>',
    category: 'nurture',
    createdAt: new Date().toISOString()
  }
];

const mockEmailSequences: EmailSequence[] = [
  {
    id: 'sequence-1',
    name: 'New Lead Nurture Sequence',
    description: 'A sequence to nurture new leads after initial contact',
    steps: [
      {
        id: 'step-1',
        templateId: 'template-1',
        delay: 0,
        delayUnit: 'hours'
      },
      {
        id: 'step-2',
        templateId: 'template-2',
        delay: 3,
        delayUnit: 'days'
      },
      {
        id: 'step-3',
        templateId: 'template-3',
        delay: 1,
        delayUnit: 'weeks'
      }
    ],
    active: true,
    createdAt: new Date().toISOString()
  }
];

const FollowUpEmails: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('templates');
  const [emailTemplates, setEmailTemplates] = useState(mockEmailTemplates);
  const [emailSequences, setEmailSequences] = useState(mockEmailSequences);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [showAddSequenceDialog, setShowAddSequenceDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  
  // Filter templates based on search term
  const filteredTemplates = emailTemplates.filter(template => 
    template.name.toLowerCase().includes(search.toLowerCase()) ||
    template.subject.toLowerCase().includes(search.toLowerCase()) ||
    template.category.toLowerCase().includes(search.toLowerCase())
  );
  
  // Filter sequences based on search term
  const filteredSequences = emailSequences.filter(sequence => 
    sequence.name.toLowerCase().includes(search.toLowerCase()) ||
    sequence.description.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleTemplateAction = (action: 'edit' | 'delete' | 'duplicate', template: EmailTemplate) => {
    if (action === 'edit') {
      setCurrentTemplate(template);
      setShowAddTemplateDialog(true);
    } else if (action === 'delete') {
      setEmailTemplates(emailTemplates.filter(t => t.id !== template.id));
      toast.success('Email template deleted');
    } else if (action === 'duplicate') {
      const newTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString()
      };
      setEmailTemplates([...emailTemplates, newTemplate]);
      toast.success('Email template duplicated');
    }
  };
  
  const handleSequenceAction = (action: 'edit' | 'delete' | 'duplicate' | 'toggle', sequence: EmailSequence) => {
    if (action === 'edit') {
      // Edit sequence (would open a dialog in a real app)
      toast.success('Edit sequence dialog would open');
    } else if (action === 'delete') {
      setEmailSequences(emailSequences.filter(s => s.id !== sequence.id));
      toast.success('Email sequence deleted');
    } else if (action === 'duplicate') {
      const newSequence = {
        ...sequence,
        id: `sequence-${Date.now()}`,
        name: `${sequence.name} (Copy)`,
        createdAt: new Date().toISOString()
      };
      setEmailSequences([...emailSequences, newSequence]);
      toast.success('Email sequence duplicated');
    } else if (action === 'toggle') {
      setEmailSequences(emailSequences.map(s => 
        s.id === sequence.id ? { ...s, active: !s.active } : s
      ));
      toast.success(`Sequence ${sequence.active ? 'deactivated' : 'activated'}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddSequenceDialog(true)}>
            <Clock className="h-4 w-4 mr-2" />
            New Sequence
          </Button>
          <Button onClick={() => {
            setCurrentTemplate(null);
            setShowAddTemplateDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="sequences">Follow-up Sequences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {template.category}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTemplateAction('edit', template)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTemplateAction('duplicate', template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleTemplateAction('delete', template)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium mb-1">Subject:</h4>
                    <p className="text-sm text-muted-foreground mb-3">{template.subject}</p>
                    <h4 className="text-sm font-medium mb-1">Preview:</h4>
                    <div className="text-sm text-muted-foreground border rounded-md p-2 h-24 overflow-hidden">
                      <div dangerouslySetInnerHTML={{ __html: template.body.substring(0, 150) + '...' }} />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No email templates found</p>
                  <Button onClick={() => {
                    setCurrentTemplate(null);
                    setShowAddTemplateDialog(true);
                  }}>
                    Create Your First Template
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="sequences" className="pt-4">
          <div className="space-y-4">
            {filteredSequences.length > 0 ? (
              filteredSequences.map((sequence) => (
                <Card key={sequence.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {sequence.name}
                          <Badge className="ml-2" variant={sequence.active ? "default" : "outline"}>
                            {sequence.active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sequence.description}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSequenceAction('edit', sequence)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSequenceAction('duplicate', sequence)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSequenceAction('toggle', sequence)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {sequence.active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleSequenceAction('delete', sequence)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium mb-2">Sequence steps:</h4>
                    <div className="space-y-3">
                      {sequence.steps.map((step, index) => {
                        const template = emailTemplates.find(t => t.id === step.templateId);
                        return (
                          <div key={step.id} className="flex items-center gap-3 border rounded-md p-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{template?.name || 'Unknown template'}</p>
                              <p className="text-xs text-muted-foreground">
                                {step.delay > 0 
                                  ? `Send after ${step.delay} ${step.delayUnit}` 
                                  : 'Send immediately'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No email sequences found</p>
                  <Button onClick={() => setShowAddSequenceDialog(true)}>
                    Create Your First Sequence
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Template Dialog */}
      <Dialog open={showAddTemplateDialog} onOpenChange={setShowAddTemplateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentTemplate ? 'Edit Email Template' : 'Create Email Template'}</DialogTitle>
            <DialogDescription>
              Create an email template to use in your follow-up sequences
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  defaultValue={currentTemplate?.name || ''}
                  placeholder="Enter template name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-category">Category</Label>
                <Select defaultValue={currentTemplate?.category || 'follow-up'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="nurture">Nurture</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-subject">Subject Line</Label>
              <Input
                id="template-subject"
                defaultValue={currentTemplate?.subject || ''}
                placeholder="Enter email subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email Body</Label>
              <div className="border rounded-md p-4 min-h-[200px]">
                {/* In a real app, this would be a rich text editor */}
                <textarea
                  className="w-full min-h-[200px] resize-none border-0 focus:outline-none"
                  defaultValue={currentTemplate?.body || ''}
                  placeholder="Enter email content..."
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Available merge tags: {'{firstName}'}, {'{lastName}'}, {'{companyName}'}, {'{email}'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success(`Email template ${currentTemplate ? 'updated' : 'created'} successfully`);
              setShowAddTemplateDialog(false);
            }}>
              {currentTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Sequence Dialog */}
      <Dialog open={showAddSequenceDialog} onOpenChange={setShowAddSequenceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Email Sequence</DialogTitle>
            <DialogDescription>
              Set up an automated sequence of emails to send to leads
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sequence-name">Sequence Name</Label>
              <Input
                id="sequence-name"
                placeholder="Enter sequence name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sequence-description">Description</Label>
              <Input
                id="sequence-description"
                placeholder="Enter sequence description"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Email Steps</Label>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              
              <div className="space-y-4 border rounded-md p-4">
                <p className="text-center text-muted-foreground">
                  No steps added yet. Click "Add Step" to create your sequence.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSequenceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Email sequence created successfully');
              setShowAddSequenceDialog(false);
            }}>
              Create Sequence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpEmails;
