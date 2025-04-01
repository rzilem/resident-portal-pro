
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Edit, FilePlus, ImagePlus, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  };

  const updateSection = (id: string, updates: Partial<ProposalSection>) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const handleSave = () => {
    if (!proposalName) {
      toast.error('Please enter a proposal name');
      return;
    }

    if (sections.length === 0) {
      toast.error('Please add at least one section to your proposal');
      return;
    }

    // Here you would save the proposal data to your database
    // For now we'll just mock it with localStorage
    const proposal = {
      id: `proposal-${Date.now()}`,
      name: proposalName,
      description: proposalDescription,
      sections,
      createdAt: new Date().toISOString()
    };
    
    const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    localStorage.setItem('proposals', JSON.stringify([...savedProposals, proposal]));
    
    toast.success('Proposal saved successfully');
    navigate('/leads?tab=proposals');
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
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
                              
                              <div className="grid gap-2">
                                <Label htmlFor={`content-${section.id}`}>
                                  {section.type === 'document' || section.type === 'pdf' 
                                    ? 'Document URL or File' 
                                    : section.type === 'image' 
                                      ? 'Image URL or File'
                                      : 'Video URL or File'}
                                </Label>
                                <Input
                                  id={`content-${section.id}`}
                                  value={section.content}
                                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                  placeholder={`Enter ${section.type} URL or upload file`}
                                />
                                
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
        <Button onClick={handleSave}>
          Save Proposal
        </Button>
      </div>
    </div>
  );
};

export default ProposalCreator;
