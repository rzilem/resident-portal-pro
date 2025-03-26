
import React, { useEffect } from 'react';
import { CircleDollarSign, AlertTriangle, FileText, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ResidentProfile, Tag } from '@/types/resident';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface CriticalInfoAreaProps {
  resident: ResidentProfile;
  onTagsChange?: (tags: Tag[]) => void;
}

const CriticalInfoArea: React.FC<CriticalInfoAreaProps> = ({ resident, onTagsChange }) => {
  // Calculate if there are recent violations (based on resident.violations data)
  const hasRecentViolations = resident.violations?.some(v => v.status === 'Open');
  
  // Check for recent ARC application from resident data
  const hasRecentArcApplication = resident.arcApplications?.some(app => 
    app.status === 'Pending' || app.status === 'More Info Needed'
  );

  // Tag management
  useEffect(() => {
    if (!resident.tags || !onTagsChange) return;
    
    let updatedTags = [...resident.tags];
    let hasChanged = false;
    
    // Handle violation tag
    const existingViolationTag = updatedTags.find(tag => tag.type === 'delinquent' && tag.label === 'Open Violation');
    
    if (hasRecentViolations && !existingViolationTag) {
      // Add violation tag
      updatedTags.push({
        id: uuidv4(),
        type: 'delinquent',
        label: 'Open Violation',
        color: '#dc2626', // red-600
        createdAt: new Date().toISOString()
      });
      hasChanged = true;
    } else if (!hasRecentViolations && existingViolationTag) {
      // Remove violation tag when no longer applicable
      updatedTags = updatedTags.filter(tag => tag.id !== existingViolationTag.id);
      hasChanged = true;
    }
    
    // Handle ARC application tag
    const existingArcTag = updatedTags.find(tag => tag.type === 'custom' && tag.label === 'Pending ARC Request');
    
    if (hasRecentArcApplication && !existingArcTag) {
      // Add ARC tag
      updatedTags.push({
        id: uuidv4(),
        type: 'custom',
        label: 'Pending ARC Request',
        color: '#0ea5e9', // sky-500
        createdAt: new Date().toISOString()
      });
      hasChanged = true;
    } else if (!hasRecentArcApplication && existingArcTag) {
      // Remove ARC tag when no longer applicable
      updatedTags = updatedTags.filter(tag => tag.id !== existingArcTag.id);
      hasChanged = true;
    }
    
    // Update tags if changes were made
    if (hasChanged) {
      onTagsChange(updatedTags);
    }
  }, [resident.violations, resident.arcApplications, resident.tags, hasRecentViolations, hasRecentArcApplication, onTagsChange]);
  
  // Mock data for last contact - would come from API in real implementation
  const lastContactInfo = {
    called: '2023-06-05',
    visitedOffice: '2023-05-20'
  };

  return (
    <Card className="mb-6 border-2 border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="py-4">
        <h3 className="text-lg font-semibold mb-3">Critical Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-sm text-amber-600 font-bold">
                    {resident.violations?.filter(v => v.status === 'Open').length || 1} Open Violation(s)
                  </p>
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
            <FileText className={`h-5 w-5 mt-0.5 ${hasRecentArcApplication ? 'text-blue-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">ARC Request (Last 60 Days)</p>
              {hasRecentArcApplication ? (
                <>
                  <p className="text-sm text-blue-600 font-bold">
                    Pending Request
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs bg-blue-100 text-blue-800 border-blue-200">
                    {resident.arcApplications?.find(app => app.status === 'Pending' || app.status === 'More Info Needed')?.status || 'Pending'}
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
