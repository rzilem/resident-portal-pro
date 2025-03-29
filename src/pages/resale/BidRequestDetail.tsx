
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  BuildingIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { BidRequest, BidRequestVendor, bidRequestService } from '@/services/bidRequestService';
import { toast } from 'sonner';
import { PROJECT_TYPES, PROJECT_TYPE_QUESTIONS } from './wizard/bid-request-data';
import { Question } from './wizard/types';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const BidRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bidRequest, setBidRequest] = useState<BidRequest | null>(null);
  const [vendors, setVendors] = useState<BidRequestVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBidRequest(id);
    }
  }, [id]);

  const loadBidRequest = async (requestId: string) => {
    setLoading(true);
    try {
      const request = await bidRequestService.getBidRequestById(requestId);
      if (request) {
        setBidRequest(request);
        const vendorData = await bidRequestService.getBidRequestVendors(requestId);
        setVendors(vendorData);
      } else {
        toast.error('Bid request not found');
        navigate('/resale/bid-requests');
      }
    } catch (error) {
      console.error('Error loading bid request:', error);
      toast.error('Failed to load bid request details');
    } finally {
      setLoading(false);
    }
  };

  const getProjectType = () => {
    if (!bidRequest) return null;
    return PROJECT_TYPES.find(type => type.id === bidRequest.project_type);
  };

  const getQuestions = () => {
    const projectType = getProjectType();
    if (!projectType) return [];
    return PROJECT_TYPE_QUESTIONS[projectType.id] || [];
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

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!bidRequest) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Bid Request Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The bid request you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/resale/bid-requests')}>
            Back to Bid Requests
          </Button>
        </div>
      </div>
    );
  }

  const projectType = getProjectType();
  const questions = getQuestions();

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/resale/bid-requests')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bid Requests
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{projectType?.name || 'Project'}</CardTitle>
                  <CardDescription>
                    Created on {format(new Date(bidRequest.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(bidRequest.status)}>
                  {bidRequest.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bidRequest.due_date && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Due by {format(new Date(bidRequest.due_date), 'MMMM d, yyyy')}</span>
                  </div>
                )}

                {bidRequest.notes && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Additional Notes</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{bidRequest.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Information provided for this bid request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question: Question) => {
                  const answer = bidRequest.answers[question.id];
                  if (!answer) return null;

                  return (
                    <div key={question.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <h3 className="text-sm font-medium mb-1">{question.question}</h3>
                      <p className="text-sm text-muted-foreground">{answer}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Responses</CardTitle>
              <CardDescription>
                Bids received from vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="mx-auto h-10 w-10 mb-3 opacity-50" />
                  <p>Waiting for vendor responses</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bid Amount</TableHead>
                      <TableHead>Response Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map(vendor => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.vendor_id}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vendor.bid_amount 
                            ? `$${vendor.bid_amount.toLocaleString()}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {vendor.response_date 
                            ? format(new Date(vendor.response_date), 'MMM d, yyyy')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(bidRequest.status)}>
                      {bidRequest.status}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Project Type</span>
                  <p className="font-medium mt-1">{projectType?.name}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Created On</span>
                  <p className="font-medium mt-1">
                    {format(new Date(bidRequest.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                {bidRequest.due_date && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">Due Date</span>
                      <p className="font-medium mt-1">
                        {format(new Date(bidRequest.due_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Vendors</span>
                  <p className="font-medium mt-1">{vendors.length} vendors contacted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Contact Vendors
              </Button>
              <Button className="w-full" variant="outline">
                <BuildingIcon className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BidRequestDetail;
