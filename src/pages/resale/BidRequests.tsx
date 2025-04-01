import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { BidRequest, bidRequestService } from '@/services/bid-request';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { PROJECT_TYPES } from './wizard/bid-request-data';
import { TooltipButton } from '@/components/ui/tooltip-button';

const BidRequests: React.FC = () => {
  const navigate = useNavigate();
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [requestImages, setRequestImages] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadBidRequests();
  }, []);

  const loadBidRequests = async () => {
    setLoading(true);
    try {
      const requests = await bidRequestService.getBidRequests();
      setBidRequests(requests);
      
      const imageMap: Record<string, string[]> = {};
      for (const request of requests) {
        const { data, error } = await supabase
          .from('bid_request_images')
          .select('file_path')
          .eq('bid_request_id', request.id)
          .limit(1);
        
        if (!error && data && data.length > 0) {
          const { data: urlData } = supabase.storage
            .from('bid_request_images')
            .getPublicUrl(data[0].file_path);
          
          imageMap[request.id] = [urlData.publicUrl];
        }
      }
      
      setRequestImages(imageMap);
    } catch (error) {
      console.error('Error loading bid requests:', error);
      toast.error('Failed to load bid requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const success = await bidRequestService.deleteBidRequest(id);
      if (success) {
        setBidRequests(current => current.filter(req => req.id !== id));
      }
    } catch (error) {
      console.error('Error deleting bid request:', error);
      toast.error('Failed to delete bid request');
    } finally {
      setDeletingId(null);
    }
  };

  const getProjectTypeName = (typeId: string) => {
    const projectType = PROJECT_TYPES.find(type => type.id === typeId);
    return projectType?.name || typeId;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bid Requests</h1>
          <p className="text-muted-foreground">
            Manage your project bid requests and vendor responses
          </p>
        </div>
        <TooltipButton 
          onClick={() => navigate('/resale/bid-request')} 
          tooltipText="Create a new bid request"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Request
        </TooltipButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : bidRequests.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <PlusCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bid requests yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first bid request to get quotes from vendors for your project
            </p>
            <TooltipButton 
              onClick={() => navigate('/resale/bid-request')}
              tooltipText="Create your first bid request"
            >
              Create Bid Request
            </TooltipButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bidRequests.map(request => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{getProjectTypeName(request.project_type)}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                </div>
                <CardDescription>
                  Created on {format(new Date(request.created_at), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requestImages[request.id] && requestImages[request.id].length > 0 && (
                  <div className="mb-4">
                    <img 
                      src={requestImages[request.id][0]} 
                      alt="Project thumbnail" 
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                  </div>
                )}
                
                {request.due_date && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due by {format(new Date(request.due_date), 'MMM d, yyyy')}
                  </div>
                )}

                {request.notes && (
                  <p className="text-sm line-clamp-3">{request.notes}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <TooltipButton 
                      variant="outline" 
                      size="sm"
                      disabled={deletingId === request.id}
                      tooltipText="Delete this bid request"
                    >
                      {deletingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </TooltipButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the bid request and all vendor responses.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(request.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <TooltipButton 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate(`/resale/bid-requests/${request.id}`)}
                  tooltipText="View bid request details"
                >
                  View Details
                  <ExternalLink className="h-4 w-4 ml-2" />
                </TooltipButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidRequests;
