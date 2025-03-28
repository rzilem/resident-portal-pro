
/**
 * Amenity related templates
 */
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for amenity reservations
 */
export const generateAmenitiesTemplate = () => {
  const templateData = [{
    amenity_name: '',
    description: '',
    capacity: '',
    hours: '',
    reservation_fee: '',
    deposit_amount: '',
    rules: '',
    status: '' // 'active', 'inactive', 'maintenance'
  }];
  
  exportToExcel(templateData, 'Amenities_Template');
};
