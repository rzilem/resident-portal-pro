import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, FolderOpen, Shield, Gavel, 
  FileSpreadsheet, Calendar, Plus, 
  Download, Search, Tag, Filter, 
  ArrowUpDown, Info, LockIcon, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Association } from '@/types/association';
import { DocumentFile, DocumentAccessLevel } from '@/types/documents';
import { getDocuments } from '@/utils/documents/documentDbUtils';
import DocumentPreview from '@/components/documents/DocumentPreview';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';
import DocumentActions from '@/components/documents/DocumentActions';
import DocumentTemplates from '@/components/documents/templates/DocumentTemplates';
import { useToast } from '@/components/ui/use-toast';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate, formatFileSize } from '@/components/documents/utils/documentIconUtils';

interface AssociationDocumentsTabProps {
  association: Association;
}

interface DocumentCategory {
  name: string;
  icon: React.ElementType;
  id: string;
  accessLevel: DocumentAccessLevel;
}

const documentCategories: DocumentCategory[] = [
  { name: "Governing Documents", icon: Shield, id: "governing", accessLevel: "homeowner" as DocumentAccessLevel },
  { name: "Financial Documents", icon: FileSpreadsheet, id: "financial", accessLevel: "board" as DocumentAccessLevel },
  { name: "Meeting Minutes", icon: Calendar, id: "meetings", accessLevel: "homeowner" as DocumentAccessLevel },
  { name: "Legal Documents", icon: Gavel, id: "legal", accessLevel: "management" as DocumentAccessLevel },
  { name: "Rules & Regulations", icon: Shield, id: "rules", accessLevel: "all" as DocumentAccessLevel },
  { name: "Contracts", icon: Gavel, id: "contracts", accessLevel: "management" as DocumentAccessLevel }
];

const AssociationDocumentsTab: React.FC<AssociationDocumentsTabProps> = ({ association }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role } = useAuthRole();
  const [activeCategory, setActiveCategory] = useState(documentCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'name' | 'date' | 'size'>('date');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const accessibleCategories = documentCategories.filter(category => {
    switch(category.accessLevel) {
      case 'admin':
        return role === 'admin';
      case 'management':
        return ['admin', 'manager', 'staff'].includes(role || '');
      case 'board':
        return ['admin', 'manager', 'staff', 'board', 'board_member'].includes(role || '');
      case 'homeowner':
        return ['admin', 'manager', 'staff', 'board', 'board_member', 'resident'].includes(role || '');
      case 'all':
      default:
        return true;
    }
  });
  
  useEffect(() => {
    if (accessibleCategories.length > 0) {
      setActiveCategory(accessibleCategories[0].id);
    }
  }, [role]);
  
  useEffect(() => {
    loadDocuments();
  }, [association.id, activeCategory, searchQuery, tagFilter, role, refreshTrigger]); 
  
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const associationIdString = String(association.id);
      console.log(`Loading documents for association ID: ${associationIdString}, category: ${activeCategory}, role: ${role}`);
      
      const filters = {
        query: searchQuery,
        categories: activeCategory === 'all' ? [] : [activeCategory],
        tags: tagFilter ? [tagFilter] : []
      };
      
      const docs = await getDocuments(filters, associationIdString, role);
      console.log(`Found ${docs.length} documents matching criteria`);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshDocuments = () => {
    console.log("Refreshing documents in AssociationDocumentsTab");
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleDocumentView = (document: DocumentFile) => {
    setSelectedDocument(document);
    setShowDocumentPreview(true);
  };
  
  const handleDocumentDelete = (document: DocumentFile) => {
    toast({
      title: "Document Deleted",
      description: `"${document.name}" has been deleted.`
    });
    
    setDocuments(documents.filter(doc => doc.id !== document.id));
    refreshDocuments();
  };
  
  const getAccessLevelBadge = (accessLevel?: DocumentAccessLevel) => {
    switch (accessLevel) {
      case 'admin':
        return <Badge variant="destructive" className="ml-1 flex items-center gap-1"><LockIcon className="h-3 w-3" /> Admin</Badge>;
      case 'management': 
        return <Badge variant="secondary" className="ml-1 flex items-center gap-1"><LockIcon className="h-3 w-3" /> Management</Badge>;
      case 'board':
        return <Badge variant="outline" className="ml-1 flex items-center gap-1"><Users className="h-3 w-3" /> Board</Badge>;
      case 'homeowner':
        return <Badge variant="outline" className="ml-1 flex items-center gap-1"><Users className="h-3 w-3" /> Homeowners</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('docx')) return <FileText className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('xlsx')) return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };
  
  const handleUploadSuccess = () => {
    toast({
      title: "Upload Successful",
      description: "Document has been uploaded successfully."
    });
    refreshDocuments();
  };
  
  const getCategoryName = () => {
    if (!activeCategory) return 'All Documents';
    const category = documentCategories.find(c => c.id === activeCategory);
    return category ? category.name : 'Documents';
  };
  
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'date') {
      return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
    } else if (sortOrder === 'size') {
      return b.fileSize - a.fileSize;
    }
    return 0;
  });
  
  return (
    <div className="mt-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Size (Largest)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-[160px]">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_tags">All Tags</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="rules">Rules</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span>Upload</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Association Documents</CardTitle>
          <Button variant="outline" onClick={() => navigate('/documents/association')}>
            <FolderOpen className="h-4 w-4 mr-2" />
            <span>View All Documents</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full flex overflow-auto mb-4">
              {accessibleCategories.map(category => (
                <TooltipProvider key={category.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value={category.id} className="flex items-center gap-1">
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                        {category.accessLevel !== 'all' && (
                          <LockIcon className="h-3 w-3 ml-1" />
                        )}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Access Level: {category.accessLevel || 'All'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </TabsList>
            
            {accessibleCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="pt-0">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    {category.name}
                    {getAccessLevelBadge(category.accessLevel)}
                  </h3>
                </div>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-14 bg-muted rounded-md"></div>
                    ))}
                  </div>
                ) : sortedDocuments.length > 0 ? (
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tags</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedDocuments.map(doc => (
                          <tr key={doc.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getFileIcon(doc.fileType)}
                                <div>
                                  <div className="font-medium flex items-center gap-1">
                                    {doc.name}
                                    {doc.version > 1 && (
                                      <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{doc.description || ''}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatDate(doc.uploadedDate)}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatFileSize(doc.fileSize)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {doc.tags?.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDocumentView(doc)}
                                >
                                  View
                                </Button>
                                <DocumentActions 
                                  document={doc}
                                  onView={handleDocumentView}
                                  onDelete={handleDocumentDelete}
                                  refreshDocuments={refreshDocuments}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No documents found</h3>
                    <p className="text-muted-foreground mt-1 mb-6">
                      {searchQuery 
                        ? `No results for "${searchQuery}"` 
                        : `No ${category.name.toLowerCase()} have been added yet`}
                    </p>
                    <Button onClick={() => setShowUploadDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <DocumentTemplates />
      
      <DocumentUploadDialog 
        open={showUploadDialog}
        setOpen={setShowUploadDialog}
        onSuccess={handleUploadSuccess}
        refreshDocuments={refreshDocuments}
      />
      
      <DocumentPreview
        document={selectedDocument}
        isOpen={showDocumentPreview}
        onClose={() => setShowDocumentPreview(false)}
      />
    </div>
  );
};

export default AssociationDocumentsTab;
