
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye, Loader2, Check, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Document {
  id: string;
  name: string;
  url?: string;
  uploadDate: string;
  expirationDate?: string | null;
  isVerified?: boolean;
}

interface DocumentsCardProps {
  documents: Document[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents, isLoading = false, onRefresh }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getExpirationStatus = (expirationDate?: string | null) => {
    if (!expirationDate) return null;
    
    try {
      const expDate = new Date(expirationDate);
      
      if (isPast(expDate)) {
        return { status: 'expired', label: 'Expired', variant: 'destructive' as const };
      }
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      if (expDate <= thirtyDaysFromNow) {
        return { 
          status: 'expiring-soon', 
          label: `Expires ${formatDistanceToNow(expDate, { addSuffix: true })}`, 
          variant: 'warning' as const
        };
      }
      
      return { 
        status: 'valid', 
        label: `Expires ${formatDistanceToNow(expDate, { addSuffix: true })}`, 
        variant: 'outline' as const 
      };
    } catch (error) {
      return null;
    }
  };

  const handleDownload = (document: Document) => {
    if (!document.url) {
      toast.error('Document URL not available');
      return;
    }
    
    // Open the URL in a new tab
    window.open(document.url, '_blank');
  };

  const handleView = (document: Document) => {
    if (!document.url) {
      toast.error('Document URL not available');
      return;
    }
    
    // Open the URL in a new tab
    window.open(document.url, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Insurance Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </CardTitle>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground">No insurance documents uploaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Insurance Documents
        </CardTitle>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {documents.map(doc => {
            const expirationStatus = getExpirationStatus(doc.expirationDate);
            
            return (
              <div key={doc.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium flex items-center">
                    {doc.name}
                    {doc.isVerified !== undefined && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1">
                            {doc.isVerified ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Clock className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {doc.isVerified ? "Verified document" : "Pending verification"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Uploaded on {formatDate(doc.uploadDate)}
                  </div>
                  {expirationStatus && (
                    <Badge variant={expirationStatus.variant} className="mt-1 text-xs">
                      {expirationStatus.status === 'expired' ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : null}
                      {expirationStatus.label}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleView(doc)}
                    disabled={!doc.url}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownload(doc)}
                    disabled={!doc.url}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
