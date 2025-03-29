
import { createBidRequest } from './create';
import { getBidRequests, getBidRequestById, getBidRequestVendors } from './read';
import { updateBidRequestStatus } from './update';
import { deleteBidRequest } from './delete';

// Re-export types using the 'export type' syntax for isolatedModules
export type { BidRequest, BidRequestVendor } from './types';

// Re-export all functionality
export {
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
