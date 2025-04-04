
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { format, isBefore, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

interface InsuranceExpirationTableProps {
  vendors: Vendor[];
}

type InsuranceStatus = 'expired' | 'expiring-soon' | 'expiring-later' | 'valid';

interface VendorWithInsuranceStatus extends Vendor {
  status: InsuranceStatus;
  daysToExpiration?: number;
}

const InsuranceExpirationTable: React.FC<InsuranceExpirationTableProps> = ({ vendors }) => {
  const getVendorsWithExpirationStatus = () => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    const ninetyDaysFromNow = addDays(today, 90);
    
    const vendorsWithStatus: VendorWithInsuranceStatus[] = vendors
      .filter(vendor => vendor.insurance && vendor.insurance.expirationDate)
      .map(vendor => {
        const expirationDate = new Date(vendor.insurance!.expirationDate!);
        let status: InsuranceStatus;
        
        if (isBefore(expirationDate, today)) {
          status = 'expired';
        } else if (isBefore(expirationDate, thirtyDaysFromNow)) {
          status = 'expiring-soon';
        } else if (isBefore(expirationDate, ninetyDaysFromNow)) {
          status = 'expiring-later';
        } else {
          status = 'valid';
        }
        
        const daysToExpiration = differenceInDays(expirationDate, today);
        
        return {
          ...vendor,
          status,
          daysToExpiration: daysToExpiration >= 0 ? daysToExpiration : undefined
        };
      })
      .sort((a, b) => {
        // Sort by status priority (expired first, then by days to expiration)
        const statusPriority = { 'expired': 0, 'expiring-soon': 1, 'expiring-later': 2, 'valid': 3 };
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        
        // Within the same status, sort by days to expiration (ascending)
        return (a.daysToExpiration || 0) - (b.daysToExpiration || 0);
      });
      
    return vendorsWithStatus.slice(0, 5); // Show only top 5 vendors by priority
  };
  
  const getStatusBadge = (status: InsuranceStatus) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Expired</Badge>;
      case 'expiring-soon':
        return <Badge variant="warning" className="flex items-center gap-1"><CalendarClock className="h-3 w-3" /> Expiring Soon</Badge>;
      case 'expiring-later':
        return <Badge variant="outline" className="flex items-center gap-1"><CalendarClock className="h-3 w-3" /> Expires in 30-90 days</Badge>;
      case 'valid':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Valid</Badge>;
    }
  };
  
  const handleSendReminder = (vendor: Vendor) => {
    toast.success(`Reminder sent to ${vendor.name}`);
  };
  
  const vendorsWithStatus = getVendorsWithExpirationStatus();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Expiration Alerts</CardTitle>
        <CardDescription>Vendors requiring insurance renewal attention</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Insurance Status</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorsWithStatus.length > 0 ? (
              vendorsWithStatus.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                  <TableCell>
                    {vendor.insurance?.expirationDate && (
                      <>
                        {format(new Date(vendor.insurance.expirationDate), 'MMM d, yyyy')}
                        {vendor.daysToExpiration !== undefined && vendor.daysToExpiration >= 0 && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({vendor.daysToExpiration} days left)
                          </span>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleSendReminder(vendor)}
                    >
                      <Mail className="h-4 w-4" />
                      Send Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No vendors with insurance information found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InsuranceExpirationTable;
