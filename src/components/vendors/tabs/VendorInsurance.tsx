
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorInsurance, updateVendorInsurance } from '@/api/vendorApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Calendar, DollarSign, Building2, User, Mail, Phone, Clock, AlertTriangle, CheckCircle2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vendor, VendorInsurance as VendorInsuranceType } from '@/types/vendor';
import { format, isAfter, addDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface VendorInsuranceProps {
  vendor: Vendor;
}

const VendorInsurance: React.FC<VendorInsuranceProps> = ({ vendor }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorInsuranceType>>({});
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  
  const { data: insurance, isLoading } = useQuery({
    queryKey: ['vendorInsurance', vendor.id],
    queryFn: () => getVendorInsurance(vendor.id),
  });
  
  const updateInsuranceMutation = useMutation({
    mutationFn: (data: Omit<VendorInsuranceType, 'id' | 'createdAt' | 'updatedAt'>) => 
      updateVendorInsurance(vendor.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorInsurance', vendor.id] });
      setIsEditDialogOpen(false);
    },
  });
  
  const handleOpenEditDialog = () => {
    // Initialize form data with current insurance data
    if (insurance) {
      setFormData({
        policyNumber: insurance.policyNumber,
        provider: insurance.provider,
        coverageAmount: insurance.coverageAmount,
        coverageType: insurance.coverageType,
        agent: {
          name: insurance.agent?.name || '',
          email: insurance.agent?.email || '',
          phone: insurance.agent?.phone || '',
        }
      });
      
      if (insurance.expirationDate) {
        setExpirationDate(new Date(insurance.expirationDate));
      }
    }
    
    setIsEditDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('agent.')) {
      const agentField = name.split('.')[1];
      setFormData({
        ...formData,
        agent: {
          ...formData.agent,
          [agentField]: value
        }
      });
    } else if (name === 'coverageAmount') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = () => {
    if (!vendor.id) return;
    
    const updatedInsurance = {
      ...formData,
      expirationDate: expirationDate?.toISOString(),
    };
    
    updateInsuranceMutation.mutate(updatedInsurance);
  };
  
  const isExpired = (date?: string) => {
    if (!date) return false;
    return !isAfter(new Date(date), new Date());
  };
  
  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const expirationDate = new Date(date);
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return isAfter(expirationDate, new Date()) && !isAfter(expirationDate, thirtyDaysFromNow);
  };
  
  const getExpirationStatus = () => {
    if (!insurance?.expirationDate) return null;
    
    if (isExpired(insurance.expirationDate)) {
      return (
        <div className="flex items-center gap-2 text-destructive font-medium">
          <AlertTriangle className="h-4 w-4" />
          <span>Expired on {format(new Date(insurance.expirationDate), 'MMM d, yyyy')}</span>
        </div>
      );
    }
    
    if (isExpiringSoon(insurance.expirationDate)) {
      return (
        <div className="flex items-center gap-2 text-yellow-600 font-medium">
          <Clock className="h-4 w-4" />
          <span>Expiring soon ({format(new Date(insurance.expirationDate), 'MMM d, yyyy')})</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <CheckCircle2 className="h-4 w-4" />
        <span>Valid until {format(new Date(insurance.expirationDate), 'MMM d, yyyy')}</span>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-5 w-5" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Insurance Information</CardTitle>
          <Button onClick={handleOpenEditDialog} size="sm">
            <Edit className="h-4 w-4 mr-1" /> {insurance ? "Update" : "Add"} Insurance
          </Button>
        </div>
        <CardDescription>
          Vendor insurance details and expiration tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!insurance ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-muted-foreground">No insurance information added yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={handleOpenEditDialog}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Insurance Details
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              {getExpirationStatus()}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {insurance.policyNumber && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Policy Number</div>
                      <div className="text-sm text-muted-foreground">{insurance.policyNumber}</div>
                    </div>
                  </div>
                )}
                
                {insurance.provider && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Provider</div>
                      <div className="text-sm text-muted-foreground">{insurance.provider}</div>
                    </div>
                  </div>
                )}
                
                {insurance.expirationDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Expiration Date</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(insurance.expirationDate), 'MMMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {insurance.coverageAmount && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Coverage Amount</div>
                      <div className="text-sm text-muted-foreground">
                        ${insurance.coverageAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {insurance.coverageType && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Coverage Type</div>
                      <div className="text-sm text-muted-foreground">{insurance.coverageType}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {insurance.agent && (Object.values(insurance.agent).some(val => val)) && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Agent Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {insurance.agent.name && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Name</div>
                        <div className="text-sm">{insurance.agent.name}</div>
                      </div>
                    </div>
                  )}
                  
                  {insurance.agent.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="text-sm">
                          <a href={`mailto:${insurance.agent.email}`} className="hover:underline">
                            {insurance.agent.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {insurance.agent.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="text-sm">
                          <a href={`tel:${insurance.agent.phone}`} className="hover:underline">
                            {insurance.agent.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Edit Insurance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{insurance ? "Update" : "Add"} Insurance Information</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  name="policyNumber"
                  value={formData.policyNumber || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  name="provider"
                  value={formData.provider || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expirationDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={expirationDate}
                      onSelect={setExpirationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="coverageAmount">Coverage Amount</Label>
                <Input
                  id="coverageAmount"
                  name="coverageAmount"
                  type="number"
                  value={formData.coverageAmount || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="coverageType">Coverage Type</Label>
              <Input
                id="coverageType"
                name="coverageType"
                value={formData.coverageType || ''}
                onChange={handleInputChange}
                placeholder="e.g. General Liability, Workers' Compensation"
              />
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Agent Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    name="agent.name"
                    value={formData.agent?.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentEmail">Agent Email</Label>
                    <Input
                      id="agentEmail"
                      name="agent.email"
                      type="email"
                      value={formData.agent?.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentPhone">Agent Phone</Label>
                    <Input
                      id="agentPhone"
                      name="agent.phone"
                      value={formData.agent?.phone || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={updateInsuranceMutation.isPending}
            >
              {updateInsuranceMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VendorInsurance;
