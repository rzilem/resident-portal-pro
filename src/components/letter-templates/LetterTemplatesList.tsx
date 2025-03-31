
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Plus, Search, Trash2 } from "lucide-react";
import { LetterTemplate } from '@/types/letter-templates';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface LetterTemplatesListProps {
  templates: LetterTemplate[];
  isLoading: boolean;
  onSelect: (id: string) => void;
  selectedId: string | null;
  category: string;
  onDelete: (id: string) => void;
}

const LetterTemplatesList: React.FC<LetterTemplatesListProps> = ({ 
  templates, 
  isLoading, 
  onSelect,
  selectedId,
  category,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTemplates = searchQuery 
    ? templates.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;
    
  const handleCreateNew = () => {
    // Select null to create new
    onSelect('');
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this template?')) {
      onDelete(id);
      toast.success('Template deleted successfully');
      
      // If the deleted template was selected, deselect it
      if (selectedId === id) {
        onSelect('');
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Templates</h3>
        <Button size="sm" onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[500px] rounded-md border">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading templates...
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery 
              ? 'No templates match your search criteria' 
              : category === 'all'
                ? 'No templates found. Create your first template!'
                : `No ${category} templates found. Create your first ${category} template!`
            }
          </div>
        ) : (
          <div className="p-0">
            {filteredTemplates.map((template) => (
              <div key={template.id}>
                <div 
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted transition-colors ${
                    selectedId === template.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => onSelect(template.id)}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none">{template.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => handleDelete(template.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LetterTemplatesList;
