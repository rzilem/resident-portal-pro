
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag as TagIcon } from 'lucide-react';
import HtmlEditor from '../HtmlEditor';
import MergeTagsDialog from '../MergeTagsDialog';
import { MessageTemplate, SAMPLE_COMMUNITIES, CategoryOptions } from './types';
import { MergeTag } from '@/types/mergeTags';

interface TemplateEditorDialogProps {
  type: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  template: {
    name: string;
    description: string;
    subject: string;
    content: string;
    category: string;
    communities: string[];
    isHtmlFormat: boolean;
  };
  setTemplate: {
    setName: (value: string) => void;
    setDescription: (value: string) => void;
    setSubject: (value: string) => void;
    setContent: (value: string) => void;
    setCategory: (value: string) => void;
    setCommunities: (fn: (prev: string[]) => string[]) => void;
    setIsHtmlFormat: (value: boolean) => void;
  };
}

const TemplateEditorDialog: React.FC<TemplateEditorDialogProps> = ({
  type,
  isOpen,
  onClose,
  onSave,
  template,
  setTemplate
}) => {
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);

  const handleCommunityToggle = (communityId: string) => {
    setTemplate.setCommunities(prev => {
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

  const handleInsertMergeTag = (tag: MergeTag) => {
    const activeElement = document.activeElement;
    const subjectInput = document.getElementById('template-subject');
    
    if (activeElement === subjectInput) {
      // Fix: Instead of passing a function, compute the new value and pass it directly
      const cursorPosition = (activeElement as HTMLInputElement).selectionStart || 0;
      const newSubject = template.subject.substring(0, cursorPosition) + 
                          tag.tag + 
                          template.subject.substring(cursorPosition);
      setTemplate.setSubject(newSubject);
    } else {
      if (template.isHtmlFormat) {
        // Fix: Pass the new string value directly instead of a function
        setTemplate.setContent(template.content + ' ' + tag.tag + ' ');
      } else {
        // Fix: Pass the new string value directly instead of a function
        setTemplate.setContent(template.content + ' ' + tag.tag + ' ');
      }
    }
    setIsMergeTagsDialogOpen(false);
  };

  return (
    <>
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
                  value={template.name} 
                  onChange={(e) => setTemplate.setName(e.target.value)} 
                  placeholder="e.g., Welcome New Resident"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-category">Category</Label>
                <Select value={template.category} onValueChange={setTemplate.setCategory}>
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
                value={template.description} 
                onChange={(e) => setTemplate.setDescription(e.target.value)} 
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
                      checked={template.communities.includes(community.id)}
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
                value={template.subject} 
                onChange={(e) => setTemplate.setSubject(e.target.value)} 
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
                    value={template.isHtmlFormat ? 'html' : 'plain'} 
                    onValueChange={(v) => setTemplate.setIsHtmlFormat(v === 'html')}
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
              
              {template.isHtmlFormat ? (
                <Card className="border">
                  <HtmlEditor 
                    value={template.content} 
                    onChange={setTemplate.setContent}
                  />
                </Card>
              ) : (
                <Textarea 
                  id="template-content" 
                  value={template.content} 
                  onChange={(e) => setTemplate.setContent(e.target.value)} 
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
      </Dialog>
      
      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleInsertMergeTag}
      />
    </>
  );
};

export default TemplateEditorDialog;
