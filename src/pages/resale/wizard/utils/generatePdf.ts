
import { PdfGenerator, ResaleCertificateData, CondoQuestionnaireData, AccountStatementData } from '@/utils/pdfGenerator';
import { FormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useGeneratePdf = () => {
  const { toast } = useToast();
  
  const generatePdf = (documentType: 'certificate' | 'questionnaire' | 'statement', formData: FormData) => {
    let pdf;
    
    switch (documentType) {
      case 'certificate':
        const certificateData: ResaleCertificateData = {
          propertyAddress: formData.propertyAddress,
          ownerName: formData.ownerName,
          associationName: formData.associationName,
          closingDate: formData.closingDate,
          regularAssessment: formData.regularAssessment,
          assessmentFrequency: formData.assessmentFrequency,
          specialAssessment: formData.specialAssessment,
          transferFee: formData.transferFee,
          outstandingBalance: formData.outstandingBalance,
          violations: formData.violations,
          litigation: formData.litigation
        };
        pdf = PdfGenerator.createResaleCertificate(certificateData);
        break;
      case 'questionnaire':
        const questionnaireData: CondoQuestionnaireData = {
          condoName: formData.condoName,
          propertyAddress: formData.propertyAddress,
          unitNumber: formData.unitNumber,
          associationName: formData.associationName,
          managementCompany: formData.managementCompany,
          totalUnits: formData.totalUnits,
          yearBuilt: formData.yearBuilt,
          monthlyFee: formData.monthlyFee,
          reserveBalance: formData.reserveBalance,
          ownerOccupiedPercentage: formData.ownerOccupiedPercentage,
          arrearsPercentage: formData.arrearsPercentage || '0',
          insuranceCarrier: formData.insuranceCarrier || 'N/A',
          policyNumber: formData.policyNumber || 'N/A',
          expirationDate: formData.expirationDate || 'N/A'
        };
        pdf = PdfGenerator.createCondoQuestionnaire(questionnaireData);
        break;
      case 'statement':
        const statementData: AccountStatementData = {
          ownerName: formData.ownerName,
          propertyAddress: formData.propertyAddress,
          accountNumber: formData.accountNumber,
          statementDate: formData.statementDate,
          previousBalance: formData.previousBalance,
          payments: formData.payments,
          newCharges: formData.newCharges,
          currentBalance: formData.currentBalance,
          transactions: formData.transactions || []
        };
        pdf = PdfGenerator.createAccountStatement(statementData);
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
  
  return generatePdf;
};
