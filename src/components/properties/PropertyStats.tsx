
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Users } from 'lucide-react';

const PropertyStats = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Total Properties', value: '12', desc: 'Across 3 communities', icon: Building, color: 'bg-blue-50 text-blue-600' },
        { title: 'Total Units', value: '256', desc: '92% occupancy rate', icon: Home, color: 'bg-green-50 text-green-600' },
        { title: 'Total Residents', value: '418', desc: 'Active residents', icon: Users, color: 'bg-purple-50 text-purple-600' },
      ].map((item, i) => (
        <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`${item.color} p-2 rounded-full`}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default PropertyStats;
