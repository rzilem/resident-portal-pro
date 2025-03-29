
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { BidRequest, bidRequestService } from '@/services/bidRequestService';
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

const BidRequests: React.FC = () => {
  const navigate = useNavigate();
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadBidRequests();
  }, []);

  const loadBidRequests = async () => {
    setLoading(true);
    try {
      const requests = await bidRequestService.getBidRequests();
      setBidRequests(requests);
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
        <Button onClick={() => navigate('/resale/bid-request')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Request
        </Button>
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
            <Button onClick={() => navigate('/resale/bid-request')}>
              Create Bid Request
            </Button>
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={deletingId === request.id}
                    >
                      {deletingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
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

                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate(`/resale/bid-requests/${request.id}`)}
                >
                  View Details
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidRequests;
