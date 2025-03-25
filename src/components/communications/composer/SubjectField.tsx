
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useComposer } from './ComposerContext';
import TemplateSelector from './TemplateSelector';
import { filterTemplatesByCommunity } from './ComposerUtils';
import { MessageTemplate } from '@/pages/communications/types';

interface SubjectFieldProps {
  templates: MessageTemplate[];
}

const SubjectField: React.FC<SubjectFieldProps> = ({ templates }) => {
  const { subject, setSubject, setContent, selectedCommunity } = useComposer();
  
  // Filter templates based on the selected community
  const filteredTemplates = filterTemplatesByCommunity(templates, selectedCommunity);

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSubject(template.subject);
    setContent(template.content);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="subject">Subject</Label>
        <TemplateSelector 
          templates={filteredTemplates}
          onSelectTemplate={handleTemplateSelect}
          currentCommunity={selectedCommunity}
        />
      </div>
      <Input
        id="subject"
        placeholder="Enter message subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
    </div>
  );
};

export default SubjectField;
