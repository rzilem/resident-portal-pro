
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for amenities
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

/**
 * Generate and download a template for resident pet information
 */
export const generatePetTemplate = () => {
  const templateData = [{
    unit_number: '',
    resident_name: '',
    pet_name: '',
    pet_type: '', // 'dog', 'cat', 'bird', 'other'
    breed: '',
    color: '',
    weight: '',
    license_number: '',
    vaccination_date: '',
    emergency_contact: ''
  }];
  
  exportToExcel(templateData, 'Pet_Registration_Template');
};

/**
 * Generate and download a template for vehicle registration
 */
export const generateVehicleTemplate = () => {
  const templateData = [{
    unit_number: '',
    resident_name: '',
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    state: '',
    parking_spot: '',
    permit_number: ''
  }];
  
  exportToExcel(templateData, 'Vehicle_Registration_Template');
};
