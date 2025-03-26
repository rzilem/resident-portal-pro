
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, XCircle, Check, Filter } from 'lucide-react';
import { ViolationTemplate, ViolationTemplateFilter } from '@/types/compliance';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TemplateListProps {
  templates: ViolationTemplate[];
  onToggleUsage: (templateId: string) => void;
  filters: ViolationTemplateFilter;
}

const TemplateList = ({ templates, onToggleUsage, filters }: TemplateListProps) => {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const filteredTemplates = templates.filter(template => {
    // If showUnused is true, only show unused templates
    if (filters.showUnused === true && template.isUsed) {
      return false;
    }
    
    // Filter by group
    if (filters.group && !template.group.toLowerCase().includes(filters.group.toLowerCase())) {
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
  
  // Group templates by their group
  const groupedTemplates: { [key: string]: ViolationTemplate[] } = {};
  filteredTemplates.forEach(template => {
    if (!groupedTemplates[template.group]) {
      groupedTemplates[template.group] = [];
    }
    groupedTemplates[template.group].push(template);
  });

  // Ensure all groups are expanded by default
  Object.keys(groupedTemplates).forEach(group => {
    if (expandedGroups[group] === undefined) {
      expandedGroups[group] = true;
    }
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <div className="flex items-center gap-2">
                Group
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Filter className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                CCR Item
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Filter className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                Letter Description
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Filter className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      <ScrollArea className="h-[400px]">
        <Table>
          <TableBody>
            {Object.entries(groupedTemplates).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No templates found.
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedTemplates).map(([group, templates]) => (
                <React.Fragment key={group}>
                  <TableRow 
                    className="bg-muted/50 cursor-pointer hover:bg-muted"
                    onClick={() => toggleGroup(group)}
                  >
                    <TableCell colSpan={4}>
                      <div className="flex items-center font-medium">
                        {expandedGroups[group] ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        {group}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedGroups[group] && templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.group}</TableCell>
                      <TableCell>{template.item}</TableCell>
                      <TableCell className="max-w-xl">{template.description}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleUsage(template.id);
                                }}
                              >
                                {template.isUsed ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <Check className="h-5 w-5 text-green-500" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{template.isUsed ? 'Mark as Not Used' : 'Mark as Used'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TemplateList;
