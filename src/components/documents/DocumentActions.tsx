
import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  Pencil, 
  Trash2, 
  Share, 
  Copy, 
  Mail, 
  Clock, 
  Users, 
  Link 
} from 'lucide-react';
import { DocumentFile } from '@/types/documents';

interface DocumentActionsProps {
  document: DocumentFile;
  onView: (document: DocumentFile) => void;
  onEdit?: (document: DocumentFile) => void;
  onDelete?: (document: DocumentFile) => void;
  refreshDocuments?: () => void;  // Add refreshDocuments prop
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  refreshDocuments  // Add refreshDocuments to destructuring
}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [allowDownload, setAllowDownload] = useState(true);
  
  const handleShare = () => {
    setIsShareDialogOpen(true);
    // Generate a mock sharing link
    setShareLink(`https://app.example.com/documents/share/${document.id}?token=mocktoken123`);
  };
  
  const handleSendInvite = () => {
    if (!shareEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Simulate sending an invite
    toast.success(`Invite sent to ${shareEmail}`);
    setShareEmail('');
    if (refreshDocuments) refreshDocuments();  // Refresh after sharing
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };
  
  const handleDownload = () => {
    // Simulate file download
    toast.success(`Downloading ${document.name}`);
    // In a real app, this would trigger a file download
  };
  
  const confirmDelete = () => {
    if (onDelete) {
      // In a real app, this would show a confirmation dialog
      onDelete(document);
      if (refreshDocuments) refreshDocuments();  // Refresh after delete
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onView(document)}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
          
          {onEdit && (
            <DropdownMenuItem onClick={() => { 
              onEdit(document);
              if (refreshDocuments) refreshDocuments();  // Refresh after edit
            }}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {onDelete && (
            <DropdownMenuItem 
              onClick={confirmDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Share Document
            </DialogTitle>
            <DialogDescription>
              Share "{document.name}" with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Share via Link</h3>
              <div className="flex gap-2">
                <Input 
                  value={shareLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={copyShareLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiration">Link Expiration</Label>
                  <div className="flex gap-2 items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <select 
                      id="expiration"
                      value={expirationDays}
                      onChange={(e) => setExpirationDays(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="never">No expiration</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allow-download">Allow Download</Label>
                  <div className="flex justify-between items-center">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <Switch 
                      id="allow-download"
                      checked={allowDownload}
                      onCheckedChange={setAllowDownload}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Share via Email</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={shareEmail} 
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <Button onClick={handleSendInvite}>Send</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Already shared with
                </Label>
              </div>
              
              <div className="text-sm text-muted-foreground">
                No one has access to this document yet
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentActions;
