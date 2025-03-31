
import React, { useState, useEffect, useRef } from 'react';
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
import HtmlEditor from '@/components/communications/editor';
import { LetterTemplate, LetterCategoryOptions } from '@/types/letter-templates';
import { AlertCircle, Save, Eye, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MergeTagsDialog from '@/components/communications/MergeTagsDialog';
import { MergeTag } from '@/types/mergeTags';
import { toast } from 'sonner';

interface LetterTemplateEditorProps {
  selectedTemplate: LetterTemplate | null;
  onSave: (template: Omit<LetterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  onCancel: () => void;
  onPreview?: () => void;
  isReadOnly?: boolean;
}

const LetterTemplateEditor: React.FC<LetterTemplateEditorProps> = ({
  selectedTemplate,
  onSave,
  onCancel,
  onPreview,
  isReadOnly = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const initialValues = useRef({ name: '', description: '', category: '', content: '' });
  const editorRef = useRef<any>(null);
  
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);
  
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
      setCategory('General');
      setContent('');
      initialValues.current = { name: '', description: '', category: 'General', content: '' };
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
  
  const handleMergeTagSelect = (tag: MergeTag) => {
    if (editorRef.current?.insertAtCursor) {
      editorRef.current.insertAtCursor(tag.tag);
    } else {
      // Fallback - append to content
      setContent(prev => prev + ' ' + tag.tag);
    }
    setIsMergeTagsDialogOpen(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      return;
    }
    
    // Validate form
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
        content
      });
      setHasChanges(false);
      toast.success(`Template ${selectedTemplate ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
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
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="content">Letter Content</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMergeTagsDialogOpen(true)}
                  disabled={isReadOnly}
                >
                  Insert Merge Tag
                </Button>
              </div>
              
              <div className="min-h-[300px]">
                <HtmlEditor 
                  value={content} 
                  onChange={setContent}
                  readOnly={isReadOnly}
                  onSave={handleSubmit}
                  ref={editorRef}
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
      
      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleMergeTagSelect}
      />
    </>
  );
};

export default LetterTemplateEditor;
