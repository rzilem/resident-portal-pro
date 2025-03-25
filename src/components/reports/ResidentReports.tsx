import React from 'react';
import { Users } from 'lucide-react';
import ResidentOverviewReport from './resident/ResidentOverviewReport';
import ContactInfoReport from './resident/ContactInfoReport';
import BoardMembersReport from './resident/BoardMembersReport';
import TransactionHistoryReport from './resident/TransactionHistoryReport';
import MeetingReport from './resident/MeetingReport';
import HomeownerStatementReport from './resident/HomeownerStatementReport';

interface ResidentReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const ResidentReports = ({ timeRange, association, selectedReport }: ResidentReportsProps) => {
  // Render different resident reports based on the selected report
  const renderReportContent = () => {
    // Statement-related reports
    if (selectedReport.startsWith('statement-') || selectedReport === 'homeowner-invoice') {
      return <HomeownerStatementReport 
        timeRange={timeRange} 
        association={association} 
        selectedReport={selectedReport} 
      />;
    }
    
    // Other existing reports
    switch (selectedReport) {
      case 'resident-overview':
        return <ResidentOverviewReport timeRange={timeRange} association={association} />;
        
      case 'contact-info':
      case 'all-addresses':
      case 'current-addresses':
        return <ContactInfoReport 
          timeRange={timeRange} 
          association={association} 
          selectedReport={selectedReport} 
        />;
        
      case 'board-members':
        return <BoardMembersReport timeRange={timeRange} association={association} />;
        
      case 'transaction-history':
      case 'transaction-by-charge':
        return <TransactionHistoryReport 
          timeRange={timeRange} 
          association={association} 
          selectedReport={selectedReport} 
        />;
        
      case 'meeting-signin':
      case 'meeting-consolidated':
        return <MeetingReport 
          timeRange={timeRange} 
          association={association} 
          selectedReport={selectedReport} 
        />;
        
      default:
        return (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Users className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Select a Resident Report</h3>
                <p className="text-muted-foreground">Choose a report type from the dropdown above to view resident data</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div>{renderReportContent()}</div>;
};

export default ResidentReports;
