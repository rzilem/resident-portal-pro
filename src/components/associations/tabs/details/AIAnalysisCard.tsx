
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Association } from '@/types/association';
import { AlertCircle, BarChart2, Calendar, CheckCircle2, Clock, Droplet, FileWarning, Lightbulb, TrendingUp, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import { Alert as AlertType } from '@/types/alert';
import { getAlerts } from '@/utils/alerts';
import AnalysisAlert from '@/components/alerts/AnalysisAlert';

interface AIAnalysisCardProps {
  association: Association;
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ association }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  
  useEffect(() => {
    if (association) {
      setAlerts(getAlerts({ 
        associationId: association.id,
        status: 'new' 
      }));
    }
  }, [association]);

  const criticalDates = {
    poolPermitExpiration: '2024-05-30',
    insuranceExpiration: '2025-06-15',
    elevatorInspection: '2024-08-10',
    fireInspection: '2024-07-22',
  };

  const pendingMaintenance = [
    { id: 1, title: 'HVAC Not Working', priority: 'High', daysOpen: 5 },
    { id: 2, title: 'Water Damage', priority: 'Urgent', daysOpen: 7 },
    { id: 3, title: 'Leaky Faucet', priority: 'Medium', daysOpen: 3 },
  ];

  const boardRequests = [
    { id: 1, title: 'Update governing documents', daysOpen: 14 },
    { id: 2, title: 'Schedule annual meeting', daysOpen: 7 },
  ];

  const pendingWorkflows = [
    { id: 1, title: 'Delinquency Process', age: 30, status: 'waiting' },
    { id: 2, title: 'Community Event Reminders', age: 15, status: 'blocked' },
  ];

  const financialInsights = {
    reserveFundingLevel: 87.5, // percent
    cashFlowTrend: 'positive',
    delinquencyRate: 3.2, // percent
    upcomingLargeExpenses: [
      { item: 'Roof Replacement - Building A', estimatedCost: 45000, scheduledDate: '2024-09-15' }
    ],
    costSavingOpportunities: [
      { item: 'Landscaping Contract Renegotiation', potentialSavings: 5200 },
      { item: 'Energy Efficient Lighting Upgrade', potentialSavings: 3800, paybackPeriod: '14 months' }
    ]
  };

  const today = new Date();
  const daysUntilPoolPermitExpires = Math.ceil((new Date(criticalDates.poolPermitExpiration).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilInsuranceExpires = Math.ceil((new Date(criticalDates.insuranceExpiration).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const hasUrgentCriticalDates = daysUntilPoolPermitExpires <= 30 || daysUntilInsuranceExpires <= 30;

  const hasUrgentMaintenance = pendingMaintenance.some(item => 
    item.priority === 'High' || item.priority === 'Urgent'
  );

  const riskLevel = () => {
    if (hasUrgentCriticalDates && hasUrgentMaintenance && financialInsights.reserveFundingLevel < 70) {
      return { level: 'High', color: 'bg-red-100 text-red-800' };
    } else if ((hasUrgentCriticalDates || hasUrgentMaintenance) && financialInsights.reserveFundingLevel < 80) {
      return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { level: 'Low', color: 'bg-green-100 text-green-800' };
    }
  };

  const risk = riskLevel();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Analysis & Recommendations
          </CardTitle>
          <Badge className={risk.color}>
            Risk: {risk.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {alerts.length > 0 && (
          <div>
            {alerts.map(alert => (
              <AnalysisAlert key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      
        <div>
          <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Critical Dates Requiring Attention
          </h3>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            {daysUntilPoolPermitExpires <= 30 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Droplet className="h-4 w-4 text-cyan-500" />
                  <span>Pool Permit Expires</span>
                </div>
                <Badge variant={daysUntilPoolPermitExpires <= 7 ? "destructive" : "outline"} className="text-xs">
                  {daysUntilPoolPermitExpires} days
                </Badge>
              </div>
            )}
            {daysUntilInsuranceExpires <= 90 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <FileWarning className="h-4 w-4 text-blue-500" />
                  <span>Insurance Policy Renewal</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {daysUntilInsuranceExpires} days
                </Badge>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Fire Inspection Due</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.ceil((new Date(criticalDates.fireInspection).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-orange-600" />
            High Priority Maintenance Items
          </h3>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            {pendingMaintenance.filter(item => item.priority === 'High' || item.priority === 'Urgent').map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <span>{item.title}</span>
                  <Badge variant={item.priority === 'Urgent' ? "destructive" : "secondary"} className="text-xs">
                    {item.priority}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Open {item.daysOpen} days</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-violet-600" />
            Older Pending Workflows
          </h3>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            {pendingWorkflows.map(workflow => (
              <div key={workflow.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <span>{workflow.title}</span>
                  <Badge variant={workflow.status === 'blocked' ? "destructive" : "outline"} className="text-xs">
                    {workflow.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Age: {workflow.age} days</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
            <BarChart2 className="h-4 w-4 text-green-600" />
            Financial Health Analysis
          </h3>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Reserve Funding Level</div>
                <div className="text-sm font-medium">{financialInsights.reserveFundingLevel}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {financialInsights.reserveFundingLevel >= 80 
                    ? 'Well funded' 
                    : financialInsights.reserveFundingLevel >= 70 
                      ? 'Adequately funded' 
                      : 'Underfunded'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Cash Flow Trend</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  {financialInsights.cashFlowTrend === 'positive' 
                    ? <><TrendingUp className="h-3 w-3 text-green-500" /> Positive</> 
                    : <>Negative</>}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Delinquency Rate: {financialInsights.delinquencyRate}%
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Upcoming Large Expenses</div>
              {financialInsights.upcomingLargeExpenses.map((expense, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{expense.item}</span>
                  <span className="font-medium">${expense.estimatedCost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
            AI Recommendations
          </h3>
          <div className="space-y-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Urgent:</strong> Begin pool permit renewal process immediately to avoid facility closure (due in {daysUntilPoolPermitExpires} days).</span>
                </li>
                {hasUrgentMaintenance && (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>Important:</strong> Address high-priority maintenance items to prevent further property damage.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Financial:</strong> Review cost-saving opportunities in landscaping contract to potentially save $5,200 annually.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Governance:</strong> Unblock pending workflows to improve operational efficiency.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisCard;
