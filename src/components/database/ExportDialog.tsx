
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [recordType, setRecordType] = useState('');
  const [exportFormat, setExportFormat] = useState('excel');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'id', 'name', 'address', 'phone', 'email', 'status'
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleExport = () => {
    if (!recordType) {
      toast.error("Please select a record type");
      return;
    }

    setIsExporting(true);
    
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`Data exported to ${exportFormat.toUpperCase()} format`);
      handleClose();
    }, 1500);
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  const selectAllFields = () => {
    const allFields = ['id', 'name', 'address', 'city', 'state', 'zip', 'phone', 'email', 'status', 'created_at', 'updated_at'];
    setSelectedFields(allFields);
  };

  const clearAllFields = () => {
    setSelectedFields([]);
  };

  // Fields for each record type
  const fieldsByType: Record<string, string[]> = {
    associations: ['id', 'name', 'description', 'address', 'city', 'state', 'zip', 'contact_email', 'contact_phone', 'status', 'created_at', 'updated_at'],
    properties: ['id', 'address', 'unit_number', 'city', 'state', 'zip', 'property_type', 'bedrooms', 'bathrooms', 'square_feet', 'association_id', 'status', 'created_at', 'updated_at'],
    residents: ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'unit_number', 'city', 'state', 'zip', 'status', 'move_in_date', 'move_out_date', 'created_at', 'updated_at'],
    vendors: ['id', 'name', 'contact_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'service_type', 'status', 'created_at', 'updated_at']
  };

  const currentFields = recordType ? fieldsByType[recordType] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export database records to a file format of your choice.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="record-type" className="text-sm font-medium">Record Type</label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger id="record-type">
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="associations">Associations</SelectItem>
                <SelectItem value="properties">Properties</SelectItem>
                <SelectItem value="residents">Residents</SelectItem>
                <SelectItem value="vendors">Vendors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Tabs defaultValue="excel" value={exportFormat} onValueChange={setExportFormat}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="excel" className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </TabsTrigger>
                <TabsTrigger value="csv" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  PDF
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Fields to Export</label>
              <div className="space-x-2">
                <Button variant="link" size="sm" className="h-auto p-0" onClick={selectAllFields}>
                  Select All
                </Button>
                <Button variant="link" size="sm" className="h-auto p-0" onClick={clearAllFields}>
                  Clear All
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-3 h-48 overflow-y-auto">
              {currentFields.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {currentFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field}`}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => toggleField(field)}
                      />
                      <Label
                        htmlFor={`field-${field}`}
                        className="text-sm cursor-pointer capitalize"
                      >
                        {field.replace(/_/g, ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">
                  Select a record type to see available fields
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-headers"
              checked={includeHeaders}
              onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
            />
            <Label
              htmlFor="include-headers"
              className="text-sm cursor-pointer"
            >
              Include column headers
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={!recordType || selectedFields.length === 0 || isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
