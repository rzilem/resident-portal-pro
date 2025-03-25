
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PrintQueueSettings: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Print Queue Settings</DialogTitle>
          <DialogDescription>
            Configure your print queue and HOA Mailers connection settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">HOA Mailers Integration</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="api-enabled">Enable API Integration</Label>
              <Switch id="api-enabled" defaultChecked />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" value="••••••••••••••••••••••••••••••" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input id="api-endpoint" value="https://api.hoamailers.com/v1/print" />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Default Print Settings</h3>
            <div className="grid gap-2">
              <Label htmlFor="default-printer">Default Printer</Label>
              <Select defaultValue="hoa-mailers">
                <SelectTrigger id="default-printer">
                  <SelectValue placeholder="Select printer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="hoa-mailers">HOA Mailers</SelectItem>
                    <SelectItem value="local">Local Printer</SelectItem>
                    <SelectItem value="pdf">Save as PDF</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="include-labels">Include Mailing Labels by Default</Label>
              <Switch id="include-labels" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="preview-first">Show Preview Before Printing</Label>
              <Switch id="preview-first" defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Queue Management</h3>
            <div className="grid gap-2">
              <Label htmlFor="retention">Job Retention Period (days)</Label>
              <Input id="retention" type="number" defaultValue={30} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-archive">Auto-archive Completed Jobs</Label>
              <Switch id="auto-archive" defaultChecked />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintQueueSettings;
