
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, FileQuestion, FileSearch, FileText, FileBadge, Clock, CalendarDays } from 'lucide-react';

interface ReviewStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, onUpdate }) => {
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate('notes', e.target.value);
  };

  const handleRequestedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate('requestedBy', e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">Please review all information before submitting your request</p>
      </div>
      
      {/* Property Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Property Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Property</p>
              <p className="font-medium">{formData.property.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unit</p>
              <p className="font-medium">{formData.property.unit}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Owner Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Owner Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{formData.owner.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{formData.owner.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{formData.owner.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Documents */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Selected Documents</h3>
          </div>
          <ul className="space-y-2">
            {formData.documents.resaleCertificate && (
              <li className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-500" />
                <span>Resale Certificate</span>
              </li>
            )}
            {formData.documents.condoQuestionnaire && (
              <li className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-purple-500" />
                <span>Condo Questionnaire</span>
              </li>
            )}
            {formData.documents.propertyInspection && (
              <li className="flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-green-500" />
                <span>Property Inspection</span>
              </li>
            )}
            {formData.documents.accountStatement && (
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span>Account Statement</span>
              </li>
            )}
            {formData.documents.trecForms && (
              <li className="flex items-center gap-2">
                <FileBadge className="h-4 w-4 text-red-500" />
                <span>TREC Forms</span>
              </li>
            )}
            {formData.fees.rush > 0 && (
              <li className="flex items-center gap-2 pt-2 border-t border-dashed">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Rush Processing (24-48 hours)</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
      
      {/* Payment Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Payment Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Processing:</span>
              <span>${formData.fees.processing.toFixed(2)}</span>
            </div>
            {formData.fees.rush > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rush Fee:</span>
                <span>${formData.fees.rush.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Due:</span>
              <span>${formData.fees.total.toFixed(2)}</span>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">
                {formData.paymentMethod === 'creditCard' && 'Credit Card Payment'}
                {formData.paymentMethod === 'escrow' && 'Collect at Closing/Escrow'}
                {formData.paymentMethod === 'invoice' && 'Send Invoice to Title Company'}
                {formData.paymentMethod === 'homeowner' && 'Bill to Homeowner'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Additional Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                placeholder="Your name or the requesting party's name"
                value={formData.requestedBy || ''}
                onChange={handleRequestedByChange}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional instructions or information"
                className="min-h-[100px]"
                value={formData.notes || ''}
                onChange={handleNotesChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
