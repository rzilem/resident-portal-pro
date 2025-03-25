import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileEdit, Trash2, Tag as TagIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';
import HtmlEditor from './HtmlEditor';
import MergeTagsDialog from './MergeTagsDialog';
import { MergeTag } from '@/types/mergeTags';
import { Checkbox } from '@/components/ui/checkbox';

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  communities?: string[]; // Array of community IDs or 'all'
}

interface MessageTemplatesProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  templates: MessageTemplate[];
  onCreateTemplate: (template: MessageTemplate) => void;
  onUpdateTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const SAMPLE_COMMUNITIES = [
  { id: 'all', name: 'All Communities' },
  { id: 'comm1', name: 'Riverside HOA' },
  { id: 'comm2', name: 'Oakwood Condos' },
  { id: 'comm3', name: 'Mountain View Estates' },
  { id: 'comm4', name: 'Harbor Point' },
];

const CategoryOptions = [
  { value: 'Welcome', label: 'Welcome' },
  { value: 'Meetings', label: 'Meetings' },
  { value: 'Financial', label: 'Financial' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Violations', label: 'Violations' },
  { value: 'Events', label: 'Events' },
  { value: 'General', label: 'General' },
];

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ 
  onSelectTemplate,
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateCategory, setTemplateCategory] = useState('General');
  const [isHtmlFormat, setIsHtmlFormat] = useState(true);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(['all']);
  
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);

  const resetForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateSubject('');
    setTemplateContent('');
    setTemplateCategory('General');
    setSelectedCommunities(['all']);
    setIsHtmlFormat(true);
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim() || !templateSubject.trim() || !templateContent.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }

    const newTemplate: MessageTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory,
      communities: selectedCommunities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateTemplate(newTemplate);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Template created successfully');
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;
    
    if (!templateName.trim() || !templateSubject.trim() || !templateContent.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }

    const updatedTemplate: MessageTemplate = {
      ...selectedTemplate,
      name: templateName,
      description: templateDescription,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory,
      communities: selectedCommunities,
      updatedAt: new Date().toISOString()
    };

    onUpdateTemplate(updatedTemplate);
    setIsEditDialogOpen(false);
    resetForm();
    toast.success('Template updated successfully');
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    onDeleteTemplate(id);
    toast.success('Template deleted');
  };

  const openEditDialog = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateSubject(template.subject);
    setTemplateContent(template.content);
    setTemplateCategory(template.category);
    setSelectedCommunities(template.communities || ['all']);
    setIsHtmlFormat(true);
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (template: MessageTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleInsertMergeTag = (tag: MergeTag) => {
    const activeElement = document.activeElement;
    const subjectInput = document.getElementById('template-subject');
    
    if (activeElement === subjectInput) {
      setTemplateSubject(prev => {
        const cursorPosition = (activeElement as HTMLInputElement).selectionStart || 0;
        return prev.substring(0, cursorPosition) + tag.tag + prev.substring(cursorPosition);
      });
    } else {
      if (isHtmlFormat) {
        setTemplateContent(prev => prev + ' ' + tag.tag + ' ');
      } else {
        setTemplateContent(prev => prev + ' ' + tag.tag + ' ');
      }
    }
    setIsMergeTagsDialogOpen(false);
  };

  const handleCommunityToggle = (communityId: string) => {
    setSelectedCommunities(prev => {
      if (communityId === 'all') {
        return ['all'];
      }
      
      if (prev.includes('all') && communityId !== 'all') {
        return [communityId];
      }
      
      const newSelection = prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId];
        
      return newSelection.length === 0 ? ['all'] : newSelection;
    });
  };

  const templateDialog = (
    type: 'create' | 'edit',
    isOpen: boolean,
    onClose: () => void,
    onSave: () => void
  ) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{type === 'create' ? 'Create New Template' : 'Edit Template'}</DialogTitle>
          <DialogDescription>
            Create reusable message templates with merge tags for personalized communications.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name*</Label>
              <Input 
                id="template-name" 
                value={templateName} 
                onChange={(e) => setTemplateName(e.target.value)} 
                placeholder="e.g., Welcome New Resident"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-category">Category</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger id="template-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CategoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea 
              id="template-description" 
              value={templateDescription} 
              onChange={(e) => setTemplateDescription(e.target.value)} 
              placeholder="Brief description of when to use this template"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Available Communities</Label>
            <div className="border rounded-md p-3 space-y-2">
              {SAMPLE_COMMUNITIES.map(community => (
                <div className="flex items-center space-x-2" key={community.id}>
                  <Checkbox 
                    id={`community-${community.id}`} 
                    checked={selectedCommunities.includes(community.id)}
                    onCheckedChange={() => handleCommunityToggle(community.id)}
                  />
                  <Label htmlFor={`community-${community.id}`} className="cursor-pointer">
                    {community.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="template-subject">Subject Line*</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsMergeTagsDialogOpen(true)}
              >
                <TagIcon className="mr-2 h-4 w-4" />
                Insert Merge Tag
              </Button>
            </div>
            <Input 
              id="template-subject" 
              value={templateSubject} 
              onChange={(e) => setTemplateSubject(e.target.value)} 
              placeholder="e.g., Welcome to {{association.name}}"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="template-content">Message Content*</Label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMergeTagsDialogOpen(true)}
                >
                  <TagIcon className="mr-2 h-4 w-4" />
                  Insert Merge Tag
                </Button>
                <Select 
                  value={isHtmlFormat ? 'html' : 'plain'} 
                  onValueChange={(v) => setIsHtmlFormat(v === 'html')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    <SelectItem value="html">Rich HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isHtmlFormat ? (
              <Card className="border">
                <HtmlEditor 
                  value={templateContent} 
                  onChange={setTemplateContent}
                />
              </Card>
            ) : (
              <Textarea 
                id="template-content" 
                value={templateContent} 
                onChange={(e) => setTemplateContent(e.target.value)} 
                placeholder="Your message content here. Use merge tags like {{resident.name}} for personalization."
                rows={8}
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>
            {type === 'create' ? 'Create Template' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleInsertMergeTag}
      />
    </Dialog>
  );

  const previewDialog = (
    <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{previewTemplate?.name} - Preview</DialogTitle>
          <DialogDescription>
            Subject: {previewTemplate?.subject}
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-4 my-4 bg-white">
          <div dangerouslySetInnerHTML={{ __html: previewTemplate?.content || '' }} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          {previewTemplate && (
            <Button onClick={() => {
              onSelectTemplate(previewTemplate);
              setIsPreviewDialogOpen(false);
            }}>
              Use Template
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Message Templates</h2>
        <Button onClick={() => {
          resetForm();
          setIsCreateDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg truncate">{template.name}</CardTitle>
              <CardDescription className="truncate">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-2">
              <div className="space-y-1 text-sm">
                <div className="font-medium">Category: {template.category}</div>
                <div className="truncate">Subject: {template.subject}</div>
                <div>
                  {template.communities?.includes('all') 
                    ? 'All Communities' 
                    : template.communities?.map(c => {
                        const community = SAMPLE_COMMUNITIES.find(sc => sc.id === c);
                        return community?.name;
                      }).join(', ') || 'All Communities'}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openPreviewDialog(template)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use
                </Button>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditDialog(template)}
                >
                  <FileEdit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {templateDialog('create', isCreateDialogOpen, () => setIsCreateDialogOpen(false), handleCreateTemplate)}
      {templateDialog('edit', isEditDialogOpen, () => setIsEditDialogOpen(false), handleEditTemplate)}
      {previewDialog}
      
      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleInsertMergeTag}
      />
    </div>
  );
};

export default MessageTemplates;
