
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const MetricsSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-64 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSkeleton;
