
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  CircleDashed, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  FileText, 
  ClipboardList,
  Calendar,
  DollarSign,
  FileCheck,
  LoaderCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PdfGenerator } from '@/utils/pdfGenerator';
import ResaleRbacWrapper from '@/components/resale/ResaleRbacWrapper';

const STEPS = [
  { id: 'property', label: 'Property Details', icon: Home },
  { id: 'certificate', label: 'Resale Certificate', icon: FileText },
  { id: 'questionnaire', label: 'Condo Questionnaire', icon: ClipboardList },
  { id: 'inspection', label: 'Property Inspection', icon: Calendar },
  { id: 'statement', label: 'Account Statement', icon: DollarSign },
  { id: 'trec-forms', label: 'TREC Forms', icon: FileCheck }
];

const ResaleWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Property Details
    propertyAddress: '',
    propertyType: '',
    ownerName: '',
    associationName: '',
    closingDate: '',
    
    // Certificate Details
    regularAssessment: '',
    assessmentFrequency: 'monthly',
    specialAssessment: '',
    transferFee: '',
    outstandingBalance: '',
    violations: '',
    litigation: '',
    
    // Questionnaire Details
    condoName: '',
    unitNumber: '',
    managementCompany: '',
    totalUnits: '',
    yearBuilt: '',
    monthlyFee: '',
    reserveBalance: '',
    ownerOccupiedPercentage: '',
    arrearsPercentage: '',
    insuranceCarrier: '',
    policyNumber: '',
    expirationDate: '',
    
    // Account Statement
    accountNumber: '',
    statementDate: '',
    previousBalance: '',
    payments: '',
    newCharges: '',
    currentBalance: '',
    transactions: [
      ['2023-06-01', 'Monthly Assessment', '$250.00', '$250.00'],
      ['2023-06-15', 'Payment Received', '-$250.00', '$0.00'],
      ['2023-07-01', 'Monthly Assessment', '$250.00', '$250.00']
    ],
    
    // TREC Forms
    selectedForms: [] as string[]
  });
  
  // Auto-populate data effect - simulates retrieving data from APIs
  useEffect(() => {
    // Only auto-populate if we're moving to steps beyond the initial property details
    if (currentStep === 1 && formData.propertyAddress && formData.associationName) {
      // Simulate fetching data for the certificate
      setFormData(prev => ({
        ...prev,
        regularAssessment: '250.00',
        transferFee: '150.00',
        outstandingBalance: '0.00',
        violations: 'None reported',
        litigation: 'No pending litigation'
      }));
    }
    
    if (currentStep === 2 && formData.propertyAddress) {
      // Simulate fetching data for the questionnaire
      setFormData(prev => ({
        ...prev,
        condoName: formData.associationName,
        unitNumber: formData.propertyAddress.split(' ').pop() || '',
        managementCompany: 'Texas HOA Management LLC',
        totalUnits: '120',
        yearBuilt: '2010',
        monthlyFee: '250.00',
        reserveBalance: '450000.00',
        ownerOccupiedPercentage: '75',
        arrearsPercentage: '5',
        insuranceCarrier: 'Texas Insurance Group',
        policyNumber: 'HOA-12345-TX',
        expirationDate: '2024-12-31'
      }));
    }
    
    if (currentStep === 4 && formData.ownerName) {
      // Simulate fetching data for the account statement
      setFormData(prev => ({
        ...prev,
        accountNumber: '100' + Math.floor(Math.random() * 1000),
        statementDate: new Date().toISOString().split('T')[0],
        previousBalance: '250.00',
        payments: '250.00',
        newCharges: '250.00',
        currentBalance: '250.00'
      }));
    }
  }, [currentStep, formData.propertyAddress, formData.associationName, formData.ownerName]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      // Move to next step if not at the end
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Finish wizard
        toast({
          title: "Resale Process Completed",
          description: "All steps have been completed successfully.",
        });
        navigate('/resale');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or the next step
    if (completedSteps.includes(index) || index === 0 || index <= Math.max(...completedSteps) + 1) {
      setCurrentStep(index);
    } else {
      toast({
        title: "Step Locked",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
    }
  };
  
  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) {
      return 'completed';
    }
    if (index === currentStep) {
      return 'current';
    }
    if (index <= Math.max(...completedSteps) + 1) {
      return 'available';
    }
    return 'locked';
  };
  
  const handleGeneratePdf = (documentType: 'certificate' | 'questionnaire' | 'statement') => {
    let pdf;
    
    switch (documentType) {
      case 'certificate':
        pdf = PdfGenerator.createResaleCertificate(formData);
        break;
      case 'questionnaire':
        pdf = PdfGenerator.createCondoQuestionnaire(formData);
        break;
      case 'statement':
        pdf = PdfGenerator.createAccountStatement(formData);
        break;
      default:
        return;
    }
    
    pdf.save();
    
    toast({
      title: "PDF Generated",
      description: `Your ${documentType} has been downloaded successfully.`,
    });
  };
  
  return (
    <ResaleRbacWrapper requiredPermission="create">
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Resale Process Wizard</h1>
          <p className="text-muted-foreground">
            Complete each step to prepare all required documents for your resale
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress</CardTitle>
                <CardDescription>
                  {completedSteps.length}/{STEPS.length} steps completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {STEPS.map((step, index) => {
                    const status = getStepStatus(index);
                    const StepIcon = step.icon;
                    
                    return (
                      <Button
                        key={step.id}
                        variant={status === 'current' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${
                          status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => handleStepClick(index)}
                        disabled={status === 'locked'}
                      >
                        <div className="flex items-center w-full">
                          {status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                          ) : status === 'current' ? (
                            <CircleDashed className="h-5 w-5 mr-2 text-primary" />
                          ) : (
                            <StepIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                          )}
                          <span>{step.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {Math.round((completedSteps.length / STEPS.length) * 100)}% Complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{STEPS[currentStep].label}</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {STEPS.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Property Details Step */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Please enter the property details to begin the resale process.</p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyAddress">Property Address</Label>
                        <Input 
                          id="propertyAddress" 
                          name="propertyAddress" 
                          placeholder="123 Main St, Austin, TX 78701" 
                          value={formData.propertyAddress}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select 
                          value={formData.propertyType} 
                          onValueChange={(value) => handleSelectChange('propertyType', value)}
                        >
                          <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="condo">Condominium</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="single-family">Single Family Home</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Current Owner Name</Label>
                        <Input 
                          id="ownerName" 
                          name="ownerName" 
                          placeholder="John Doe" 
                          value={formData.ownerName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="associationName">Association Name</Label>
                        <Input 
                          id="associationName" 
                          name="associationName" 
                          placeholder="Sunset Heights HOA" 
                          value={formData.associationName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="closingDate">Closing Date</Label>
                        <Input 
                          id="closingDate" 
                          name="closingDate" 
                          type="date" 
                          value={formData.closingDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Resale Certificate Step */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a Texas-compliant resale certificate with auto-populated data.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="regularAssessment">Regular Assessment</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="regularAssessment" 
                            name="regularAssessment" 
                            placeholder="250.00" 
                            value={formData.regularAssessment}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="assessmentFrequency">Assessment Frequency</Label>
                        <Select 
                          value={formData.assessmentFrequency} 
                          onValueChange={(value) => handleSelectChange('assessmentFrequency', value)}
                        >
                          <SelectTrigger id="assessmentFrequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialAssessment">Special Assessment</Label>
                        <Input 
                          id="specialAssessment" 
                          name="specialAssessment" 
                          placeholder="None" 
                          value={formData.specialAssessment}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="transferFee">Transfer Fee</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="transferFee" 
                            name="transferFee" 
                            placeholder="150.00" 
                            value={formData.transferFee}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="outstandingBalance">Outstanding Balance</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="outstandingBalance" 
                            name="outstandingBalance" 
                            placeholder="0.00" 
                            value={formData.outstandingBalance}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="violations">Violations</Label>
                        <Textarea 
                          id="violations" 
                          name="violations" 
                          placeholder="List any violations" 
                          value={formData.violations}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="litigation">Litigation</Label>
                        <Textarea 
                          id="litigation" 
                          name="litigation" 
                          placeholder="List any pending litigation" 
                          value={formData.litigation}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => handleGeneratePdf('certificate')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Generate Certificate PDF</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Condo Questionnaire Step */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete the standardized condo questionnaire for lenders.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="condoName">Condominium Name</Label>
                        <Input 
                          id="condoName" 
                          name="condoName" 
                          value={formData.condoName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="unitNumber">Unit Number</Label>
                        <Input 
                          id="unitNumber" 
                          name="unitNumber" 
                          value={formData.unitNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="managementCompany">Management Company</Label>
                        <Input 
                          id="managementCompany" 
                          name="managementCompany" 
                          value={formData.managementCompany}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="totalUnits">Total Units</Label>
                        <Input 
                          id="totalUnits" 
                          name="totalUnits" 
                          value={formData.totalUnits}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input 
                          id="yearBuilt" 
                          name="yearBuilt" 
                          value={formData.yearBuilt}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="monthlyFee">Monthly HOA Fee</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="monthlyFee" 
                            name="monthlyFee" 
                            value={formData.monthlyFee}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reserveBalance">Reserve Fund Balance</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="reserveBalance" 
                            name="reserveBalance" 
                            value={formData.reserveBalance}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ownerOccupiedPercentage">Owner-Occupied Percentage</Label>
                        <div className="flex">
                          <Input 
                            id="ownerOccupiedPercentage" 
                            name="ownerOccupiedPercentage" 
                            value={formData.ownerOccupiedPercentage}
                            onChange={handleInputChange}
                            className="rounded-r-none"
                          />
                          <span className="inline-flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md">%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Is the association involved in any litigation?</Label>
                        <RadioGroup defaultValue="no" className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="litigation-yes" />
                            <Label htmlFor="litigation-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="litigation-no" />
                            <Label htmlFor="litigation-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => handleGeneratePdf('questionnaire')}
                        className="flex items-center gap-2"
                      >
                        <ClipboardList className="h-4 w-4" />
                        <span>Generate Questionnaire PDF</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Property Inspection Step */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Schedule and manage a property inspection with calendar integration.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inspectionDate">Preferred Inspection Date</Label>
                        <Input 
                          id="inspectionDate" 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inspectionTime">Preferred Time</Label>
                        <Select defaultValue="morning">
                          <SelectTrigger id="inspectionTime">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (1pm-4pm)</SelectItem>
                            <SelectItem value="evening">Evening (5pm-7pm)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inspectionType">Inspection Type</Label>
                        <Select defaultValue="standard">
                          <SelectTrigger id="inspectionType">
                            <SelectValue placeholder="Select inspection type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Inspection</SelectItem>
                            <SelectItem value="detailed">Detailed Inspection</SelectItem>
                            <SelectItem value="follow-up">Follow-up Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inspectionNotes">Notes for Inspector</Label>
                        <Textarea 
                          id="inspectionNotes" 
                          placeholder="Any special instructions or concerns"
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-amber-50 p-4 border border-amber-200 mt-4">
                      <p className="text-amber-800 text-sm">
                        Available inspection dates will be shown here from the calendar integration. 
                        In a production environment, this would connect to your scheduling system.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Account Statement Step */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a real-time statement of account showing the seller's current standing.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input 
                          id="accountNumber" 
                          name="accountNumber" 
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="statementDate">Statement Date</Label>
                        <Input 
                          id="statementDate" 
                          name="statementDate" 
                          type="date" 
                          value={formData.statementDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="previousBalance">Previous Balance</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="previousBalance" 
                            name="previousBalance" 
                            value={formData.previousBalance}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payments">Payments</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="payments" 
                            name="payments" 
                            value={formData.payments}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newCharges">New Charges</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="newCharges" 
                            name="newCharges" 
                            value={formData.newCharges}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentBalance">Current Balance</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                          <Input 
                            id="currentBalance" 
                            name="currentBalance" 
                            value={formData.currentBalance}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => handleGeneratePdf('statement')}
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>Generate Statement PDF</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* TREC Forms Step */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select TREC forms required for your transaction.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Required Forms</Label>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <input type="checkbox" id="form-1" className="mt-1" checked readOnly />
                            <Label htmlFor="form-1" className="font-normal">
                              <div>Seller's Disclosure Notice (OP-H)</div>
                              <div className="text-xs text-muted-foreground">Required for all property sales in Texas</div>
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <input type="checkbox" id="form-2" className="mt-1" checked readOnly />
                            <Label htmlFor="form-2" className="font-normal">
                              <div>Condominium Resale Certificate (OP-C)</div>
                              <div className="text-xs text-muted-foreground">Required for condominium properties</div>
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <input type="checkbox" id="form-3" className="mt-1" checked readOnly />
                            <Label htmlFor="form-3" className="font-normal">
                              <div>Addendum for Property Subject to HOA (OP-A)</div>
                              <div className="text-xs text-muted-foreground">Required for properties in an HOA</div>
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Optional Forms</Label>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <input type="checkbox" id="form-4" className="mt-1" />
                            <Label htmlFor="form-4" className="font-normal">
                              <div>Third Party Financing Addendum (OP-F)</div>
                              <div className="text-xs text-muted-foreground">For transactions involving third-party financing</div>
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <input type="checkbox" id="form-5" className="mt-1" />
                            <Label htmlFor="form-5" className="font-normal">
                              <div>Notice of Buyer's Termination of Contract (OP-T)</div>
                              <div className="text-xs text-muted-foreground">Optional form for buyer's contract termination</div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-blue-50 p-4 border border-blue-200 mt-4">
                      <p className="text-blue-800 text-sm">
                        Selected forms will be added to your document package. You can access and edit these forms at any time through the TREC Forms tab in the Resale Management dashboard.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button onClick={handleNext} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentStep === STEPS.length - 1 ? (
                    <>Finish</>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ResaleRbacWrapper>
  );
};

export default ResaleWizard;
