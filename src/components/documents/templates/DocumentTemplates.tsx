
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Search, 
  Plus, 
  Clock, 
  ArrowDownUp, 
  Copy
} from 'lucide-react';
import { DocumentTemplate } from '@/types/documents';

// Sample template data
const mockTemplates: DocumentTemplate[] = [
  {
    id: 'template-1',
    name: 'Board Meeting Minutes',
    description: 'Standard template for board meeting minutes',
    category: 'meetings',
    content: '# Board Meeting Minutes\n\nDate: [Date]\nLocation: [Location]\n\n## Attendees\n- [Name], [Position]\n- [Name], [Position]\n\n## Agenda\n1. Call to Order\n2. Approval of Previous Minutes\n3. Financial Report\n4. Old Business\n5. New Business\n6. Adjournment\n\n## Discussion\n\n### 1. Call to Order\n[Details]\n\n### 2. Approval of Previous Minutes\n[Details]\n\n### 3. Financial Report\n[Details]\n\n### 4. Old Business\n[Details]\n\n### 5. New Business\n[Details]\n\n### 6. Adjournment\n[Details]\n\n## Action Items\n- [Action] - Assigned to: [Name], Due: [Date]\n- [Action] - Assigned to: [Name], Due: [Date]\n\n## Next Meeting\nDate: [Date]\nTime: [Time]\nLocation: [Location]',
    createdBy: 'admin',
    createdDate: '2023-01-15T10:30:00Z',
    lastModified: '2023-06-10T14:20:00Z',
    lastModifiedBy: 'john.doe',
    version: 2,
    previousVersions: [
      {
        version: 1,
        content: '# Old Board Meeting Minutes Template\n\nDate: [Date]\nLocation: [Location]\n\n## Attendees\n- [Name], [Position]\n\n## Agenda\n1. Call to Order\n2. Approval of Previous Minutes\n3. Financial Report\n4. Old Business\n5. New Business\n6. Adjournment\n\n## Minutes\n[Minutes here]\n\n## Next Meeting\nDate: [Date]',
        lastModified: '2023-01-15T10:30:00Z',
        modifiedBy: 'admin'
      }
    ],
    isActive: true,
    usageCount: 12,
    lastUsed: '2023-10-05T09:15:00Z',
    mergeTags: ['date', 'location', 'attendees', 'agenda', 'action_items', 'next_meeting']
  },
  {
    id: 'template-2',
    name: 'Violation Notice',
    description: 'Template for sending violation notices to residents',
    category: 'compliance',
    content: '# Notice of Violation\n\nDate: [Date]\n\nDear [Resident_Name],\n\nThis letter serves as notification that a violation of the community rules and regulations has been observed at your property located at [Property_Address].\n\n**Violation Details:**\n- Type: [Violation_Type]\n- Date Observed: [Observation_Date]\n- Description: [Violation_Description]\n\nAccording to the Association's governing documents, specifically [Rule_Reference], this violation must be corrected by [Correction_Deadline].\n\nPlease take immediate action to remedy this situation. If you believe this notice has been sent in error or you need additional time to address the issue, please contact the management office at [Office_Phone] or [Office_Email].\n\nFailure to correct this violation by the specified date may result in further action, including fines or legal proceedings as outlined in our governing documents.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n\n[Manager_Name]\n[Association_Name]\n[Contact_Information]',
    createdBy: 'admin',
    createdDate: '2023-02-20T11:15:00Z',
    lastModified: '2023-02-20T11:15:00Z',
    version: 1,
    isActive: true,
    usageCount: 45,
    lastUsed: '2023-10-18T15:30:00Z',
    mergeTags: ['date', 'resident_name', 'property_address', 'violation_type', 'observation_date', 'violation_description', 'rule_reference', 'correction_deadline', 'office_phone', 'office_email', 'manager_name', 'association_name', 'contact_information']
  },
  {
    id: 'template-3',
    name: 'Annual Meeting Announcement',
    description: 'Template for announcing annual HOA meetings',
    category: 'communications',
    content: '# Annual Homeowners Association Meeting\n\n**Date:** [Meeting_Date]\n**Time:** [Meeting_Time]\n**Location:** [Meeting_Location]\n\nDear [Resident_Name],\n\nYou are cordially invited to attend the Annual Meeting of the [Association_Name] Homeowners Association.\n\n## Agenda\n\n1. Call to Order\n2. Establishment of Quorum\n3. Approval of Previous Annual Meeting Minutes\n4. President's Report\n5. Treasurer's Report\n   - Review of Current Financial State\n   - Presentation of Next Year's Budget\n6. Committee Reports\n7. Election of Board Members\n8. Old Business\n9. New Business\n10. Open Forum\n11. Adjournment\n\n## Important Notes\n\n- Please bring a photo ID for registration\n- If you cannot attend, please complete the enclosed proxy form\n- Light refreshments will be served\n\nYour participation is important for the continued success of our community. We look forward to seeing you there!\n\nSincerely,\n\n[Board_President]\nPresident, [Association_Name]\n[Contact_Email]\n[Contact_Phone]',
    createdBy: 'admin',
    createdDate: '2023-03-05T09:45:00Z',
    lastModified: '2023-09-10T16:20:00Z',
    lastModifiedBy: 'sarah.wilson',
    version: 3,
    previousVersions: [
      {
        version: 2,
        content: '# Annual HOA Meeting\n\n**Date:** [Meeting_Date]\n**Time:** [Meeting_Time]\n**Location:** [Meeting_Location]\n\nDear Homeowner,\n\nYou are invited to attend the Annual Meeting of the [Association_Name] Homeowners Association.\n\n## Agenda\n\n1. Call to Order\n2. Approval of Minutes\n3. Reports\n4. Elections\n5. Old Business\n6. New Business\n7. Adjournment\n\nPlease bring ID for registration. If you cannot attend, please complete the proxy form.\n\nSincerely,\n\n[Board_President]\nPresident',
        lastModified: '2023-06-15T10:30:00Z',
        modifiedBy: 'admin'
      },
      {
        version: 1,
        content: '# Annual Meeting Notice\n\nDate: [Meeting_Date]\nTime: [Meeting_Time]\nLocation: [Meeting_Location]\n\nAll homeowners are invited to attend the annual HOA meeting.\n\nAgenda:\n1. Call to Order\n2. Reports\n3. Elections\n4. Adjournment',
        lastModified: '2023-03-05T09:45:00Z',
        modifiedBy: 'admin'
      }
    ],
    isActive: true,
    usageCount: 6,
    lastUsed: '2023-10-01T11:30:00Z',
    mergeTags: ['meeting_date', 'meeting_time', 'meeting_location', 'resident_name', 'association_name', 'board_president', 'contact_email', 'contact_phone']
  }
];

const DocumentTemplates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  
  // Filter templates based on search query, category, and active tab
  const filteredTemplates = mockTemplates.filter(template => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    // Tab filter
    if (activeTab === 'recent') {
      // Show only recently used templates (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && 
             matchesCategory && 
             template.lastUsed && 
             new Date(template.lastUsed) >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'recent') {
      // Sort by last modified date
      return new Date(b.lastModified || b.createdDate).getTime() - 
             new Date(a.lastModified || a.createdDate).getTime();
    } else if (sortBy === 'name') {
      // Sort by name alphabetically
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'usage') {
      // Sort by usage count
      return b.usageCount - a.usageCount;
    }
    return 0;
  });
  
  const handleCreateFromTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    // In a real app, this would open a document editor or generation dialog
    console.log('Creating document from template:', template.id);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Templates
        </CardTitle>
        <CardDescription>
          Create documents using pre-defined templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="recent">Recently Used</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="meetings">Meetings</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="communications">Communications</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Most Recent
                    </div>
                  </SelectItem>
                  <SelectItem value="name">
                    <div className="flex items-center">
                      <ArrowDownUp className="h-4 w-4 mr-2" />
                      Name (A-Z)
                    </div>
                  </SelectItem>
                  <SelectItem value="usage">
                    <div className="flex items-center">
                      <ArrowDownUp className="h-4 w-4 mr-2" />
                      Most Used
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-1 gap-4">
                {sortedTemplates.length > 0 ? (
                  sortedTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-md hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last Modified: {formatDate(template.lastModified)}
                            </span>
                            <span>Version: {template.version}</span>
                            <span>Used: {template.usageCount} times</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateFromTemplate(template)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No templates found</h3>
                    <p className="text-muted-foreground mt-1">
                      {searchQuery 
                        ? `No results for "${searchQuery}"` 
                        : 'Create a new template to get started'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recent" className="m-0">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-1 gap-4">
                {sortedTemplates.length > 0 ? (
                  sortedTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-md hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last Used: {formatDate(template.lastUsed)}
                            </span>
                            <span>Version: {template.version}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateFromTemplate(template)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No recent templates</h3>
                    <p className="text-muted-foreground mt-1">
                      You haven't used any templates recently
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplates;
