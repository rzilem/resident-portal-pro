
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useComposer } from './ComposerContext';
import TemplateSelector from './TemplateSelector';
import { filterTemplatesByCommunity } from './ComposerUtils';
import { MessageTemplate } from '@/pages/communications/types';
import { Bookmark, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubjectFieldProps {
  templates: MessageTemplate[];
}

const SubjectField: React.FC<SubjectFieldProps> = ({ templates }) => {
  const { 
    subject, 
    setSubject, 
    content, 
    setContent, 
    selectedCommunity, 
    format, 
    setFormat,
    messageType
  } = useComposer();
  
  const [showTemplateConfirm, setShowTemplateConfirm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  
  // Filter templates based on the selected community and message type
  const filteredTemplates = filterTemplatesByCommunity(templates, selectedCommunity)
    // Only show email templates for email, SMS templates for SMS
    .filter(template => {
      // If the template name or description mentions SMS, it's an SMS template
      const isSmsTemplate = 
        template.name.toLowerCase().includes('sms') || 
        template.description.toLowerCase().includes('sms') ||
        template.category.toLowerCase().includes('sms');
      
      return messageType === 'sms' ? isSmsTemplate : !isSmsTemplate;
    });

  const handleTemplateSelect = (template: MessageTemplate) => {
    // If there's already content, show confirmation dialog
    if (subject.trim() || content.trim()) {
      setSelectedTemplate(template);
      setShowTemplateConfirm(true);
    } else {
      // No existing content, apply template directly
      applyTemplate(template);
    }
  };
  
  const applyTemplate = (template: MessageTemplate) => {
    setSubject(template.subject);
    setContent(template.content);
    
    // Determine template format and set it
    const isHtml = template.content.includes('<') && 
                   template.content.includes('>') && 
                   template.content.includes('</');
    
    if (isHtml && format !== 'html') {
      setFormat('html');
      toast.info('Switched to HTML format to match template');
    } else if (!isHtml && format !== 'plain') {
      setFormat('plain');
      toast.info('Switched to plain text format to match template');
    }
    
    toast.success(`Template "${template.name}" applied`);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="subject">Subject</Label>
          <TemplateSelector 
            templates={filteredTemplates}
            onSelectTemplate={handleTemplateSelect}
            currentCommunity={selectedCommunity}
          />
        </div>
        <div className="relative">
          <Input
            id="subject"
            placeholder="Enter message subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={!subject.trim() ? "pr-10" : ""}
            required
          />
          {!subject.trim() && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          )}
        </div>
        {subject.trim() && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Check className="h-3 w-3 mr-1 text-green-500" />
            Subject line added
          </div>
        )}
      </div>
      
      {/* Template confirmation dialog */}
      <Dialog open={showTemplateConfirm} onOpenChange={setShowTemplateConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Template?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Applying template "{selectedTemplate?.name}" will replace your current subject and content.
              Are you sure you want to continue?
            </p>
            <div className="border rounded-md p-3 space-y-2 bg-muted/30">
              <div className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{selectedTemplate?.name}</span>
              </div>
              <div className="text-sm">
                <div><span className="text-muted-foreground">Subject:</span> {selectedTemplate?.subject}</div>
                <div><span className="text-muted-foreground">Category:</span> {selectedTemplate?.category}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTemplateConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate) {
                  applyTemplate(selectedTemplate);
                  setShowTemplateConfirm(false);
                  setSelectedTemplate(null);
                }
              }}
            >
              Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectField;
