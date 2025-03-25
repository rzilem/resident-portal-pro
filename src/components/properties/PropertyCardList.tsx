
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { PropertyColumn } from './PropertyColumnsSelector';

interface PropertyCardListProps {
  properties: any[];
  columns: PropertyColumn[];
}

const PropertyCardList = ({ properties, columns }: PropertyCardListProps) => {
  return (
    <div className="space-y-4 md:hidden">
      {properties.map((property, i) => (
        <Card key={i} className="p-4 border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{property.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {property.status}
            </span>
          </div>
          <div className="space-y-1 text-sm">
            {columns.filter(col => col.checked && col.id !== 'name' && col.id !== 'status').map(col => (
              <div key={col.id} className="flex justify-between">
                <span className="text-muted-foreground">{col.label}:</span>
                <span>
                  {typeof property[col.id as keyof typeof property] === 'boolean' 
                    ? (property[col.id as keyof typeof property] ? 'Yes' : 'No')
                    : property[col.id as keyof typeof property]}
                </span>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3 justify-between">
            View Details <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default PropertyCardList;
