
import React from 'react';
import { MessageTemplate } from './types';
import TemplateCard from './TemplateCard';

interface TemplatesListProps {
  templates: MessageTemplate[];
  onPreview: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (id: string) => void;
  onSelect: (template: MessageTemplate) => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onPreview,
  onEdit,
  onDelete,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default TemplatesList;
