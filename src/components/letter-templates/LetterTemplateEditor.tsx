
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import HtmlEditor from '@/components/communications/editor';
import { LetterTemplate, LetterCategoryOptions } from '@/types/letter-templates';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LetterTemplateEditorProps {
  selectedTemplate: LetterTemplate | null;
  onSave: (template: Omit<LetterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
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
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const initialValues = useRef({ name: '', description: '', category: '', content: '' });
  
  // Reset form when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      setName(selectedTemplate.name);
      setDescription(selectedTemplate.description || '');
      setCategory(selectedTemplate.category);
      setContent(selectedTemplate.content);
      initialValues.current = {
        name: selectedTemplate.name,
        description: selectedTemplate.description || '',
        category: selectedTemplate.category,
        content: selectedTemplate.content
      };
    } else {
      setName('');
      setDescription('');
      setCategory('');
      setContent('');
      initialValues.current = { name: '', description: '', category: '', content: '' };
    }
    setHasChanges(false);
  }, [selectedTemplate]);
  
  // Check for changes
  useEffect(() => {
    const currentValues = { name, description, category, content };
    setHasChanges(
      JSON.stringify(currentValues) !== JSON.stringify(initialValues.current)
    );
  }, [name, description, category, content]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      return;
    }
    
    // Validate form
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    if (!category) {
      alert('Please select a category');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter template content');
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category,
        content
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
        <CardTitle>
          {selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'Create New Template'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isReadOnly && (
          <Alert variant="warning" className="mb-4">
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
                {LetterCategoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="content">Letter Content</Label>
            <div className="mt-2 min-h-[300px]">
              <HtmlEditor 
                value={content} 
                onChange={setContent}
                readOnly={isReadOnly}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || !hasChanges || isReadOnly}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LetterTemplateEditor;
