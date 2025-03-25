
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { VehicleInfo } from '@/types/user';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Edit, Plus, Save, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VehiclesFormProps {
  vehicles: VehicleInfo[];
  updateVehicles: (vehicles: VehicleInfo[]) => void;
}

const VehiclesForm = ({ vehicles, updateVehicles }: VehiclesFormProps) => {
  const [vehiclesList, setVehiclesList] = useState<VehicleInfo[]>(vehicles);
  const [editingVehicle, setEditingVehicle] = useState<VehicleInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const addVehicle = () => {
    setEditingVehicle({
      id: uuidv4(),
      make: '',
      model: '',
      year: undefined,
      color: '',
      licensePlate: '',
      parkingSpot: ''
    });
    setIsDialogOpen(true);
  };
  
  const editVehicle = (vehicle: VehicleInfo) => {
    setEditingVehicle({ ...vehicle });
    setIsDialogOpen(true);
  };
  
  const deleteVehicle = (id: string) => {
    const updatedVehicles = vehiclesList.filter(vehicle => vehicle.id !== id);
    setVehiclesList(updatedVehicles);
    updateVehicles(updatedVehicles);
  };
  
  const handleSaveVehicle = () => {
    if (!editingVehicle) return;
    
    const isValid = 
      editingVehicle.make.trim() !== '' && 
      editingVehicle.model.trim() !== '' && 
      editingVehicle.licensePlate.trim() !== '';
    
    if (!isValid) return;
    
    const updatedVehicles = editingVehicle.id && vehiclesList.some(v => v.id === editingVehicle.id)
      ? vehiclesList.map(v => (v.id === editingVehicle.id ? editingVehicle : v))
      : [...vehiclesList, editingVehicle];
    
    setVehiclesList(updatedVehicles);
    updateVehicles(updatedVehicles);
    setIsDialogOpen(false);
  };
  
  const handleInputChange = (field: keyof VehicleInfo, value: string | number | undefined) => {
    if (!editingVehicle) return;
    
    // Handle year as a number
    if (field === 'year' && typeof value === 'string') {
      const yearValue = value === '' ? undefined : parseInt(value, 10);
      setEditingVehicle({
        ...editingVehicle,
        year: isNaN(yearValue as number) ? undefined : yearValue
      });
      return;
    }
    
    setEditingVehicle({
      ...editingVehicle,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registered Vehicles</CardTitle>
          <Button onClick={addVehicle} variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </Button>
        </CardHeader>
        <CardContent>
          {vehiclesList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Parking Spot</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiclesList.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                    <TableCell>{vehicle.year || '-'}</TableCell>
                    <TableCell>{vehicle.color || '-'}</TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.parkingSpot || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editVehicle(vehicle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteVehicle(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <Car className="h-10 w-10 mb-2" />
              <p>No vehicles registered yet</p>
              <p className="text-sm">Add vehicles that you want to register with the association</p>
              <Button onClick={addVehicle} variant="outline" className="mt-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Register Vehicle</span>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="default" 
            onClick={() => updateVehicles(vehiclesList)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Vehicles
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVehicle && vehiclesList.some(v => v.id === editingVehicle.id) 
                ? "Edit Vehicle" 
                : "Add Vehicle"
              }
            </DialogTitle>
            <DialogDescription>
              Provide details about your vehicle for parking and access purposes.
            </DialogDescription>
          </DialogHeader>
          
          {editingVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={editingVehicle.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="Toyota"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={editingVehicle.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="Camry"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={editingVehicle.year || ''}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2023"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={editingVehicle.color || ''}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="Blue"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license">License Plate</Label>
                  <Input
                    id="license"
                    value={editingVehicle.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    placeholder="ABC123"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parking">Parking Spot</Label>
                  <Input
                    id="parking"
                    value={editingVehicle.parkingSpot || ''}
                    onChange={(e) => handleInputChange('parkingSpot', e.target.value)}
                    placeholder="A42"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSaveVehicle}
            >
              Save Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehiclesForm;
