
import React from 'react';
import TemplateCard from './TemplateCard';
import { MessageTemplate } from '@/pages/communications/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SAMPLE_COMMUNITIES } from './types';

interface TemplatesListProps {
  templates: MessageTemplate[];
  onSelectTemplate: (template: MessageTemplate) => void;
  onEditTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (templateId: string) => Promise<void>;
  onCreateTemplate: () => void;
  searchQuery?: string;
  selectedCategory?: string;
  selectedCommunity?: string;
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onSelectTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCreateTemplate,
  searchQuery = '',
  selectedCategory = '',
  selectedCommunity = '',
}) => {
  // Handle template deletion, making it return a Promise
  const handleDeleteTemplate = async (id: string) => {
    try {
      await onDeleteTemplate(id);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  // Filter templates based on search, category, and community
  const filteredTemplates = templates.filter(template => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    // Filter by community
    const matchesCommunity = !selectedCommunity || 
      selectedCommunity === 'all' ||
      !template.communities || 
      template.communities.includes('all') || 
      template.communities.includes(selectedCommunity);
    
    return matchesSearch && matchesCategory && matchesCommunity;
  });

  // Get community name from ID for display
  const getCommunityName = (id: string) => {
    const community = SAMPLE_COMMUNITIES.find(c => c.id === id);
    return community ? community.name : id;
  };

  return (
    <div className="space-y-4">
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory || selectedCommunity !== 'all'
              ? 'No templates match your search criteria'
              : 'No templates available'}
          </p>
          <Button onClick={onCreateTemplate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => onSelectTemplate(template)}
              onEdit={() => onEditTemplate(template)}
              onDelete={() => handleDeleteTemplate(template.id)}
              getCommunityName={getCommunityName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesList;
