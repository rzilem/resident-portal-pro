
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import ResidentOverviewReport from './resident/ResidentOverviewReport';
import HomeownerStatementReport from './resident/HomeownerStatementReport';
import ContactInfoReport from './resident/ContactInfoReport';
import BoardMembersReport from './resident/BoardMembersReport';
import TransactionHistoryReport from './resident/TransactionHistoryReport';
import MeetingReport from './resident/MeetingReport';

interface ResidentReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const ResidentReports: React.FC<ResidentReportsProps> = ({
  timeRange,
  association,
  selectedReport,
}) => {
  // Log when association changes so we can see it's being updated properly
  useEffect(() => {
    console.log("ResidentReports: association changed to", association);
  }, [association]);

  return (
    <Card className="p-6">
      {selectedReport === 'resident-overview' && (
        <ResidentOverviewReport timeRange={timeRange} association={association} />
      )}
      
      {(selectedReport.startsWith('statement') || selectedReport === 'homeowner-invoice') && (
        <HomeownerStatementReport type={selectedReport} timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'contact-info' && (
        <ContactInfoReport timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'board-members' && (
        <BoardMembersReport timeRange={timeRange} association={association} />
      )}
      
      {(selectedReport === 'transaction-history' || selectedReport === 'transaction-by-charge') && (
        <TransactionHistoryReport timeRange={timeRange} association={association} type={selectedReport} />
      )}
      
      {(selectedReport === 'meeting-signin' || selectedReport === 'meeting-consolidated') && (
        <MeetingReport timeRange={timeRange} association={association} type={selectedReport} />
      )}
      
      {/* Default fallback if no report is selected */}
      {!['resident-overview', 'homeowner-invoice', 'contact-info', 'board-members', 'transaction-history', 'transaction-by-charge', 'meeting-signin', 'meeting-consolidated'].some(type => 
        selectedReport === type || selectedReport.startsWith('statement')
      ) && (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-2">Select a report type</h2>
          <p className="text-muted-foreground">
            Choose a report type from the tabs above to view resident data
          </p>
        </div>
      )}
    </Card>
  );
};

export default ResidentReports;
