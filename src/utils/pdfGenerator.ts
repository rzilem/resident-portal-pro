
import { PDFGeneratorCore, PdfOptions } from './pdf/PDFGeneratorCore';
import { ResaleCertificateGenerator, ResaleCertificateData } from './pdf/ResaleCertificateGenerator';
import { CondoQuestionnaireGenerator, CondoQuestionnaireData } from './pdf/CondoQuestionnaireGenerator';
import { AccountStatementGenerator, AccountStatementData } from './pdf/AccountStatementGenerator';

export class PdfGenerator extends PDFGeneratorCore {
  // Factory methods for specific document types
  static createResaleCertificate(data: ResaleCertificateData) {
    return ResaleCertificateGenerator.create(data);
  }
  
  static createCondoQuestionnaire(data: CondoQuestionnaireData) {
    return CondoQuestionnaireGenerator.create(data);
  }
  
  static createAccountStatement(data: AccountStatementData) {
    return AccountStatementGenerator.create(data);
  }
}

// Re-export all types and classes
export { PdfOptions, PDFGeneratorCore };
export { ResaleCertificateData };
export { CondoQuestionnaireData };
export { AccountStatementData };
