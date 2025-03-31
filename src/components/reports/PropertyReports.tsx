
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PropertyReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
  properties?: any[];
  onExport?: (format: string) => void;
  onTemplateDownload?: () => void;
}

const PropertyReports: React.FC<PropertyReportsProps> = ({
  timeRange,
  association,
  selectedReport
}) => {
  // Mock data
  const propertyTypeData = [
    { name: 'Single Family', value: 45 },
    { name: 'Condo', value: 30 },
    { name: 'Townhouse', value: 15 },
    { name: 'Multi-Family', value: 10 }
  ];
  
  const occupancyData = [
    { name: 'Jan', occupied: 120, vacant: 20 },
    { name: 'Feb', occupied: 125, vacant: 15 },
    { name: 'Mar', occupied: 130, vacant: 10 },
    { name: 'Apr', occupied: 132, vacant: 8 },
    { name: 'May', occupied: 135, vacant: 5 },
    { name: 'Jun', occupied: 138, vacant: 2 }
  ];
  
  const maintenanceData = [
    { name: 'HVAC', count: 35 },
    { name: 'Plumbing', count: 28 },
    { name: 'Electrical', count: 22 },
    { name: 'Structural', count: 15 },
    { name: 'Landscaping', count: 42 },
    { name: 'Appliances', count: 19 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50'];
  
  const renderPropertyOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Property Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Occupancy Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" name="Occupied" fill="#4f46e5" />
                <Bar dataKey="vacant" name="Vacant" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Maintenance Requests by Type</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={maintenanceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Requests" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderOccupancyReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Occupancy Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" name="Occupied" fill="#4f46e5" />
              <Bar dataKey="vacant" name="Vacant" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Current Occupancy Rate</h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600">96.5%</div>
              <p className="text-sm text-muted-foreground mt-2">Overall occupancy rate</p>
              <p className="text-sm text-green-600 mt-4">+2.5% compared to last year</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Turnover Rate</h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600">8.2%</div>
              <p className="text-sm text-muted-foreground mt-2">Annual turnover rate</p>
              <p className="text-sm text-red-600 mt-4">-1.3% compared to last year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderMaintenanceReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Maintenance Requests by Type</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={maintenanceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Requests" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Total Requests</h3>
          <div className="text-3xl font-bold">161</div>
          <p className="text-sm text-muted-foreground mt-1">In the last 6 months</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Avg. Resolution Time</h3>
          <div className="text-3xl font-bold">3.2 days</div>
          <p className="text-sm text-green-600 mt-1">-0.5 days vs. previous period</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Open Requests</h3>
          <div className="text-3xl font-bold">12</div>
          <p className="text-sm text-amber-600 mt-1">7.5% of total requests</p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Cost by Maintenance Type</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Cost ($)" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderAmenitiesReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Amenities Usage</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Pool', usage: 75 },
                { name: 'Gym', usage: 60 },
                { name: 'Community Room', usage: 45 },
                { name: 'Tennis Courts', usage: 30 },
                { name: 'Playground', usage: 55 },
                { name: 'BBQ Area', usage: 40 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Usage Rate']} />
              <Legend />
              <Bar dataKey="usage" name="Usage Rate (%)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Amenity Satisfaction</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Very Satisfied', value: 45 },
                    { name: 'Satisfied', value: 35 },
                    { name: 'Neutral', value: 15 },
                    { name: 'Dissatisfied', value: 5 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[...Array(4)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Amenity Maintenance Costs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pool', value: 40 },
                    { name: 'Gym', value: 20 },
                    { name: 'Community Room', value: 15 },
                    { name: 'Tennis Courts', value: 10 },
                    { name: 'Playground', value: 5 },
                    { name: 'BBQ Area', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[...Array(6)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage of Budget']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      {selectedReport === 'overview' && renderPropertyOverview()}
      {selectedReport === 'occupancy' && renderOccupancyReport()}
      {selectedReport === 'maintenance' && renderMaintenanceReport()}
      {selectedReport === 'amenities' && renderAmenitiesReport()}
    </div>
  );
};

export default PropertyReports;
