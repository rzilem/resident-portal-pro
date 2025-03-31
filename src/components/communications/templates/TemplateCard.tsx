
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit, Mail, Trash2 } from 'lucide-react';
import { MessageTemplate } from '@/pages/communications/types';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface TemplateCardProps {
  template: MessageTemplate;
  onSelect: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (templateId: string) => Promise<void>;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(template.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-medium">{template.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {template.description || 'No description'}
              </p>
            </div>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-xs">
              {template.category}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-2 flex-1">
          <p className="text-sm font-medium mb-1">Subject:</p>
          <p className="text-sm mb-3 line-clamp-1">{template.subject}</p>
          <p className="text-sm font-medium mb-1">Preview:</p>
          <div
            className="text-xs text-muted-foreground line-clamp-3 overflow-hidden"
            onClick={() => setPreviewOpen(true)}
          >
            {template.content?.replace(/<[^>]*>/g, '') || 'No content'}
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 flex gap-2 justify-between">
          <TooltipButton
            variant="outline"
            size="sm"
            onClick={() => onEdit(template)}
            tooltipText="Edit template"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </TooltipButton>
          <div className="flex gap-2">
            <TooltipButton
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              tooltipText="Delete template"
            >
              <Trash2 className="h-4 w-4" />
            </TooltipButton>
            <TooltipButton
              size="sm"
              onClick={() => onSelect(template)}
              tooltipText="Use template"
            >
              <Mail className="h-4 w-4 mr-1" />
              Use
            </TooltipButton>
          </div>
        </CardFooter>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>{template.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Subject:</h4>
              <p>{template.subject}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Content:</h4>
              <div
                className="border rounded-md p-4 overflow-auto max-h-96"
                dangerouslySetInnerHTML={{ __html: template.content }}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex gap-2 justify-between">
            <Button
              variant="outline"
              onClick={() => onEdit(template)}
              className="sm:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
            <Button onClick={() => {
              setPreviewOpen(false);
              onSelect(template);
            }}>
              <Mail className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{template.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateCard;
