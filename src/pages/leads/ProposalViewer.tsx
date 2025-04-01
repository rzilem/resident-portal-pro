
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Download, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { emailService } from '@/services/emailService';

interface ProposalType {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    title: string;
    type: 'document' | 'image' | 'video' | 'pdf';
    content: string;
    description?: string;
  }[];
  createdAt: string;
}

const ProposalViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<ProposalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [leadEmailOpen, setLeadEmailOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the proposal from your API
    // For now, we'll use localStorage
    const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const foundProposal = savedProposals.find((p: ProposalType) => p.id === id);
    
    if (foundProposal) {
      setProposal(foundProposal);
    } else {
      toast.error('Proposal not found');
      navigate('/leads?tab=proposals');
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleLeadCapture = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      // Save lead information (mock with localStorage for now)
      const lead = {
        id: `lead-${Date.now()}`,
        email,
        name: name || 'Unknown',
        company: company || 'Unknown',
        proposalId: id,
        proposalName: proposal?.name,
        status: 'new',
        createdAt: new Date().toISOString(),
        lastViewed: new Date().toISOString()
      };
      
      const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      localStorage.setItem('leads', JSON.stringify([...savedLeads, lead]));
      
      // Send notification email to admin
      await emailService.sendEmail({
        to: 'admin@example.com', // In real app, this would be configurable
        subject: 'New Lead Captured',
        body: `
          <h1>New Lead</h1>
          <p>A new lead has viewed proposal "${proposal?.name}":</p>
          <ul>
            <li><strong>Name:</strong> ${name || 'Not provided'}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Company:</strong> ${company || 'Not provided'}</li>
          </ul>
        `,
        isHtml: true
      });
      
      // Mark form as submitted to show proposal content
      setFormSubmitted(true);
      setLeadEmailOpen(false);
      
      toast.success('Thank you! You can now view the proposal');
    } catch (error) {
      console.error('Error capturing lead:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <p>Loading proposal...</p>
      </div>
    );
  }
  
  if (!proposal) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <p>Proposal not found</p>
      </div>
    );
  }
  
  // If no lead info captured yet, show the dialog
  if (!formSubmitted) {
    return (
      <div className="container mx-auto py-24 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <h1 className="text-2xl font-bold">{proposal.name}</h1>
              {proposal.description && (
                <p className="text-muted-foreground">{proposal.description}</p>
              )}
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLeadCapture();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Your name (optional)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ABC Corporation"
                />
              </div>
              
              <Button type="submit" className="w-full">
                View Proposal
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/leads?tab=proposals')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{proposal.name}</h1>
            {proposal.description && (
              <p className="text-muted-foreground">{proposal.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={leadEmailOpen} onOpenChange={setLeadEmailOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Email This Proposal</DialogTitle>
                <DialogDescription>
                  Send this proposal to additional recipients
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="recipient@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    defaultValue={`Proposal: ${proposal.name}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-message">Message (optional)</Label>
                  <textarea
                    id="email-message"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Add a personal message..."
                  ></textarea>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => {
                  toast.success('Proposal sent via email');
                  setLeadEmailOpen(false);
                }}>
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg overflow-hidden">
        {proposal.sections.length > 0 ? (
          <Tabs defaultValue={proposal.sections[0]?.id} className="w-full">
            <TabsList className="w-full justify-start overflow-auto border-b rounded-none bg-background">
              {proposal.sections.map((section) => (
                <TabsTrigger key={section.id} value={section.id} className="rounded-none">
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {proposal.sections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="p-6 min-h-[70vh]">
                <div className="flex flex-col items-center justify-start">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  
                  <div className="w-full flex-1 min-h-[500px] border rounded-md overflow-hidden">
                    {section.type === 'pdf' && section.content ? (
                      <iframe 
                        src={section.content} 
                        className="w-full h-full min-h-[500px]" 
                        title={section.title}
                      />
                    ) : section.type === 'image' && section.content ? (
                      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-black/5">
                        <img 
                          src={section.content} 
                          alt={section.title} 
                          className="max-w-full max-h-[500px] object-contain" 
                        />
                      </div>
                    ) : section.type === 'video' && section.content ? (
                      <video 
                        src={section.content} 
                        controls 
                        className="w-full h-full min-h-[500px] bg-black"
                      />
                    ) : section.type === 'document' && section.content ? (
                      <iframe 
                        src={section.content} 
                        className="w-full h-full min-h-[500px]" 
                        title={section.title}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[500px] bg-black/5">
                        <p className="text-muted-foreground">No content available</p>
                      </div>
                    )}
                  </div>
                  
                  {section.description && (
                    <div className="mt-6 text-center max-w-3xl">
                      <p className="text-muted-foreground">{section.description}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">This proposal has no content sections</p>
          </div>
        )}
      </div>
      
      <div className="bg-muted rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{name || email}</span>
          </div>
          
          {company && (
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{company}</span>
            </div>
          )}
        </div>
        
        <div className="mt-2 sm:mt-0">
          <Button onClick={() => {
            // In a real app, this would create a lead and redirect to the lead detail page
            toast.success('Lead created');
            navigate('/leads');
          }}>
            Convert to Lead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProposalViewer;
