
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Building, Edit, Trash2, Plus, Settings } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Association } from './types';
import { CheckCircle2 } from "lucide-react";

interface AssociationListProps {
  associations: Association[];
  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>;
  activeAssociation: Association;
  selectAssociation: (association: Association) => void;
  openNewAssociationDialog: () => void;
  openEditDialog: (association: Association) => void;
}

const AssociationList = ({ 
  associations, 
  setAssociations, 
  activeAssociation, 
  selectAssociation,
  openNewAssociationDialog,
  openEditDialog
}: AssociationListProps) => {
  
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
              <TableRow key={association.id} className={association.id === activeAssociation?.id ? "bg-muted/50" : ""}>
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
                      variant="outline" 
                      size="sm" 
                      onClick={() => selectAssociation(association)}
                    >
                      Configure
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(association)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteAssociation(association.id)}
                          disabled={association.isDefault}
                          className={association.isDefault ? "text-muted-foreground" : "text-destructive"}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssociationList;
