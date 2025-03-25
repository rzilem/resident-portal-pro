
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useComposer } from './ComposerContext';
import TemplateSelector from './TemplateSelector';
import { filterTemplatesByCommunity } from './ComposerUtils';

interface SubjectFieldProps {
  templates: any[];
}

const SubjectField: React.FC<SubjectFieldProps> = ({ templates }) => {
  const { subject, setSubject, selectedCommunity } = useComposer();
  
  // Filter templates based on the selected community
  const filteredTemplates = filterTemplatesByCommunity(templates, selectedCommunity);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="subject">Subject</Label>
        <TemplateSelector 
          templates={filteredTemplates}
          onSelectTemplate={(template) => {
            setSubject(template.subject);
          }}
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
