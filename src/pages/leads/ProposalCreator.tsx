
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Edit, FilePlus, ImagePlus, Video, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { FileUploader } from '@/components/ui/file-uploader';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface ProposalSection {
  id: string;
  title: string;
  type: 'document' | 'image' | 'video' | 'pdf';
  content: string;
  description?: string;
}

const ProposalCreator: React.FC = () => {
  const navigate = useNavigate();
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [sections, setSections] = useState<ProposalSection[]>([]);
  const [currentTab, setCurrentTab] = useState('content');
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<Record<string, File | null>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSections(items);
  };

  const addSection = (type: ProposalSection['type']) => {
    const newSection: ProposalSection = {
      id: `section-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      content: '',
    };
    
    setSections([...sections, newSection]);
    setAddSectionDialogOpen(false);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
    const newUploadFiles = { ...uploadFiles };
    delete newUploadFiles[id];
    setUploadFiles(newUploadFiles);
  };

  const updateSection = (id: string, updates: Partial<ProposalSection>) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const handleFileChange = (sectionId: string, file: File | null) => {
    setUploadFiles({
      ...uploadFiles,
      [sectionId]: file
    });

    if (file) {
      setUploadProgress({
        ...uploadProgress,
        [sectionId]: 0
      });
    } else {
      const newProgress = { ...uploadProgress };
      delete newProgress[sectionId];
      setUploadProgress(newProgress);
    }
  };

  const handleFileUpload = async (sectionId: string) => {
    const file = uploadFiles[sectionId];
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(sectionId);
    setUploadProgress({
      ...uploadProgress,
      [sectionId]: 10
    });

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You need to be logged in to upload files");
        setUploading(null);
        return;
      }

      setUploadProgress({
        ...uploadProgress,
        [sectionId]: 30
      });

      // Check if we can access the storage bucket (for demo mode detection)
      if (!demoMode) {
        try {
          const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
          
          if (bucketError) {
            console.log("Error checking buckets, switching to demo mode:", bucketError);
            setDemoMode(true);
          }
        } catch (bucketCheckError) {
          console.log("Exception checking buckets, switching to demo mode:", bucketCheckError);
          setDemoMode(true);
        }
      }

      let fileUrl = '';
      
      if (demoMode) {
        // In demo mode, we'll generate a mock URL for the file
        console.log("Using demo mode for file upload");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        // Create a mock URL that includes the file name
        const mockId = Math.random().toString(36).substring(2, 15);
        fileUrl = `https://demo-storage.example.com/${mockId}/${file.name}`;
        
        setUploadProgress({
          ...uploadProgress,
          [sectionId]: 100
        });
        
        toast.success("File processed in demo mode");
      } else {
        // Standard upload flow
        const bucket = "proposals";
        const path = `sections/${sectionId}`;
        
        // Generate a unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}-${file.name.split('.')[0]}.${fileExt}`;
        const filePath = `${path}/${fileName}`;
        
        // Try to create the bucket if it doesn't exist
        try {
          const { error: createBucketError } = await supabase.storage.createBucket(bucket, {
            public: true
          });
          
          if (createBucketError) {
            console.log("Bucket creation failed, will try to upload anyway:", createBucketError);
          }
        } catch (bucketError) {
          console.log("Exception creating bucket, will try to upload anyway:", bucketError);
        }
        
        setUploadProgress({
          ...uploadProgress,
          [sectionId]: 50
        });
        
        // Attempt the upload
        try {
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (error) {
            console.error("Upload error:", error);
            // If we get an error here, switch to demo mode
            setDemoMode(true);
            
            // Create a mock URL as fallback
            const mockId = Math.random().toString(36).substring(2, 15);
            fileUrl = `https://demo-storage.example.com/${mockId}/${file.name}`;
            
            toast.warning("Using demo mode due to storage issues");
          } else {
            // Get public URL for the uploaded file
            const { data: urlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(data.path);
            
            fileUrl = urlData.publicUrl;
          }
        } catch (uploadError) {
          console.error("Exception during upload:", uploadError);
          setDemoMode(true);
          
          // Create a mock URL as fallback
          const mockId = Math.random().toString(36).substring(2, 15);
          fileUrl = `https://demo-storage.example.com/${mockId}/${file.name}`;
          
          toast.warning("Using demo mode due to storage issues");
        }
        
        setUploadProgress({
          ...uploadProgress,
          [sectionId]: 100
        });
      }
      
      // Update the section with the file URL (real or mock)
      updateSection(sectionId, { content: fileUrl });
      toast.success("File processed successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error processing file");
      setUploadProgress({
        ...uploadProgress,
        [sectionId]: 0
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    if (!proposalName) {
      toast.error('Please enter a proposal name');
      return;
    }

    if (sections.length === 0) {
      toast.error('Please add at least one section to your proposal');
      return;
    }

    setSaving(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You need to be logged in to save proposals");
        setSaving(false);
        return;
      }
      
      const proposalId = uuidv4();
      
      const { data, error } = await supabase
        .from('proposals')
        .insert({
          id: proposalId,
          name: proposalName,
          description: proposalDescription,
          sections: sections,
          createdat: new Date().toISOString(),
          createdby: session.session.user.id
        })
        .select();
      
      if (error) {
        console.error('Error saving proposal:', error);
        toast.error('Failed to save proposal: ' + error.message);
        setSaving(false);
        return;
      }
      
      toast.success('Proposal saved successfully');
      
      navigate('/leads?tab=proposals');
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error('An unexpected error occurred while saving the proposal');
    } finally {
      setSaving(false);
    }
  };

  const renderProgressBar = (sectionId: string) => {
    const progress = uploadProgress[sectionId] || 0;
    if (progress === 0) return null;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/leads?tab=proposals')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Proposal</h1>
          <p className="text-muted-foreground">Add content sections to present to potential clients</p>
        </div>
      </div>

      {/* Demo mode warning */}
      {demoMode && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Running in Demo Mode</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Storage functionality is running in demo mode. Files will appear to upload but won't be permanently stored.
                  In a production environment, you would need to configure Supabase storage properly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Sections</CardTitle>
              <CardDescription>
                Add and arrange the sections of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border rounded-md p-4 bg-card"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">
                                  {section.title} ({section.type})
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => {
                                      const title = prompt('Enter section title', section.title);
                                      if (title) updateSection(section.id, { title });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => removeSection(section.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid gap-4">
                                {section.type !== 'video' && (
                                  <div className="space-y-2">
                                    <Label>Upload File</Label>
                                    <div className="flex flex-col gap-2">
                                      <div className="w-full">
                                        <FileUploader
                                          file={uploadFiles[section.id] || null}
                                          setFile={(file) => handleFileChange(section.id, file)}
                                          acceptedTypes={section.type === 'image' ? 
                                            "image/jpeg,image/png,image/gif" : 
                                            "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
                                        />
                                        {renderProgressBar(section.id)}
                                      </div>
                                      <Button 
                                        onClick={() => handleFileUpload(section.id)} 
                                        disabled={!uploadFiles[section.id] || uploading === section.id}
                                        className="w-full mt-2"
                                      >
                                        {uploading === section.id ? (
                                          <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                          </span>
                                        ) : (
                                          <span className="flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            Upload File
                                          </span>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="grid gap-2">
                                  <Label htmlFor={`content-${section.id}`}>
                                    {section.type === 'document' || section.type === 'pdf' 
                                      ? 'Document URL' 
                                      : section.type === 'image' 
                                        ? 'Image URL'
                                        : 'Video URL'}
                                  </Label>
                                  <Input
                                    id={`content-${section.id}`}
                                    value={section.content}
                                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                    placeholder={`Enter ${section.type} URL or upload a file above`}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor={`description-${section.id}`}>Description (optional)</Label>
                                  <Textarea
                                    id={`description-${section.id}`}
                                    value={section.description || ''}
                                    onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                    placeholder="Add description for this section"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              <Dialog open={addSectionDialogOpen} onOpenChange={setAddSectionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Proposal Section</DialogTitle>
                    <DialogDescription>
                      Choose the type of content you want to add to your proposal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <Button 
                      onClick={() => addSection('document')} 
                      variant="outline" 
                      className="h-24 flex flex-col gap-2"
                    >
                      <FileText className="h-8 w-8" />
                      <span>Document</span>
                    </Button>
                    <Button 
                      onClick={() => addSection('pdf')} 
                      variant="outline" 
                      className="h-24 flex flex-col gap-2"
                    >
                      <FilePlus className="h-8 w-8" />
                      <span>PDF</span>
                    </Button>
                    <Button 
                      onClick={() => addSection('image')} 
                      variant="outline" 
                      className="h-24 flex flex-col gap-2"
                    >
                      <ImagePlus className="h-8 w-8" />
                      <span>Image</span>
                    </Button>
                    <Button 
                      onClick={() => addSection('video')} 
                      variant="outline" 
                      className="h-24 flex flex-col gap-2"
                    >
                      <Video className="h-8 w-8" />
                      <span>Video</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
              <CardDescription>
                Basic information about your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="proposal-name">Proposal Name</Label>
                <Input
                  id="proposal-name"
                  value={proposalName}
                  onChange={(e) => setProposalName(e.target.value)}
                  placeholder="Enter proposal name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="proposal-description">Description (optional)</Label>
                <Textarea
                  id="proposal-description"
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  placeholder="Enter a description for this proposal"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Preview</CardTitle>
              <CardDescription>
                See how your proposal will look to clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">{proposalName || 'Untitled Proposal'}</h2>
                  {proposalDescription && (
                    <p className="text-muted-foreground">{proposalDescription}</p>
                  )}
                  
                  <Tabs defaultValue={sections[0]?.id} className="w-full">
                    <TabsList className="w-full justify-start overflow-auto">
                      {sections.map((section) => (
                        <TabsTrigger key={section.id} value={section.id}>
                          {section.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {sections.map((section) => (
                      <TabsContent key={section.id} value={section.id} className="py-4">
                        <div className="flex flex-col items-center justify-center min-h-[300px] border rounded-md p-4">
                          {section.type === 'pdf' && section.content ? (
                            <iframe 
                              src={section.content} 
                              className="w-full h-[500px]" 
                              title={section.title}
                            />
                          ) : section.type === 'image' && section.content ? (
                            <img 
                              src={section.content} 
                              alt={section.title} 
                              className="max-w-full max-h-[500px] object-contain" 
                            />
                          ) : section.type === 'video' && section.content ? (
                            <video 
                              src={section.content} 
                              controls 
                              className="max-w-full max-h-[500px]"
                            />
                          ) : section.type === 'document' && section.content ? (
                            <iframe 
                              src={section.content} 
                              className="w-full h-[500px]" 
                              title={section.title}
                            />
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <p>No content added yet</p>
                              <p className="text-sm">Add content in the Content tab</p>
                            </div>
                          )}
                          
                          {section.description && (
                            <div className="mt-4 text-center max-w-2xl">
                              <p>{section.description}</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No sections added yet</p>
                  <p className="text-sm">Add sections in the Content tab</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/leads?tab=proposals')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Proposal'}
        </Button>
      </div>
    </div>
  );
};

export default ProposalCreator;
