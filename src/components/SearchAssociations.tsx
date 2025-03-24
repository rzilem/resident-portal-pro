
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for associations and owners
const associationsData = [
  {
    id: 1,
    name: 'Oakwood Heights HOA',
    location: 'Seattle, WA',
    owners: [
      { id: 101, name: 'Alice Johnson', unit: '301', email: 'alice.j@example.com' },
      { id: 102, name: 'Robert Smith', unit: '142', email: 'robert.s@example.com' },
      { id: 103, name: 'Emily Davis', unit: '506', email: 'emily.d@example.com' },
    ]
  },
  {
    id: 2,
    name: 'Willow Creek Estates',
    location: 'Portland, OR',
    owners: [
      { id: 201, name: 'Michael Wilson', unit: '203', email: 'michael.w@example.com' },
      { id: 202, name: 'Sarah Brown', unit: '118', email: 'sarah.b@example.com' },
    ]
  },
  {
    id: 3,
    name: 'Riverfront Towers',
    location: 'Denver, CO',
    owners: [
      { id: 301, name: 'David Miller', unit: '224', email: 'david.m@example.com' },
      { id: 302, name: 'Jennifer Lee', unit: '315', email: 'jennifer.l@example.com' },
      { id: 303, name: 'Thomas Clark', unit: '410', email: 'thomas.c@example.com' },
    ]
  },
  {
    id: 4,
    name: 'Sunset Gardens',
    location: 'San Diego, CA',
    owners: [
      { id: 401, name: 'Lisa Adams', unit: '105', email: 'lisa.a@example.com' },
      { id: 402, name: 'James Wilson', unit: '221', email: 'james.w@example.com' },
    ]
  },
  {
    id: 5,
    name: 'Pine Valley Community',
    location: 'Austin, TX',
    owners: [
      { id: 501, name: 'Patricia Moore', unit: '112', email: 'patricia.m@example.com' },
      { id: 502, name: 'Richard Taylor', unit: '304', email: 'richard.t@example.com' },
      { id: 503, name: 'Michelle Garcia', unit: '216', email: 'michelle.g@example.com' },
    ]
  },
];

const SearchAssociations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssociation, setSelectedAssociation] = useState<typeof associationsData[0] | null>(null);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter associations based on search term
  const filteredAssociations = associationsData.filter(association => 
    association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    association.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter owners for the selected association
  const filteredOwners = selectedAssociation?.owners.filter(owner =>
    owner.name.toLowerCase().includes(ownerSearchTerm.toLowerCase()) ||
    owner.unit.toLowerCase().includes(ownerSearchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(ownerSearchTerm.toLowerCase())
  ) || [];

  const handleAssociationSelect = (association: typeof associationsData[0]) => {
    setSelectedAssociation(association);
    setOwnerSearchTerm('');
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setOwnerSearchTerm('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Associations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="association-search">Find Association</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="association-search"
              type="search"
              placeholder="Search by name or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-md">
          <Command>
            <CommandList>
              <CommandEmpty>No associations found</CommandEmpty>
              {filteredAssociations.map((association) => (
                <CommandItem 
                  key={association.id}
                  onSelect={() => handleAssociationSelect(association)}
                  className="flex justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-medium">{association.name}</span>
                    <p className="text-sm text-muted-foreground">{association.location}</p>
                  </div>
                  <Dialog open={isDialogOpen && selectedAssociation?.id === association.id} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssociation(association);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Owners
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{association.name} - Owners</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Input
                          placeholder="Search owners by name, unit, or email..."
                          value={ownerSearchTerm}
                          onChange={(e) => setOwnerSearchTerm(e.target.value)}
                        />
                        
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-2 text-xs font-medium">Name</th>
                                <th className="text-left p-2 text-xs font-medium">Unit</th>
                                <th className="text-left p-2 text-xs font-medium">Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOwners.length > 0 ? (
                                filteredOwners.map((owner) => (
                                  <tr key={owner.id} className="border-t">
                                    <td className="p-2 text-sm">
                                      <Link 
                                        to={`/residents/${owner.id}`}
                                        className="text-primary hover:underline hover:text-primary/80 transition-colors"
                                        onClick={() => setIsDialogOpen(false)}
                                      >
                                        {owner.name}
                                      </Link>
                                    </td>
                                    <td className="p-2 text-sm">{owner.unit}</td>
                                    <td className="p-2 text-sm">
                                      <a 
                                        href={`mailto:${owner.email}`}
                                        className="hover:underline hover:text-primary/80 transition-colors"
                                      >
                                        {owner.email}
                                      </a>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                    No owners match your search
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
        
        {selectedAssociation && !isDialogOpen && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">{selectedAssociation.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedAssociation.location} • {selectedAssociation.owners.length} Owners</p>
            
            <Input
              placeholder="Search owners by name, unit, or email..."
              value={ownerSearchTerm}
              onChange={(e) => setOwnerSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium">Name</th>
                    <th className="text-left p-2 text-xs font-medium">Unit</th>
                    <th className="text-left p-2 text-xs font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.length > 0 ? (
                    filteredOwners.map((owner) => (
                      <tr key={owner.id} className="border-t">
                        <td className="p-2 text-sm">
                          <Link 
                            to={`/residents/${owner.id}`}
                            className="text-primary hover:underline hover:text-primary/80 transition-colors"
                          >
                            {owner.name}
                          </Link>
                        </td>
                        <td className="p-2 text-sm">{owner.unit}</td>
                        <td className="p-2 text-sm">
                          <a 
                            href={`mailto:${owner.email}`}
                            className="hover:underline hover:text-primary/80 transition-colors"
                          >
                            {owner.email}
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-muted-foreground">
                        No owners match your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchAssociations;
