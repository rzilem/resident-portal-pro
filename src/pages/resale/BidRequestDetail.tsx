
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BidRequest, BidRequestVendor, bidRequestService } from '@/services/bid-request';
import { toast } from 'sonner';

// Import our newly created components
import LoadingState from './bid-request-detail/LoadingState';
import NotFoundState from './bid-request-detail/NotFoundState';
import ProjectInfo from './bid-request-detail/ProjectInfo';
import VendorResponses from './bid-request-detail/VendorResponses';
import ActionsCard from './bid-request-detail/ActionsCard';
import VendorPortal from './bid-request-detail/VendorPortal';
import StatusActions from './bid-request-detail/StatusActions';

const BidRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bidRequest, setBidRequest] = useState<BidRequest | null>(null);
  const [bidVendors, setBidVendors] = useState<BidRequestVendor[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <LoadingState />;
  }

  if (!bidRequest) {
    return <NotFoundState />;
  }

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
          <ProjectInfo bidRequest={bidRequest} />
          <VendorResponses bidVendors={bidVendors} />
        </div>
        
        <div className="space-y-6">
          <ActionsCard 
            id={id || ''} 
            updating={updating}
            deleting={deleting}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
          
          <VendorPortal id={id || ''} />
        </div>
      </div>
    </div>
  );
};

export default BidRequestDetail;
