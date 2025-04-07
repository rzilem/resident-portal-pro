
import { initializeStorageBuckets } from './storage/bucketManager';

/**
 * Initialize storage system
 * This function should be called once during application startup
 */
export const initializeStorage = async (): Promise<void> => {
  console.log('Initializing storage system...');
  await initializeStorageBuckets();
  console.log('Storage system initialized');
};
