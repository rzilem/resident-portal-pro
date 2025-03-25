
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CustomField } from '@/types/user';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Plus, X } from "lucide-react";
import { useCustomFields } from './useCustomFields';

interface CustomFieldsCardProps {
  initialCustomFields: CustomField[];
  onCustomFieldsChange: (fields: CustomField[]) => void;
}

const CustomFieldsCard = ({ initialCustomFields, onCustomFieldsChange }: CustomFieldsCardProps) => {
  const {
    customFields,
    newCustomField,
    setNewCustomField,
    addCustomField,
    updateCustomField,
    removeCustomField
  } = useCustomFields(initialCustomFields, onCustomFieldsChange);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {customFields.length > 0 ? (
          <div className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  placeholder="Field Name"
                  value={field.label}
                  onChange={(e) => 
                    updateCustomField(field.id, { label: e.target.value })
                  }
                  className="w-1/3"
                />
                <Input
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => 
                    updateCustomField(field.id, { value: e.target.value })
                  }
                  className="flex-1"
                />
                <Select
                  value={field.type}
                  onValueChange={(value: 'text' | 'date' | 'boolean' | 'number' | 'select') => 
                    updateCustomField(field.id, { type: value })
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                    <SelectItem value="select">Selection</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomField(field.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Building className="h-10 w-10 mb-2" />
            <p>No custom fields added yet</p>
            <p className="text-sm">Add custom fields to store additional information</p>
          </div>
        )}

        <Separator />

        <div className="flex items-end gap-2">
          <div className="w-1/3">
            <Label className="text-xs">Field Name</Label>
            <Input
              placeholder="Field Name"
              value={newCustomField.label}
              onChange={(e) => 
                setNewCustomField({ ...newCustomField, label: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs">Value</Label>
            <Input
              placeholder="Value"
              value={newCustomField.value}
              onChange={(e) => 
                setNewCustomField({ ...newCustomField, value: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={newCustomField.type}
              onValueChange={(value: 'text' | 'date' | 'boolean' | 'number' | 'select') => 
                setNewCustomField({ ...newCustomField, type: value })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Yes/No</SelectItem>
                <SelectItem value="select">Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addCustomField}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFieldsCard;
