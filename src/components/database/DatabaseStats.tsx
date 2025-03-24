
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DatabaseStats = () => {
  return (
    <Card className="animate-fade-in animate-delay-200">
      <CardHeader>
        <CardTitle>Database Status</CardTitle>
        <CardDescription>
          Current database statistics and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Records', value: '12,456', desc: 'Across all tables' },
            { title: 'Last Backup', value: '2 hours ago', desc: 'Auto-backup' },
            { title: 'Storage Used', value: '1.2 GB', desc: '32% of quota' },
            { title: 'System Status', value: 'Operational', desc: 'All systems normal' },
          ].map((stat, i) => (
            <div key={i} className="bg-muted/50 p-4 rounded-lg">
              <h4 className="text-sm text-muted-foreground">{stat.title}</h4>
              <div className="text-2xl font-semibold mt-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseStats;
