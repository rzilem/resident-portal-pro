
import { BidRequest, BidRequestVendor } from '@/services/bid-request';

export interface StatusUpdateProps {
  id: string;
  currentStatus: string;
  onStatusUpdate: (status: string) => void;
  updating: boolean;
}

export interface BidRequestActions {
  id: string;
  updating: boolean;
  deleting: boolean;
  onStatusUpdate: (status: string) => void;
  onDelete: () => void;
}

export interface ProjectInfoProps {
  bidRequest: BidRequest;
}

export interface VendorResponsesProps {
  bidVendors: BidRequestVendor[];
}

export interface VendorResponseCardProps {
  vendor: BidRequestVendor;
}

export interface VendorPortalProps {
  id: string;
}
