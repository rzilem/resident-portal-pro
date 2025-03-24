
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Association } from './types';

interface AssociationDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingAssociation: Association | null;
  formData: {
    name: string;
    units: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    units: string;
    address: string;
  }>>;
  associations: Association[];
  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>;
}

const AssociationDialog = ({
  dialogOpen,
  setDialogOpen,
  editingAssociation,
  formData,
  setFormData,
  associations,
  setAssociations
}: AssociationDialogProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  
  return (
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
  );
};

export default AssociationDialog;
