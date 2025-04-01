
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import HtmlEditor from '@/components/communications/HtmlEditor';
import { HtmlTemplate } from '@/services/htmlTemplateService';
import { AlertCircle, Save, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const CATEGORY_OPTIONS = [
  { value: 'Emails', label: 'Emails' },
  { value: 'Letters', label: 'Letters' },
  { value: 'Notices', label: 'Notices' },
  { value: 'Announcements', label: 'Announcements' },
  { value: 'Meeting Minutes', label: 'Meeting Minutes' },
  { value: 'General', label: 'General' },
];

interface HtmlTemplateEditorProps {
  selectedTemplate: HtmlTemplate | null;
  onSave: (template: Omit<HtmlTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  onCancel: () => void;
  onPreview?: () => void;
  isReadOnly?: boolean;
  associationId?: string;
}

const HtmlTemplateEditor: React.FC<HtmlTemplateEditorProps> = ({
  selectedTemplate,
  onSave,
  onCancel,
  onPreview,
  isReadOnly = false,
  associationId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    if (selectedTemplate) {
      setName(selectedTemplate.name);
      setDescription(selectedTemplate.description || '');
      setCategory(selectedTemplate.category);
      setContent(selectedTemplate.content);
      setIsGlobal(selectedTemplate.is_global);
    } else {
      setName('');
      setDescription('');
      setCategory('General');
      setContent('');
      setIsGlobal(false);
    }
    setHasChanges(false);
  }, [selectedTemplate]);
  
  useEffect(() => {
    const hasFieldChanges = 
      (selectedTemplate && (
        name !== selectedTemplate.name ||
        description !== (selectedTemplate.description || '') ||
        category !== selectedTemplate.category ||
        content !== selectedTemplate.content ||
        isGlobal !== selectedTemplate.is_global
      )) || 
      (!selectedTemplate && (
        name !== '' || 
        description !== '' || 
        category !== 'General' || 
        content !== '' ||
        isGlobal !== false
      ));
    
    setHasChanges(hasFieldChanges);
  }, [name, description, category, content, isGlobal, selectedTemplate]);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (isReadOnly) {
      return;
    }
    
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
    
    setIsSaving(true);
    
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category,
        content,
        is_global: isGlobal,
        association_id: isGlobal ? undefined : associationId,
        tags: []
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'Create New Template'}
          </span>
          {selectedTemplate && onPreview && (
            <Button 
              variant="outline" 
              onClick={onPreview}
              disabled={isReadOnly}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isReadOnly && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You are in read-only mode. Sign in to create or edit templates.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              disabled={isReadOnly}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the template"
              disabled={isReadOnly}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
                disabled={isReadOnly}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-2 h-10 mt-auto">
                <input
                  type="checkbox"
                  id="isGlobal"
                  checked={isGlobal}
                  onChange={(e) => setIsGlobal(e.target.checked)}
                  disabled={isReadOnly}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isGlobal" className="cursor-pointer">
                  Make template available to all associations
                </Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="content">HTML Content</Label>
            <div className="min-h-[400px] mt-2">
              <HtmlEditor 
                value={content} 
                onChange={setContent}
                readOnly={isReadOnly}
                onSave={handleSubmit}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSaving || !hasChanges || isReadOnly}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Template'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HtmlTemplateEditor;
