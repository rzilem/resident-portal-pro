
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LetterTemplate } from '@/types/letter-templates';
import HtmlEditor from '@/components/communications/HtmlEditor';
import { toast } from 'sonner';
import { LetterCategoryOptions } from '@/types/letter-templates';
import MergeTagsDialog from '@/components/communications/MergeTagsDialog';
import { MergeTag } from '@/types/mergeTags';
import { Tags } from 'lucide-react';

interface LetterTemplateEditorProps {
  selectedTemplate: LetterTemplate | null;
  onSave: (template: LetterTemplate) => void;
  onCancel: () => void;
  isReadOnly?: boolean;
}

const LetterTemplateEditor: React.FC<LetterTemplateEditorProps> = ({ 
  selectedTemplate, 
  onSave,
  onCancel,
  isReadOnly = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);
  
  // Reset form when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      setName(selectedTemplate.name);
      setDescription(selectedTemplate.description);
      setCategory(selectedTemplate.category);
      setContent(selectedTemplate.content);
    } else {
      setName('');
      setDescription('');
      setCategory('Compliance'); // Default category
      setContent('<p>Enter your letter content here...</p>');
    }
  }, [selectedTemplate]);
  
  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter template content');
      return;
    }
    
    const templateData: LetterTemplate = {
      id: selectedTemplate?.id || '',
      name,
      description,
      category,
      content,
      createdAt: selectedTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(templateData);
  };
  
  const handleMergeTagSelect = (tag: MergeTag) => {
    setContent(prev => `${prev} ${tag.tag} `);
    setIsMergeTagsDialogOpen(false);
  };
  
  // If no template is selected and in read-only mode, show an empty state
  if (!selectedTemplate && isReadOnly) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center h-[600px] text-center">
          <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
          <p className="text-muted-foreground">
            Select a template from the list to view its details.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            In read-only mode, you can view templates but not edit them.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // If no template is selected and not in read-only mode, show the create new template form
  if (!selectedTemplate && !isReadOnly) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Create New Template</h3>
            <p className="text-sm text-muted-foreground">
              Create a new letter template for your community communications
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g., First Violation Notice"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {LetterCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Briefly describe the purpose of this template"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Template Content</Label>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsMergeTagsDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Tags className="h-4 w-4" />
                  Insert Merge Tags
                </Button>
              </div>
              <HtmlEditor 
                value={content} 
                onChange={setContent} 
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <Button onClick={handleSave}>Create Template</Button>
            </div>
          </div>
        </CardContent>
        
        <MergeTagsDialog
          open={isMergeTagsDialogOpen}
          onOpenChange={setIsMergeTagsDialogOpen}
          onSelectTag={handleMergeTagSelect}
        />
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {isReadOnly ? 'View Template' : 'Edit Template'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isReadOnly
              ? 'View letter template details and content'
              : 'Edit your letter template details and content'
            }
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., First Violation Notice"
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {isReadOnly ? (
                <Input 
                  id="category-readonly" 
                  value={category} 
                  readOnly 
                  disabled 
                />
              ) : (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {LetterCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Briefly describe the purpose of this template"
              rows={2}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Template Content</Label>
              {!isReadOnly && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsMergeTagsDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Tags className="h-4 w-4" />
                  Insert Merge Tags
                </Button>
              )}
            </div>
            <HtmlEditor 
              value={content} 
              onChange={setContent} 
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isReadOnly && (
              <Button onClick={handleSave}>
                Update Template
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      {!isReadOnly && (
        <MergeTagsDialog
          open={isMergeTagsDialogOpen}
          onOpenChange={setIsMergeTagsDialogOpen}
          onSelectTag={handleMergeTagSelect}
        />
      )}
    </Card>
  );
};

export default LetterTemplateEditor;
