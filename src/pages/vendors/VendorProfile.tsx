
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, PencilLine, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VendorProfileHeader from '@/components/vendors/VendorProfileHeader';
import VendorTabs from '@/components/vendors/VendorTabs';
import VendorNotFound from '@/components/vendors/VendorNotFound';
import { useVendor } from '@/hooks/useVendors';
import { useVendors } from '@/hooks/useVendors';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VendorForm from '@/components/vendors/VendorForm';
import { Skeleton } from '@/components/ui/skeleton';

const VendorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vendor, isLoading, updateVendor } = useVendor(id);
  const { deleteVendor } = useVendors();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditVendor = (formData: any) => {
    setIsSubmitting(true);
    updateVendor(formData, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleDeleteVendor = () => {
    if (!id) return;
    
    setIsSubmitting(true);
    deleteVendor(id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        navigate('/vendors');
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 gap-1" 
          onClick={() => navigate('/vendors')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vendors
        </Button>
        
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-32 mt-1" />
        </div>
        
        <div className="mt-8">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return <VendorNotFound />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 gap-1" 
        onClick={() => navigate('/vendors')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Vendors
      </Button>
      
      <div className="flex justify-between items-start mb-6">
        <VendorProfileHeader vendor={vendor} />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilLine className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground mt-1 mb-6">
        <Building2 className="h-4 w-4" />
        <span>{vendor.category} • {vendor.status === 'active' ? 'Active' : 'Inactive'}</span>
      </div>
      
      <VendorTabs vendor={vendor} />
      
      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm 
            initialData={vendor} 
            onSubmit={handleEditVendor} 
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Vendor Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Vendor
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {vendor.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteVendor}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProfile;
