
import React from 'react';
import { Property } from '@/components/properties/PropertyHelpers';

interface PropertyListReportProps {
  properties: Property[];
  timeRange: string;
  association: string;
}

const PropertyListReport: React.FC<PropertyListReportProps> = ({ 
  properties, 
  timeRange,
  association
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">{association} Properties</h3>
        <p className="text-muted-foreground">{timeRange}</p>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-3 font-medium">Property</th>
            <th className="text-left pb-3 font-medium">Units</th>
            <th className="text-left pb-3 font-medium">Status</th>
            <th className="text-left pb-3 font-medium">Annual Fees</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr key={property.id || index} className="border-b border-gray-100">
              <td className="py-3">
                {property.address || property.location}
                {property.name && <div className="text-xs text-muted-foreground">{property.name}</div>}
              </td>
              <td className="py-3">{property.units}</td>
              <td className="py-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </span>
              </td>
              <td className="py-3">${property.annualFees.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyListReport;
