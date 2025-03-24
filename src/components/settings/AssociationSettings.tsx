
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Building, Edit, Trash2, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Association {
  id: string;
  name: string;
  units: number;
  address: string;
  isActive: boolean;
  isDefault: boolean;
}

const AssociationSettings = () => {
  const [associations, setAssociations] = useState<Association[]>([
    { id: '1', name: 'Sunset Heights HOA', units: 48, address: '123 Sunset Blvd, Los Angeles, CA', isActive: true, isDefault: true },
    { id: '2', name: 'Ocean View Condos', units: 120, address: '456 Ocean Dr, Miami, FL', isActive: true, isDefault: false },
    { id: '3', name: 'Mountain Valley Association', units: 75, address: '789 Valley Rd, Denver, CO', isActive: false, isDefault: false },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    units: '',
    address: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const openNewAssociationDialog = () => {
    setEditingAssociation(null);
    setFormData({ name: '', units: '', address: '' });
    setDialogOpen(true);
  };
  
  const openEditDialog = (association: Association) => {
    setEditingAssociation(association);
    setFormData({ 
      name: association.name, 
      units: association.units.toString(), 
      address: association.address 
    });
    setDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.units || !formData.address) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingAssociation) {
      // Update existing association
      const updatedAssociations = associations.map(a => 
        a.id === editingAssociation.id 
          ? { 
              ...a, 
              name: formData.name, 
              units: parseInt(formData.units), 
              address: formData.address 
            } 
          : a
      );
      setAssociations(updatedAssociations);
      toast.success("Association updated successfully");
    } else {
      // Add new association
      const newAssociation: Association = {
        id: Date.now().toString(),
        name: formData.name,
        units: parseInt(formData.units),
        address: formData.address,
        isActive: true,
        isDefault: associations.length === 0 // First association is default
      };
      setAssociations([...associations, newAssociation]);
      toast.success("Association added successfully");
    }
    
    setDialogOpen(false);
  };
  
  const toggleAssociationStatus = (id: string) => {
    const updatedAssociations = associations.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    setAssociations(updatedAssociations);
    
    const association = associations.find(a => a.id === id);
    toast.success(`${association?.name} ${association?.isActive ? 'deactivated' : 'activated'}`);
  };
  
  const setAsDefault = (id: string) => {
    const updatedAssociations = associations.map(a => 
      ({ ...a, isDefault: a.id === id })
    );
    setAssociations(updatedAssociations);
    
    const association = associations.find(a => a.id === id);
    toast.success(`${association?.name} set as default`);
  };
  
  const deleteAssociation = (id: string) => {
    const association = associations.find(a => a.id === id);
    
    if (association?.isDefault) {
      toast.error("Cannot delete the default association");
      return;
    }
    
    const updatedAssociations = associations.filter(a => a.id !== id);
    setAssociations(updatedAssociations);
    toast.success(`${association?.name} deleted`);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Associations</CardTitle>
            <CardDescription>Add, edit or remove property associations</CardDescription>
          </div>
          <Button onClick={openNewAssociationDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Association
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Association Name</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associations.map((association) => (
                <TableRow key={association.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {association.name}
                    </div>
                  </TableCell>
                  <TableCell>{association.units}</TableCell>
                  <TableCell className="hidden md:table-cell">{association.address}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={association.isActive} 
                      onCheckedChange={() => toggleAssociationStatus(association.id)} 
                    />
                  </TableCell>
                  <TableCell>
                    {association.isDefault ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAsDefault(association.id)}
                      >
                        Set Default
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(association)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteAssociation(association.id)}
                        disabled={association.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAssociation ? "Edit Association" : "Add New Association"}
            </DialogTitle>
            <DialogDescription>
              {editingAssociation 
                ? "Update the details for this association" 
                : "Fill in the details to add a new property association"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Association Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="units">Number of Units</Label>
                  <Input 
                    id="units" 
                    name="units" 
                    type="number" 
                    value={formData.units}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAssociation ? "Save Changes" : "Add Association"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssociationSettings;
