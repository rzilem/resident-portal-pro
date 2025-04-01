
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, MoreHorizontal, ExternalLink, Copy, Trash, Share2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface Proposal {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    title: string;
    type: string;
    content: string;
  }[];
  createdat: string;
}

const ProposalTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [currentProposalId, setCurrentProposalId] = useState<string | null>(null);
  
  // Fetch proposals using React Query
  const { data: proposals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('createdat', { ascending: false });
        
      if (error) throw error;
      return data as Proposal[];
    }
  });
  
  const filteredProposals = proposals.filter(proposal => 
    proposal.name.toLowerCase().includes(search.toLowerCase()) ||
    (proposal.description && proposal.description.toLowerCase().includes(search.toLowerCase()))
  );
  
  const handleShare = (proposalId: string) => {
    setCurrentProposalId(proposalId);
    const url = `${window.location.origin}/proposal/${proposalId}`;
    setShareUrl(url);
    setShareDialogOpen(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };
  
  const handleDelete = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId);
        
      if (error) throw error;
      
      toast.success('Proposal deleted successfully');
      refetch(); // Refresh the proposals list
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error('Failed to delete proposal');
    }
  };
  
  const handleDuplicate = async (proposal: Proposal) => {
    try {
      const newProposal = {
        ...proposal,
        id: undefined, // Let Supabase generate a new ID
        name: `${proposal.name} (Copy)`,
        createdat: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('proposals')
        .insert([newProposal])
        .select();
        
      if (error) throw error;
      
      toast.success('Proposal duplicated successfully');
      refetch(); // Refresh the proposals list
    } catch (error) {
      console.error('Error duplicating proposal:', error);
      toast.error('Failed to duplicate proposal');
    }
  };
  
  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading proposals. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Button onClick={() => navigate('/leads/proposal-creator')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={`loading-${i}`} className="overflow-hidden opacity-70">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5 mb-4"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{proposal.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/proposal/${proposal.id}`)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(proposal.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(proposal)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(proposal.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {proposal.description || 'No description provided'}
                </p>
                <div className="text-xs text-muted-foreground mt-4">
                  Created on {new Date(proposal.createdat).toLocaleDateString()}
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {proposal.sections?.length || 0} section{proposal.sections?.length !== 1 ? 's' : ''}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/proposal/${proposal.id}`)}
                  >
                    View Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No proposals found</p>
              <Button onClick={() => navigate('/leads/proposal-creator')}>
                Create Your First Proposal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Proposal</DialogTitle>
            <DialogDescription>
              Share this link with potential clients to view the proposal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-url">Proposal URL</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                />
                <Button onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalTemplates;
