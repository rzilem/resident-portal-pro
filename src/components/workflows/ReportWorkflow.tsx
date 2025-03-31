
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, CalendarClock, Send, Check, Clock } from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface ReportSelectionItem {
  id: string;
  name: string;
  type: string;
  selected: boolean;
}

const ReportWorkflow = () => {
  const { associations } = useAssociations();
  const { toast } = useToast();
  
  // Financial reports
  const financialReports: ReportSelectionItem[] = [
    { id: 'financial-summary', name: 'Financial Summary', type: 'financial', selected: true },
    { id: 'balance-sheet-consolidated', name: 'Balance Sheet - Consolidated', type: 'financial', selected: true },
    { id: 'bank-balances', name: 'Bank Account Balances', type: 'financial', selected: true },
    { id: 'cash-forecast', name: 'Cash Forecast Report', type: 'financial', selected: false },
    { id: 'budget', name: 'Budget', type: 'financial', selected: false },
    { id: 'budget-per-unit-monthly', name: 'Budget w/ Per Unit Cost (Monthly)', type: 'financial', selected: false },
  ];
  
  // Property reports
  const propertyReports: ReportSelectionItem[] = [
    { id: 'association-list', name: 'Association List', type: 'property', selected: false },
    { id: 'collections', name: 'Collections Report', type: 'property', selected: true },
    { id: 'open-invoices', name: 'Open Invoices Report', type: 'property', selected: false },
    { id: 'violations', name: 'Violations Report', type: 'property', selected: true },
    { id: 'work-order', name: 'Work Order Summary', type: 'property', selected: false },
  ];
  
  // Resident reports
  const residentReports: ReportSelectionItem[] = [
    { id: 'resident-overview', name: 'Resident Overview', type: 'resident', selected: false },
    { id: 'statement-last-month', name: 'Statement (Last Month)', type: 'resident', selected: false },
    { id: 'board-members', name: 'All Board Members', type: 'resident', selected: false },
    { id: 'transaction-history', name: 'Homeowner Transaction History', type: 'resident', selected: false },
  ];
  
  const [reportsList, setReportsList] = useState({
    financial: financialReports,
    property: propertyReports,
    resident: residentReports
  });
  
  const [selectedAssociations, setSelectedAssociations] = useState(
    associations.map(a => ({ ...a, selected: a.status === 'active' }))
  );
  
  const [deliverySettings, setDeliverySettings] = useState({
    frequency: 'monthly',
    dayOfMonth: '1',
    includeEmailBody: true,
    ccBoardMembers: true,
    includeAllInOne: true,
    separateReports: false
  });
  
  const toggleReportSelection = (type: 'financial' | 'property' | 'resident', id: string) => {
    setReportsList(prev => ({
      ...prev,
      [type]: prev[type].map(report => 
        report.id === id ? { ...report, selected: !report.selected } : report
      )
    }));
  };
  
  const toggleAssociationSelection = (id: string) => {
    setSelectedAssociations(prev => 
      prev.map(assoc => 
        assoc.id === id ? { ...assoc, selected: !assoc.selected } : assoc
      )
    );
  };
  
  const handleSaveWorkflow = () => {
    // Get all selected reports
    const selectedReports = [
      ...reportsList.financial.filter(r => r.selected),
      ...reportsList.property.filter(r => r.selected),
      ...reportsList.resident.filter(r => r.selected)
    ];
    
    // Get all selected associations
    const selectedAssocs = selectedAssociations.filter(a => a.selected);
    
    toast({
      title: "Workflow Saved",
      description: `Monthly report workflow created with ${selectedReports.length} reports for ${selectedAssocs.length} associations.`,
    });
    
    console.log({
      reports: selectedReports,
      associations: selectedAssocs,
      delivery: deliverySettings
    });
  };
  
  const handleTestWorkflow = () => {
    toast({
      title: "Test Email Sent",
      description: "A test report package has been emailed to your account.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Monthly Association Reports Workflow
          </CardTitle>
          <CardDescription>
            Configure which reports to include in monthly packages for each association
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Reports Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Select Reports to Include</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Financial Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {reportsList.financial.map(report => (
                    <div key={report.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={report.id} 
                        checked={report.selected}
                        onCheckedChange={() => toggleReportSelection('financial', report.id)}
                      />
                      <label
                        htmlFor={report.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {report.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Property Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {reportsList.property.map(report => (
                    <div key={report.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={report.id} 
                        checked={report.selected}
                        onCheckedChange={() => toggleReportSelection('property', report.id)}
                      />
                      <label
                        htmlFor={report.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {report.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Resident Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {reportsList.resident.map(report => (
                    <div key={report.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={report.id} 
                        checked={report.selected}
                        onCheckedChange={() => toggleReportSelection('resident', report.id)}
                      />
                      <label
                        htmlFor={report.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {report.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Select Associations Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Select Associations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedAssociations.map(assoc => (
                <div key={assoc.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`assoc-${assoc.id}`} 
                    checked={assoc.selected}
                    onCheckedChange={() => toggleAssociationSelection(assoc.id)}
                  />
                  <label
                    htmlFor={`assoc-${assoc.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {assoc.name} {assoc.status === 'inactive' && <span className="text-muted-foreground">(Inactive)</span>}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Delivery Options Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Delivery Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Frequency</label>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>Monthly</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Day of Month</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>1st day of the month</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-email-body" 
                    checked={deliverySettings.includeEmailBody}
                    onCheckedChange={(checked) => 
                      setDeliverySettings(prev => ({ ...prev, includeEmailBody: !!checked }))
                    }
                  />
                  <label
                    htmlFor="include-email-body"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include summary in email body
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cc-board" 
                    checked={deliverySettings.ccBoardMembers}
                    onCheckedChange={(checked) => 
                      setDeliverySettings(prev => ({ ...prev, ccBoardMembers: !!checked }))
                    }
                  />
                  <label
                    htmlFor="cc-board"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    CC association board members
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="all-in-one" 
                    checked={deliverySettings.includeAllInOne}
                    onCheckedChange={(checked) => 
                      setDeliverySettings(prev => ({ ...prev, includeAllInOne: !!checked }))
                    }
                  />
                  <label
                    htmlFor="all-in-one"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include all reports in one PDF
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="separate-reports" 
                    checked={deliverySettings.separateReports}
                    onCheckedChange={(checked) => 
                      setDeliverySettings(prev => ({ ...prev, separateReports: !!checked }))
                    }
                  />
                  <label
                    htmlFor="separate-reports"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Attach individual report PDFs
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleTestWorkflow} className="gap-2">
          <Send className="h-4 w-4" />
          Send Test Email
        </Button>
        <Button onClick={handleSaveWorkflow} className="gap-2">
          <Check className="h-4 w-4" />
          Save Workflow
        </Button>
      </div>
    </div>
  );
};

export default ReportWorkflow;
