
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>
          <p className="text-gray-600">Manage your properties</p>
          <div className="mt-4">
            <a href="/properties" className="text-blue-600 hover:text-blue-800">View Properties →</a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Residents</h2>
          <p className="text-gray-600">Manage community residents</p>
          <div className="mt-4">
            <a href="/residents" className="text-blue-600 hover:text-blue-800">View Residents →</a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Accounting</h2>
          <p className="text-gray-600">View financial information</p>
          <div className="mt-4">
            <a href="/accounting/dashboard" className="text-blue-600 hover:text-blue-800">Go to Accounting →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
