
import React from 'react';
import { 
  Calendar, 
  Copy, 
  Edit, 
  FileText, 
  Trash2, 
  PlusCircle,
  Tag,
  LogOut,
  LogIn
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnboardingTemplate } from '@/types/onboarding';
import { cn } from '@/lib/utils';

interface TemplateListProps {
  templates: OnboardingTemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: OnboardingTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (template: OnboardingTemplate) => void;
  onSelectTemplate: (template: OnboardingTemplate) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onSelectTemplate
}) => {
  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle delete with confirmation
  const handleDelete = (template: OnboardingTemplate) => {
    if (template.isDefault) {
      alert('Default templates cannot be deleted');
      return;
    }
    
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      onDeleteTemplate(template.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Onboarding Templates</h2>
        <Button onClick={onCreateTemplate}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Templates Available</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first onboarding template to standardize the onboarding process for your clients
            </p>
            <Button onClick={onCreateTemplate}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={template.isDefault ? "default" : "secondary"}>
                    {template.clientType || 'Generic'}
                  </Badge>
                  <div className="flex gap-1">
                    {template.isDefault && (
                      <Badge variant="outline">Default</Badge>
                    )}
                    <Badge 
                      variant={template.processType === 'onboarding' ? 'default' : 'destructive'}
                      className="flex items-center gap-1"
                    >
                      {template.processType === 'onboarding' ? (
                        <>
                          <LogIn className="h-3 w-3 mr-1" />
                          Onboarding
                        </>
                      ) : (
                        <>
                          <LogOut className="h-3 w-3 mr-1" />
                          Offboarding
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Updated: {formatDate(template.updatedAt)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags?.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm mt-2">
                    <p>{getTotalTasksCount(template)} tasks in {template.taskGroups.length} groups</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDuplicateTemplate(template)}
                    title="Duplicate template"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditTemplate(template)}
                    title="Edit template"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(template)}
                    title="Delete template"
                    disabled={template.isDefault}
                    className={template.isDefault ? "opacity-50 cursor-not-allowed" : "text-destructive"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to count total tasks in a template
function getTotalTasksCount(template: OnboardingTemplate): number {
  return template.taskGroups.reduce((total, group) => total + group.tasks.length, 0);
}

export default TemplateList;
