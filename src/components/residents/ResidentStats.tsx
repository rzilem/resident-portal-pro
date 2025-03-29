
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, CreditCard, Calendar, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StatCardProps {
  title: string;
  value: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  index: number;
  progress?: number;
  secondaryValue?: string;
  secondaryLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  desc, 
  icon: Icon, 
  color, 
  index,
  progress,
  secondaryValue,
  secondaryLabel
}) => (
  <Card className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`${color} p-2 rounded-full`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{desc}</p>
      
      {progress !== undefined && (
        <div className="mt-3">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{secondaryLabel}</span>
            <span className="text-xs font-medium">{secondaryValue}</span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const ResidentStats: React.FC = () => {
  // In a real application, these would be fetched from an API with real-time data
  const stats = [
    { 
      title: 'Total Residents', 
      value: '418', 
      desc: 'Across all properties', 
      icon: Users, 
      color: 'bg-blue-50 text-blue-600',
      progress: 92,
      secondaryValue: '92%',
      secondaryLabel: 'Occupancy rate'
    },
    { 
      title: 'Active Accounts', 
      value: '392', 
      desc: '93.8% activation rate', 
      icon: UserCheck, 
      color: 'bg-green-50 text-green-600',
      progress: 93.8,
      secondaryValue: '↑ 1.2%',
      secondaryLabel: 'From last month'
    },
    { 
      title: 'Pending Approvals', 
      value: '7', 
      desc: 'New resident applications', 
      icon: UserX, 
      color: 'bg-amber-50 text-amber-600' 
    },
    { 
      title: 'On-time Payments', 
      value: '82%', 
      desc: 'Of total expected payments', 
      icon: CreditCard, 
      color: 'bg-purple-50 text-purple-600',
      progress: 82,
      secondaryValue: '$12,450',
      secondaryLabel: 'Total collected this month'
    },
    { 
      title: 'Event Attendance', 
      value: '63%', 
      desc: 'Average attendance rate', 
      icon: Calendar, 
      color: 'bg-indigo-50 text-indigo-600',
      progress: 63,
      secondaryValue: '12 events',
      secondaryLabel: 'Hosted in last 30 days'
    },
    { 
      title: 'Portal Activity', 
      value: '256', 
      desc: 'Logins in the past week', 
      icon: Activity, 
      color: 'bg-rose-50 text-rose-600',
      progress: 78,
      secondaryValue: '↑ 15%',
      secondaryLabel: 'Week over week increase'
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} index={i} />
      ))}
    </section>
  );
};

export default ResidentStats;
