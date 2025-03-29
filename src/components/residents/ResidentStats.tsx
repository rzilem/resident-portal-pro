
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, desc, icon: Icon, color, index }) => (
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
    </CardContent>
  </Card>
);

const ResidentStats: React.FC = () => {
  const stats = [
    { title: 'Total Residents', value: '418', desc: 'Across all properties', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { title: 'Active Accounts', value: '392', desc: '93.8% activation rate', icon: UserCheck, color: 'bg-green-50 text-green-600' },
    { title: 'Pending Approvals', value: '7', desc: 'New resident applications', icon: UserX, color: 'bg-amber-50 text-amber-600' },
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
