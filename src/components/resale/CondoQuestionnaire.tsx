
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const CondoQuestionnaire = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Questionnaire Submitted",
      description: "The condo questionnaire has been submitted successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condo Questionnaire</CardTitle>
        <CardDescription>
          Complete this questionnaire for lenders to assess financing eligibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Association Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="associationName">Association Name</Label>
                  <Input id="associationName" placeholder="Enter association name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select defaultValue="condo">
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="pud">Planned Unit Development (PUD)</SelectItem>
                      <SelectItem value="coop">Cooperative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalUnits">Total Units in Association</Label>
                  <Input id="totalUnits" type="number" placeholder="Enter number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupancyRate">Owner Occupancy Rate (%)</Label>
                  <Input id="occupancyRate" type="number" placeholder="Enter percentage" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectCompletion">Is the project 100% complete?</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="projectCompletion" />
                  <Label htmlFor="projectCompletion">Yes</Label>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Financial Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adequateReserves">Are reserves adequate?</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="adequateReserves" />
                    <Label htmlFor="adequateReserves">Yes</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delinquencyRate">Delinquency Rate (%)</Label>
                  <Input id="delinquencyRate" type="number" placeholder="Enter percentage" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budgetDetails">Budget & Financial Statement</Label>
                <Textarea 
                  id="budgetDetails" 
                  placeholder="Provide information about the association's current budget and financial standing" 
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialAssessments">Any special assessments?</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="specialAssessments" />
                  <Label htmlFor="specialAssessments">Yes</Label>
                </div>
              </div>
              
              {/* Conditional field that appears if special assessments exist */}
              <div className="space-y-2">
                <Label htmlFor="specialAssessmentDetails">Special Assessment Details</Label>
                <Textarea 
                  id="specialAssessmentDetails" 
                  placeholder="Describe any current or planned special assessments" 
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Insurance & Legal Status</h3>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceType">Insurance Coverage Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="insuranceHazard" />
                    <Label htmlFor="insuranceHazard">Hazard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="insuranceLiability" />
                    <Label htmlFor="insuranceLiability">Liability</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="insuranceFlood" />
                    <Label htmlFor="insuranceFlood">Flood</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="insuranceFidelity" />
                    <Label htmlFor="insuranceFidelity">Fidelity</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pendingLitigation">Any pending litigation?</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="pendingLitigation" />
                  <Label htmlFor="pendingLitigation">Yes</Label>
                </div>
              </div>
              
              {/* Conditional field that appears if there is litigation */}
              <div className="space-y-2">
                <Label htmlFor="litigationDetails">Litigation Details</Label>
                <Textarea 
                  id="litigationDetails" 
                  placeholder="Describe any current or pending litigation involving the association" 
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            
            {step < 3 ? (
              <Button type="button" onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Submit Questionnaire
              </Button>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step/3)*100}%` }}></div>
          </div>
          <span>Step {step} of 3</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CondoQuestionnaire;
