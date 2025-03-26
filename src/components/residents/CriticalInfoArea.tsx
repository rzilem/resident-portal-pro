
import React from 'react';
import { CircleDollarSign, AlertTriangle, FileText, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ResidentProfile } from '@/types/resident';
import { Badge } from '@/components/ui/badge';

interface CriticalInfoAreaProps {
  resident: ResidentProfile;
}

const CriticalInfoArea: React.FC<CriticalInfoAreaProps> = ({ resident }) => {
  // Calculate if there are recent violations (mock data for now)
  const hasRecentViolations = resident.tags?.some(tag => tag.type === 'delinquent');
  
  // Mock data for recent ARC application - would come from API in real implementation
  const recentArcApplication = {
    exists: resident.id === 101, // Just for demo purposes
    date: '2023-05-15',
    status: 'Pending'
  };
  
  // Mock data for last contact - would come from API in real implementation
  const lastContactInfo = {
    called: '2023-06-05',
    visitedOffice: '2023-05-20'
  };

  return (
    <Card className="w-72 border-2 border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="py-4">
        <h3 className="text-lg font-semibold mb-3">Critical Information</h3>
        
        <div className="space-y-3">
          {/* Financial Status */}
          <div className="flex items-start gap-2">
            <CircleDollarSign className={`h-5 w-5 mt-0.5 ${resident.balance !== '$0.00' ? 'text-red-500' : 'text-green-500'}`} />
            <div>
              <p className="text-sm font-medium">Current Balance</p>
              <p className={`text-sm font-bold ${resident.balance !== '$0.00' ? 'text-red-600' : 'text-green-600'}`}>
                {resident.balance}
              </p>
              {resident.balance !== '$0.00' && (
                <Badge variant="outline" className="mt-1 text-xs bg-red-100 text-red-800 border-red-200">
                  Attention Required
                </Badge>
              )}
            </div>
          </div>
          
          {/* Recent Violations */}
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${hasRecentViolations ? 'text-amber-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">Violations (Last 30 Days)</p>
              {hasRecentViolations ? (
                <>
                  <p className="text-sm text-amber-600 font-bold">1 Open Violation</p>
                  <Badge variant="outline" className="mt-1 text-xs bg-amber-100 text-amber-800 border-amber-200">
                    Action Required
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-gray-600">No Recent Violations</p>
              )}
            </div>
          </div>
          
          {/* Recent ARC Application */}
          <div className="flex items-start gap-2">
            <FileText className={`h-5 w-5 mt-0.5 ${recentArcApplication.exists ? 'text-blue-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">ARC Request (Last 60 Days)</p>
              {recentArcApplication.exists ? (
                <>
                  <p className="text-sm text-blue-600 font-bold">
                    Submitted on {recentArcApplication.date}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs bg-blue-100 text-blue-800 border-blue-200">
                    {recentArcApplication.status}
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-gray-600">No Recent Requests</p>
              )}
            </div>
          </div>
          
          {/* Last Contact */}
          <div className="flex items-start gap-2">
            <Phone className="h-5 w-5 mt-0.5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium">Last Contact</p>
              <p className="text-sm">
                <span className="font-semibold">Called:</span> {lastContactInfo.called}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Office Visit:</span> {lastContactInfo.visitedOffice}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalInfoArea;
