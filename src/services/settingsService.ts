
// This file is now a facade that re-exports the services from their individual files
import { userPreferencesService } from './userPreferencesService';
import { companySettingsService } from './companySettingsService';
import { integrationService } from './integrationService';

// Re-export the services with their original names for backward compatibility
export const settingsService = userPreferencesService;
export { companySettingsService, integrationService };
