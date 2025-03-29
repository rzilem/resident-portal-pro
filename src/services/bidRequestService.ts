
// This file is maintained for backward compatibility
// Import from the refactored modules and re-export
import { 
  bidRequestService 
} from './bid-request';

// Re-export types using the 'export type' syntax for isolatedModules
export type { BidRequest, BidRequestVendor } from './bid-request/types';

// Re-export the service object
export { bidRequestService };
