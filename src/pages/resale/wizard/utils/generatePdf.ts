
import { jsPDF } from 'jspdf';
import { 
  ResaleCertificateData, 
  CondoQuestionnaireData, 
  AccountStatementData,
  generateResaleCertificate,
  generateCondoQuestionnaire,
  generateAccountStatement
} from '@/utils/pdfGenerator';

export const generateResalePdf = (data: ResaleCertificateData): jsPDF => {
  return generateResaleCertificate(data);
};

export const generateQuestionnairePdf = (data: CondoQuestionnaireData): jsPDF => {
  return generateCondoQuestionnaire(data);
};

export const generateStatementPdf = (data: AccountStatementData): jsPDF => {
  return generateAccountStatement(data);
};
