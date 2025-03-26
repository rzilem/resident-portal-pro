
import { PdfGenerator } from '@/utils/pdfGenerator';
import { FormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useGeneratePdf = () => {
  const { toast } = useToast();
  
  const generatePdf = (documentType: 'certificate' | 'questionnaire' | 'statement', formData: FormData) => {
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
  
  return generatePdf;
};
