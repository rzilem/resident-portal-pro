
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock vendor data - in a real app this would come from an API
const MOCK_VENDORS = [
  { id: '1', name: 'ABC Fencing Company', category: 'Fencing', rating: 4.8, tags: ['Reliable', 'Quality'] },
  { id: '2', name: 'BuildRight Construction', category: 'Construction', rating: 4.6, tags: ['Fast', 'Professional'] },
  { id: '3', name: 'Cool Air HVAC Services', category: 'HVAC', rating: 4.9, tags: ['Expert', '24/7'] },
  { id: '4', name: 'Elite Roofing Specialists', category: 'Roofing', rating: 4.7, tags: ['Warranty', 'Insured'] },
  { id: '5', name: 'Fast Fix Plumbing', category: 'Plumbing', rating: 4.5, tags: ['Emergency', 'Licensed'] },
  { id: '6', name: 'Green Thumb Landscaping', category: 'Landscaping', rating: 4.7, tags: ['Eco-friendly', 'Design'] },
  { id: '7', name: 'Home Renovation Experts', category: 'Renovation', rating: 4.8, tags: ['Interior', 'Exterior'] },
  { id: '8', name: 'Universal Contractors', category: 'Other', rating: 4.6, tags: ['Versatile', 'Experienced'] },
];

interface VendorSelectionSlideProps {
  selectedVendors: string[];
  onSelectVendors: (vendorIds: string[]) => void;
}

const VendorSelectionSlide: React.FC<VendorSelectionSlideProps> = ({ 
  selectedVendors, 
  onSelectVendors 
}) => {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter vendors based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setVendors(MOCK_VENDORS);
      return;
    }
    
    const filtered = MOCK_VENDORS.filter(vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setVendors(filtered);
  }, [searchQuery]);
  
  // Toggle vendor selection
  const toggleVendor = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      onSelectVendors(selectedVendors.filter(id => id !== vendorId));
    } else if (selectedVendors.length < 5) {
      onSelectVendors([...selectedVendors, vendorId]);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Select Vendors</h2>
      <p className="text-muted-foreground mb-4">
        Choose up to 5 vendors to send your bid request to.
      </p>
      
      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search vendors..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Selected count */}
      <div className="text-sm font-medium">
        Selected: {selectedVendors.length}/5
      </div>
      
      {/* Vendors list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => {
          const isSelected = selectedVendors.includes(vendor.id);
          
          return (
            <Card 
              key={vendor.id}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : selectedVendors.length >= 5
                    ? 'opacity-50'
                    : 'hover:bg-accent'
              }`}
              onClick={() => toggleVendor(vendor.id)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={() => {}}
                  disabled={!isSelected && selectedVendors.length >= 5}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{vendor.name}</h3>
                      <p className="text-sm text-muted-foreground">{vendor.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                      ★ {vendor.rating}
                    </div>
                  </div>
                  
                  <div className="mt-2 space-x-1">
                    {vendor.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {vendors.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No vendors found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default VendorSelectionSlide;
