
import { BidRequest, BidRequestVendor } from './types';
import { createBidRequest } from './create';
import { getBidRequests, getBidRequestById, getBidRequestVendors } from './read';
import { updateBidRequestStatus } from './update';
import { deleteBidRequest } from './delete';

// Re-export all functionality for backward compatibility
export { 
  BidRequest, 
  BidRequestVendor,
  createBidRequest,
  getBidRequests,
  getBidRequestById,
  getBidRequestVendors,
  updateBidRequestStatus,
  deleteBidRequest
};

// Export as a single service object to maintain the existing API
export const bidRequestService = {
  createBidRequest,
  getBidRequests,
  getBidRequestById,
  getBidRequestVendors,
  updateBidRequestStatus,
  deleteBidRequest
};
