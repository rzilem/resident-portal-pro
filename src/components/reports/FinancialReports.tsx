
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface FinancialReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({
  timeRange,
  association,
  selectedReport
}) => {
  // Mock data
  const monthlyData = [
    { name: 'Jan', income: 42000, expenses: 30000 },
    { name: 'Feb', income: 44000, expenses: 32000 },
    { name: 'Mar', income: 43500, expenses: 31000 },
    { name: 'Apr', income: 45000, expenses: 33000 },
    { name: 'May', income: 47000, expenses: 31500 },
    { name: 'Jun', income: 48000, expenses: 32000 },
  ];

  const expenseData = [
    { name: 'Maintenance', value: 32000 },
    { name: 'Utilities', value: 18000 },
    { name: 'Administration', value: 12000 },
    { name: 'Insurance', value: 8000 },
    { name: 'Reserves', value: 10000 },
  ];

  const accountsReceivableData = [
    { name: 'Current', value: 75 },
    { name: '1-30 Days', value: 15 },
    { name: '31-60 Days', value: 5 },
    { name: '61-90 Days', value: 3 },
    { name: '90+ Days', value: 2 },
  ];

  const accountsPayableData = [
    { name: 'Current', value: 80 },
    { name: '1-30 Days', value: 15 },
    { name: '31-60 Days', value: 5 },
    { name: '61+ Days', value: 0 },
  ];

  const cashFlowData = [
    { name: 'Jan', cashIn: 42000, cashOut: 30000, netCash: 12000 },
    { name: 'Feb', cashIn: 44000, cashOut: 32000, netCash: 12000 },
    { name: 'Mar', cashIn: 43500, cashOut: 31000, netCash: 12500 },
    { name: 'Apr', cashIn: 45000, cashOut: 33000, netCash: 12000 },
    { name: 'May', cashIn: 47000, cashOut: 31500, netCash: 15500 },
    { name: 'Jun', cashIn: 48000, cashOut: 32000, netCash: 16000 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const renderIncomeExpenseReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Income vs Expenses</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4ade80" />
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Expense Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Income YTD</p>
                <p className="text-2xl font-bold">$269,500</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses YTD</p>
                <p className="text-2xl font-bold">$189,500</p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Net Income YTD</p>
              <p className="text-2xl font-bold text-green-600">$80,000</p>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Budget Variance</p>
              <p className="text-2xl font-bold text-blue-600">+3.2%</p>
              <p className="text-xs text-muted-foreground">Positive variance indicates under budget</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderBalanceSheetReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Assets Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operating Account</span>
              <span className="font-medium">$125,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reserve Account</span>
              <span className="font-medium">$350,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accounts Receivable</span>
              <span className="font-medium">$42,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prepaid Expenses</span>
              <span className="font-medium">$15,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Total Assets</span>
              <span className="font-bold">$532,000</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Liabilities & Equity</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accounts Payable</span>
              <span className="font-medium">$28,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prepaid Assessments</span>
              <span className="font-medium">$35,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Other Liabilities</span>
              <span className="font-medium">$9,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Total Liabilities</span>
              <span className="font-bold">$72,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Equity</span>
              <span className="font-bold">$460,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Total Liabilities & Equity</span>
              <span className="font-bold">$532,000</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Reserve Fund Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { category: 'Current Reserve', amount: 350000, target: 500000 },
                { category: 'Annual Funding', amount: 60000, target: 60000 },
                { category: 'Projected (5yr)', amount: 650000, target: 700000 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" name="Current Amount" fill="#4ade80" />
              <Bar dataKey="target" name="Target Amount" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderCashFlowReport = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Cash Flow Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={cashFlowData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="cashIn" name="Cash In" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="cashOut" name="Cash Out" stroke="#f87171" strokeWidth={2} />
              <Line type="monotone" dataKey="netCash" name="Net Cash Flow" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Cash In (YTD)</h3>
          <div className="text-2xl font-bold">$269,500</div>
          <p className="text-sm text-green-600 mt-1">+5.2% from last year</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Cash Out (YTD)</h3>
          <div className="text-2xl font-bold">$189,500</div>
          <p className="text-sm text-green-600 mt-1">-2.1% from last year</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">Net Cash Flow</h3>
          <div className="text-2xl font-bold">$80,000</div>
          <p className="text-sm text-green-600 mt-1">+12.5% from last year</p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Cash Flow Projection (Next 6 Months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { name: 'Jul', projected: 16500 },
                { name: 'Aug', projected: 15000 },
                { name: 'Sep', projected: 14500 },
                { name: 'Oct', projected: 13000 },
                { name: 'Nov', projected: 12000 },
                { name: 'Dec', projected: 16000 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="projected" name="Projected Net Cash Flow" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderAccountsReceivableReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Accounts Receivable Aging</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountsReceivableData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {accountsReceivableData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">AR Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total AR</span>
              <span className="font-medium">$42,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">$31,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1-30 Days</span>
              <span className="font-medium">$6,300</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">31-60 Days</span>
              <span className="font-medium">$2,100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">61-90 Days</span>
              <span className="font-medium">$1,260</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">90+ Days</span>
              <span className="font-medium">$840</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-base font-medium mb-2">Collection Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collection Rate</span>
                <span className="font-medium text-green-600">97.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delinquency Rate</span>
                <span className="font-medium text-amber-600">2.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Accounts Receivable Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { name: 'Jan', total: 38000, delinquent: 5000 },
                { name: 'Feb', total: 39000, delinquent: 4500 },
                { name: 'Mar', total: 40000, delinquent: 4200 },
                { name: 'Apr', total: 41000, delinquent: 3800 },
                { name: 'May', total: 41500, delinquent: 3500 },
                { name: 'Jun', total: 42000, delinquent: 3200 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total AR" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="delinquent" name="Delinquent" stroke="#f87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderAccountsPayableReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Accounts Payable Aging</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountsPayableData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {accountsPayableData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">AP Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total AP</span>
              <span className="font-medium">$28,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">$22,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1-30 Days</span>
              <span className="font-medium">$4,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">31-60 Days</span>
              <span className="font-medium">$1,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">61+ Days</span>
              <span className="font-medium">$0</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-base font-medium mb-2">Payment Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Payment Time</span>
                <span className="font-medium">15 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discounts Captured</span>
                <span className="font-medium text-green-600">$1,250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Vendor Payment Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Utilities', amount: 8500 },
                { name: 'Landscaping', amount: 5200 },
                { name: 'Maintenance', amount: 4800 },
                { name: 'Insurance', amount: 3500 },
                { name: 'Management', amount: 3200 },
                { name: 'Other', amount: 2800 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" name="Amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      {selectedReport === 'income-expense' && renderIncomeExpenseReport()}
      {selectedReport === 'balance' && renderBalanceSheetReport()}
      {selectedReport === 'cash-flow' && renderCashFlowReport()}
      {selectedReport === 'accounts-receivable' && renderAccountsReceivableReport()}
      {selectedReport === 'accounts-payable' && renderAccountsPayableReport()}
    </div>
  );
};

export default FinancialReports;
