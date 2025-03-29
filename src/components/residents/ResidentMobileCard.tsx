
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ResidentColumn } from '@/pages/Residents';

interface ResidentMobileCardProps {
  resident: any;
  columns: ResidentColumn[];
  selectedResidents: number[];
  toggleResidentSelection: (id: number) => void;
}

const ResidentMobileCard: React.FC<ResidentMobileCardProps> = ({ 
  resident, 
  columns, 
  selectedResidents, 
  toggleResidentSelection 
}) => {
  return (
    <Card className="p-4 border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selectedResidents.includes(resident.id)} 
            onCheckedChange={() => toggleResidentSelection(resident.id)}
            id={`mobile-resident-${resident.id}`}
          />
          <Link
            to={`/resident/${resident.id}`}
            className="font-medium text-primary hover:underline"
          >
            {resident.name}
          </Link>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          resident.status === 'Active' ? 'bg-green-100 text-green-800' : 
          resident.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {resident.status}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        {columns.filter(col => col.checked && ['unit', 'property', 'email'].includes(col.id)).map((col) => (
          <div key={col.id} className="flex justify-between">
            <span className="text-muted-foreground">{col.label}:</span>
            {col.id === 'property' ? (
              <Link 
                to={`/properties?filter=${encodeURIComponent(resident.property)}`} 
                className="hover:underline hover:text-primary/80 transition-colors"
              >
                {resident[col.id as keyof typeof resident]}
              </Link>
            ) : col.id === 'email' ? (
              <a 
                href={`mailto:${resident.email}`} 
                className="hover:underline hover:text-primary/80 transition-colors"
              >
                {resident.email}
              </a>
            ) : (
              <span>{resident[col.id as keyof typeof resident]}</span>
            )}
          </div>
        ))}
      </div>
      <Link to={`/resident/${resident.id}`}>
        <Button variant="ghost" size="sm" className="w-full mt-3 justify-between">
          View Profile <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </Card>
  );
};

export default ResidentMobileCard;
