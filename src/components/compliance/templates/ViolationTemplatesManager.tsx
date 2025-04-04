
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAssociations } from '@/hooks/use-associations';
import { ViolationTemplate, ViolationTemplateFilter } from '@/types/compliance';
import { getViolationTemplatesByAssociation, toggleTemplateUsage } from '@/data/violationTemplates';
import TemplateHeader from './TemplateHeader';
import TemplateToolbar from './TemplateToolbar';
import TemplateFilters from './TemplateFilters';
import TemplateList from './TemplateList';
import { useToast } from '@/components/ui/use-toast';

interface ViolationTemplatesManagerProps {
  associationId?: string;
}

const ViolationTemplatesManager: React.FC<ViolationTemplatesManagerProps> = ({ associationId }) => {
  const { toast } = useToast();
  const { activeAssociation } = useAssociations();
  const [templates, setTemplates] = useState<ViolationTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('association');
  const [filters, setFilters] = useState<ViolationTemplateFilter>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Use the passed associationId if available, otherwise use activeAssociation
  const currentAssociationId = associationId || (activeAssociation?.id || '');

  useEffect(() => {
    if (currentAssociationId) {
      const associationTemplates = getViolationTemplatesByAssociation(currentAssociationId);
      setTemplates(associationTemplates);
    }
  }, [currentAssociationId]);

  useEffect(() => {
    if (activeTab === 'unused') {
      setFilters(prev => ({ ...prev, showUnused: true }));
    } else {
      setFilters(prev => ({ ...prev, showUnused: false }));
    }
  }, [activeTab]);

  const handleToggleUsage = (templateId: string) => {
    const updatedTemplates = toggleTemplateUsage(templateId);
    setTemplates(updatedTemplates);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, you would save the changes to the server here
    toast({
      title: "Changes saved",
      description: "Your template changes have been saved successfully.",
    });
    setHasChanges(false);
  };

  const handleCancelChanges = () => {
    // Reset the templates to the original state
    if (currentAssociationId) {
      const associationTemplates = getViolationTemplatesByAssociation(currentAssociationId);
      setTemplates(associationTemplates);
    }
    setHasChanges(false);
    toast({
      title: "Changes canceled",
      description: "Your template changes have been discarded.",
      variant: "destructive"
    });
  };

  const handleExportToExcel = () => {
    // In a real app, you would export the data to Excel here
    toast({
      title: "Export initiated",
      description: "Your templates are being exported to Excel.",
    });
  };

  if (!currentAssociationId) {
    return <div className="p-4 text-center">Please select an association</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <TemplateHeader 
          associationId={currentAssociationId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <TemplateToolbar 
          onSave={handleSaveChanges}
          onCancel={handleCancelChanges}
          onExport={handleExportToExcel}
        />
        
        <TemplateFilters 
          filters={filters}
          onFilterChange={setFilters}
        />
        
        <TemplateList 
          templates={templates}
          onToggleUsage={handleToggleUsage}
          filters={filters}
        />
      </CardContent>
    </Card>
  );
};

export default ViolationTemplatesManager;
