
import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Mock data for vendors
const mockVendors = [
  { id: '1', name: 'ABC Contractors', specialty: 'General Contractors', rating: 4.8 },
  { id: '2', name: 'XYZ Plumbing', specialty: 'Plumbing', rating: 4.5 },
  { id: '3', name: 'Elite Electrical', specialty: 'Electrical', rating: 4.7 },
  { id: '4', name: 'Quick Renovations', specialty: 'Renovations', rating: 4.2 },
  { id: '5', name: 'Landscape Masters', specialty: 'Landscaping', rating: 4.9 },
  { id: '6', name: 'Modern Painting', specialty: 'Painting', rating: 4.4 },
  { id: '7', name: 'Secure Roofing', specialty: 'Roofing', rating: 4.6 },
  { id: '8', name: 'Comfort HVAC', specialty: 'HVAC', rating: 4.3 }
];

export interface VendorSelectionSlideProps {
  selectedVendors: string[];
  onSelectVendors: (vendorIds: string[]) => void;
}

const VendorSelectionSlide: React.FC<VendorSelectionSlideProps> = ({ 
  selectedVendors,
  onSelectVendors 
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedVendors || []);

  useEffect(() => {
    setSelected(selectedVendors || []);
  }, [selectedVendors]);

  const filteredVendors = mockVendors.filter(vendor => 
    vendor.name.toLowerCase().includes(search.toLowerCase()) ||
    vendor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleVendor = (vendorId: string) => {
    setSelected(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  const handleConfirmSelection = () => {
    onSelectVendors(selected);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Vendors for Bid Request</h2>
        <p className="text-muted-foreground mb-6">
          Choose the vendors you want to invite to bid on your project
        </p>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search vendors by name or specialty" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="space-y-2 mb-6">
        {selected.length > 0 ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span>{selected.length} vendors selected</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Select at least one vendor to continue
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map(vendor => (
          <div 
            key={vendor.id} 
            className={`border rounded-md p-4 flex items-start gap-3 transition-colors ${
              selected.includes(vendor.id) ? 'bg-primary/5 border-primary/30' : ''
            }`}
          >
            <Checkbox 
              id={`vendor-${vendor.id}`} 
              checked={selected.includes(vendor.id)}
              onCheckedChange={() => handleToggleVendor(vendor.id)}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <Label 
                  htmlFor={`vendor-${vendor.id}`}
                  className="font-medium cursor-pointer"
                >
                  {vendor.name}
                </Label>
                <Badge variant="outline" className="ml-2">
                  {vendor.rating} ★
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{vendor.specialty}</p>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVendors.length === 0 && (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No vendors found matching your search</p>
          <Button 
            variant="link" 
            onClick={() => setSearch('')}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      )}
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleConfirmSelection}
          disabled={selected.length === 0}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default VendorSelectionSlide;
