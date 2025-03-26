
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  FileEdit, 
  Trash2,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ViolationTemplate, ViolationTemplateFilter } from '@/types/compliance';

interface TemplateListProps {
  templates: ViolationTemplate[];
  onToggleUsage: (templateId: string) => void;
  filters: ViolationTemplateFilter;
}

const TemplateList: React.FC<TemplateListProps> = ({ 
  templates, 
  onToggleUsage,
  filters
}) => {
  // Apply filters
  const filteredTemplates = templates.filter(template => {
    // Filter by showUnused
    if (filters.showUnused && template.isUsed) {
      return false;
    }
    
    // Filter by group
    if (filters.group && template.group !== filters.group) {
      return false;
    }
    
    // Filter by item
    if (filters.item && !template.item.toLowerCase().includes(filters.item.toLowerCase())) {
      return false;
    }
    
    // Filter by description
    if (filters.description && !template.description.toLowerCase().includes(filters.description.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <FileText className="mx-auto h-12 w-12 opacity-30 mb-3" />
        <h3 className="text-lg font-medium mb-2">No templates found</h3>
        <p>Adjust your filters or create a new template.</p>
      </div>
    );
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Active</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTemplates.map(template => (
            <TableRow key={template.id}>
              <TableCell>
                <Switch 
                  checked={template.isUsed}
                  onCheckedChange={() => onToggleUsage(template.id)}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{template.title || template.description}</div>
                <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {template.description}
                </div>
                <div className="flex gap-2 mt-1">
                  {template.isUsed ? (
                    <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 text-gray-500">
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                  {template.articleNumber && (
                    <Badge variant="outline">Article {template.articleNumber}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{template.group}</TableCell>
              <TableCell>{template.item}</TableCell>
              <TableCell>
                {template.severity && (
                  <Badge className={getSeverityColor(template.severity)}>
                    {template.severity.charAt(0).toUpperCase() + template.severity.slice(1)}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TemplateList;
