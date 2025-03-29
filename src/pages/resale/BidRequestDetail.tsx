
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar,
  FileClock,
  Clock,
  User,
  Building,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { BidRequest, BidRequestVendor, bidRequestService } from '@/services/bidRequestService';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PROJECT_TYPES, PROJECT_QUESTIONS } from './wizard/bid-request-data';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const BidRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bidRequest, setBidRequest] = useState<BidRequest | null>(null);
  const [bidVendors, setBidVendors] = useState<BidRequestVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchBidRequestDetails = async () => {
      setLoading(true);
      try {
        const requestData = await bidRequestService.getBidRequestById(id);
        const vendorsData = await bidRequestService.getBidRequestVendors(id);
        
        if (requestData) {
          setBidRequest(requestData);
          setBidVendors(vendorsData);
        } else {
          toast.error('Bid request not found');
          navigate('/resale/bid-requests');
        }
      } catch (error) {
        console.error('Error fetching bid request details:', error);
        toast.error('Failed to load bid request details');
      } finally {
        setLoading(false);
      }
    };

    fetchBidRequestDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!bidRequest) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <Alert variant="destructive">
          <AlertTitle>Bid Request Not Found</AlertTitle>
          <AlertDescription>
            The bid request you are looking for could not be found. Please check the URL or go back to the bid requests page.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/resale/bid-requests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bid Requests
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    
    setUpdating(true);
    try {
      const success = await bidRequestService.updateBidRequestStatus(id, status);
      if (success) {
        setBidRequest(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      const success = await bidRequestService.deleteBidRequest(id);
      if (success) {
        navigate('/resale/bid-requests');
      }
    } catch (error) {
      console.error('Error deleting bid request:', error);
      toast.error('Failed to delete bid request');
    } finally {
      setDeleting(false);
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
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/resale/bid-requests')}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>
        
        <h1 className="text-2xl font-bold">Bid Request Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{getProjectTypeName(bidRequest.project_type)}</CardTitle>
                  <CardDescription>
                    Created on {format(new Date(bidRequest.created_at), 'MMMM d, yyyy')}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(bidRequest.status)}>{bidRequest.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {bidRequest.due_date && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Due by {format(new Date(bidRequest.due_date), 'MMMM d, yyyy')}</span>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Details</h3>
                <Card className="bg-muted/40">
                  <CardContent className="p-4">
                    {Object.entries(bidRequest.answers).map(([questionId, answer]) => {
                      // Find the question by ID across all project types
                      let question = null;
                      const questions = PROJECT_QUESTIONS[bidRequest.project_type] || [];
                      for (const q of questions) {
                        if (q.id === questionId) {
                          question = q;
                          break;
                        }
                      }
                      
                      return (
                        <div key={questionId} className="mb-3">
                          <p className="font-medium">{question?.text || questionId}</p>
                          <p>{typeof answer === 'object' ? JSON.stringify(answer) : answer?.toString()}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
              
              {bidRequest.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</h3>
                  <div className="p-4 bg-muted/40 rounded-md">
                    <p className="whitespace-pre-line">{bidRequest.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendor Responses</CardTitle>
              <CardDescription>
                Track responses from vendors for this bid request
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bidVendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileClock className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                  <p>No vendor responses yet</p>
                  <p className="text-sm mt-1">Vendors will appear here when they respond to your bid request</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bidVendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden">
                      <div className={`h-2 ${vendor.status === 'accepted' ? 'bg-green-500' : vendor.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Vendor {vendor.vendor_id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {vendor.response_date 
                                ? `Responded on ${format(new Date(vendor.response_date), 'MMM d, yyyy')}`
                                : 'Awaiting response'}
                            </p>
                          </div>
                          <Badge variant={vendor.status === 'accepted' ? 'success' : vendor.status === 'rejected' ? 'destructive' : 'outline'}>
                            {vendor.status}
                          </Badge>
                        </div>
                        
                        {vendor.bid_amount && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-md">
                            <p className="text-sm font-medium">Bid Amount:</p>
                            <p className="text-lg font-bold">${vendor.bid_amount.toFixed(2)}</p>
                          </div>
                        )}
                        
                        {vendor.estimated_completion_date && (
                          <div className="mt-3 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                              Estimated completion: {format(new Date(vendor.estimated_completion_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        
                        {vendor.response_notes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm mt-1 whitespace-pre-line">{vendor.response_notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message to Vendors</DialogTitle>
                    <DialogDescription>
                      Send a message to all vendors regarding this bid request.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button type="submit">Send Message</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    disabled={updating || bidRequest.status === 'accepted'}
                    onClick={() => handleStatusUpdate('accepted')}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={updating || bidRequest.status === 'rejected'}
                    onClick={() => handleStatusUpdate('rejected')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    disabled={deleting}
                  >
                    {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Delete Request
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the bid request and all associated data.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendor Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this link with vendors to allow them to submit bids
              </p>
              <div className="p-3 bg-muted/40 rounded-md">
                <code className="text-xs break-all text-blue-600">
                  https://vendor.example.com/bid/{id}
                </code>
              </div>
              <Button className="w-full" variant="outline">
                Copy Vendor Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BidRequestDetail;
