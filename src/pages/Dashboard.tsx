
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, AlertTriangle, FileText, Settings } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Dashboard = () => {
  const { user } = useUser();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Welcome, {user?.profile?.first_name || 'User'}
      </h1>
      <p className="text-muted-foreground mb-6">
        Manage your HOA properties, finances, and compliance from your dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Management Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Management
            </CardTitle>
            <CardDescription>Manage fees, payments, and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link 
                to="/financial/transactions" 
                className="flex items-center text-sm hover:underline py-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Transactions
              </Link>
              <Link 
                to="/financial/payments" 
                className="flex items-center text-sm hover:underline py-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Payments
              </Link>
              <Link 
                to="/financial/finances" 
                className="flex items-center text-sm hover:underline py-1"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Association Finances
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Management Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Compliance Management
            </CardTitle>
            <CardDescription>Track violations and compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link 
                to="/compliance" 
                className="flex items-center text-sm hover:underline py-1"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Compliance Overview
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Association Settings
            </CardTitle>
            <CardDescription>Configure your association</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link 
                to="/settings" 
                className="flex items-center text-sm hover:underline py-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
