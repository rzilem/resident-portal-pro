
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ResidentReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const ResidentReports: React.FC<ResidentReportsProps> = ({
  timeRange,
  association,
  selectedReport
}) => {
  // Mock data
  const residentStatusData = [
    { name: 'Owner-Occupied', value: 65 },
    { name: 'Tenant', value: 25 },
    { name: 'Vacant', value: 10 }
  ];
  
  const complianceData = [
    { name: 'Jan', compliant: 95, non_compliant: 5 },
    { name: 'Feb', compliant: 93, non_compliant: 7 },
    { name: 'Mar', compliant: 96, non_compliant: 4 },
    { name: 'Apr', compliant: 97, non_compliant: 3 },
    { name: 'May', compliant: 98, non_compliant: 2 },
    { name: 'Jun', compliant: 96, non_compliant: 4 }
  ];
  
  const communicationData = [
    { name: 'Jan', emails_sent: 450, emails_opened: 315, response_rate: 70 },
    { name: 'Feb', emails_sent: 420, emails_opened: 294, response_rate: 65 },
    { name: 'Mar', emails_sent: 480, emails_opened: 336, response_rate: 68 },
    { name: 'Apr', emails_sent: 510, emails_opened: 383, response_rate: 72 },
    { name: 'May', emails_sent: 500, emails_opened: 385, response_rate: 75 },
    { name: 'Jun', emails_sent: 525, emails_opened: 420, response_rate: 78 }
  ];
  
  const demographicsData = [
    { age_group: '18-24', count: 5 },
    { age_group: '25-34', count: 25 },
    { age_group: '35-44', count: 30 },
    { age_group: '45-54', count: 20 },
    { age_group: '55-64', count: 15 },
    { age_group: '65+', count: 5 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50'];
  
  const renderResidentOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Resident Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={residentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {residentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Age Demographics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
                <Bar dataKey="count" name="Percentage (%)" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Community Engagement</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={communicationData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="emails_sent" name="Emails Sent" stroke="#8884d8" />
              <Line yAxisId="left" type="monotone" dataKey="emails_opened" name="Emails Opened" stroke="#82ca9d" />
              <Line yAxisId="right" type="monotone" dataKey="response_rate" name="Response Rate (%)" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderDemographicsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Age Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
                <Bar dataKey="count" name="Percentage (%)" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Household Size</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '1 Person', value: 30 },
                    { name: '2 People', value: 40 },
                    { name: '3 People', value: 15 },
                    { name: '4+ People', value: 15 }
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Length of Residence</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '< 1 Year', value: 15 },
                    { name: '1-3 Years', value: 30 },
                    { name: '3-5 Years', value: 25 },
                    { name: '5-10 Years', value: 20 },
                    { name: '10+ Years', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[...Array(5)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Owner vs. Tenant</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Owner-Occupied', value: 65 },
                    { name: 'Tenant', value: 25 },
                    { name: 'Vacant', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[...Array(3)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderComplianceReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Compliance Rate</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
              <Bar dataKey="compliant" name="Compliant (%)" fill="#4ade80" />
              <Bar dataKey="non_compliant" name="Non-Compliant (%)" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Current Compliance</h3>
          <div className="text-3xl font-bold">96%</div>
          <p className="text-sm text-green-600 mt-1">+2% from last period</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Open Violations</h3>
          <div className="text-3xl font-bold">12</div>
          <p className="text-sm text-amber-600 mt-1">4 require immediate action</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Avg. Resolution Time</h3>
          <div className="text-3xl font-bold">7.5 days</div>
          <p className="text-sm text-green-600 mt-1">-1.2 days vs. previous period</p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Violations by Type</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Trash/Debris', value: 35 },
                  { name: 'Parking', value: 25 },
                  { name: 'Noise', value: 15 },
                  { name: 'Landscaping', value: 15 },
                  { name: 'Pet Issues', value: 10 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {[...Array(5)].map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderCommunicationsReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Email Engagement</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={communicationData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="emails_sent" name="Emails Sent" stroke="#8884d8" />
              <Line yAxisId="left" type="monotone" dataKey="emails_opened" name="Emails Opened" stroke="#82ca9d" />
              <Line yAxisId="right" type="monotone" dataKey="response_rate" name="Response Rate (%)" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Avg. Open Rate</h3>
          <div className="text-3xl font-bold">75%</div>
          <p className="text-sm text-green-600 mt-1">+5% from industry average</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Avg. Response Rate</h3>
          <div className="text-3xl font-bold">32%</div>
          <p className="text-sm text-green-600 mt-1">+7% from last period</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Digital Adoption</h3>
          <div className="text-3xl font-bold">88%</div>
          <p className="text-sm text-muted-foreground mt-1">% using digital communications</p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Communication Channels</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Email', value: 60 },
                  { name: 'Mobile App', value: 20 },
                  { name: 'SMS', value: 15 },
                  { name: 'Physical Mail', value: 5 }
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
    </div>
  );
  
  return (
    <div>
      {selectedReport === 'resident-overview' && renderResidentOverview()}
      {selectedReport === 'demographics' && renderDemographicsReport()}
      {selectedReport === 'compliance' && renderComplianceReport()}
      {selectedReport === 'communications' && renderCommunicationsReport()}
    </div>
  );
};

export default ResidentReports;
