
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Building, Plus, MoreVertical, Pencil, Trash2, Check, 
  Star, X, ToggleLeft, ToggleRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Association } from '@/types/association';
import { SimpleAssociation } from './types';

interface AssociationListProps {
  associations: Association[];
  activeAssociation: Association | null;
  selectAssociation: (association: Association) => void;
  openNewAssociationDialog: () => void;
  openEditDialog: (association: Association) => void;
  toggleStatus?: (id: string) => Promise<Association>;
  removeAssociation?: (id: string) => Promise<boolean>;
  makeDefaultAssociation?: (id: string) => Promise<Association[]>;
}

const AssociationList = ({
  associations,
  activeAssociation,
  selectAssociation,
  openNewAssociationDialog,
  openEditDialog,
  toggleStatus,
  removeAssociation,
  makeDefaultAssociation
}: AssociationListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Your Associations</CardTitle>
        <Button onClick={openNewAssociationDialog} size="sm" className="h-8">
          <Plus className="mr-1 h-4 w-4" />
          Add Association
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {associations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Building className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No Associations</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven't added any associations yet.
              </p>
              <Button 
                onClick={openNewAssociationDialog} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Association
              </Button>
            </div>
          ) : (
            associations.map((association) => (
              <div 
                key={association.id}
                className={`rounded-md border p-4 transition-colors ${
                  activeAssociation?.id === association.id 
                    ? 'bg-muted border-primary' 
                    : 'hover:bg-muted/50 cursor-pointer'
                }`}
                onClick={() => selectAssociation(association)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-9 w-9 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{association.name}</h3>
                        {association.settings?.isDefault && (
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            <Star className="mr-1 h-3 w-3" />
                            Default
                          </Badge>
                        )}
                        <Badge 
                          variant={association.status === 'active' ? "secondary" : "outline"} 
                          className="text-xs"
                        >
                          {association.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {association.units} Units • {association.address.city}, {association.address.state}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(association);
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      
                      {!association.settings?.isDefault && makeDefaultAssociation && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          makeDefaultAssociation(association.id);
                        }}>
                          <Star className="mr-2 h-4 w-4" />
                          Make Default
                        </DropdownMenuItem>
                      )}
                      
                      {toggleStatus && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(association.id);
                        }}>
                          {association.status === 'active' ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      
                      {removeAssociation && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add confirmation before deletion in a real app
                            if (confirm(`Are you sure you want to delete ${association.name}?`)) {
                              removeAssociation(association.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationList;
