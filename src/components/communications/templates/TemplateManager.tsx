
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageTemplate } from '@/pages/communications/types';
import TemplateCard from './TemplateCard';
import TemplateDialog from './TemplateDialog';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface TemplateManagerProps {
  templates: MessageTemplate[];
  onSelectTemplate: (template: MessageTemplate) => void;
  onCreateTemplate: (template: MessageTemplate) => Promise<void>;
  onUpdateTemplate: (template: MessageTemplate) => Promise<void>;
  onDeleteTemplate: (templateId: string) => Promise<void>;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onSelectTemplate,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  // Get unique categories
  const categories = Array.from(
    new Set(['all', ...templates.map((t) => t.category)])
  );

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setDialogOpen(true);
  };

  const handleEdit = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleSaveTemplate = async (template: MessageTemplate) => {
    if (editingTemplate) {
      await onUpdateTemplate(template);
    } else {
      await onCreateTemplate(template);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <TooltipButton
          tooltipText="Create new template"
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </TooltipButton>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4 overflow-auto pb-px flex flex-nowrap h-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="capitalize whitespace-nowrap"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onSelectTemplate}
              onEdit={handleEdit}
              onDelete={onDeleteTemplate}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No templates match "${searchQuery}"`
                : selectedCategory !== 'all'
                ? `No templates in ${selectedCategory} category`
                : 'No templates available'}
            </p>
            <Button variant="outline" onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      <TemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default TemplateManager;
