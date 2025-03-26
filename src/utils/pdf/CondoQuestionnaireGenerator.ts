
import { PDFGeneratorCore } from './PDFGeneratorCore';

export interface CondoQuestionnaireData {
  condoName?: string;
  propertyAddress?: string;
  unitNumber?: string;
  associationName?: string;
  managementCompany?: string;
  totalUnits?: string;
  yearBuilt?: string;
  monthlyFee?: string;
  reserveBalance?: string;
  ownerOccupiedPercentage?: string;
  arrearsPercentage?: string;
  insuranceCarrier?: string;
  policyNumber?: string;
  expirationDate?: string;
}

export class CondoQuestionnaireGenerator extends PDFGeneratorCore {
  static create(data: CondoQuestionnaireData) {
    const pdf = new PDFGeneratorCore({
      title: 'Condo Questionnaire',
      filename: 'condo-questionnaire.pdf',
      subject: 'Condominium Questionnaire for Lenders'
    });
    
    pdf.addTitle('CONDOMINIUM QUESTIONNAIRE')
      .addLineBreak()
      .addSubtitle('PROPERTY INFORMATION')
      .addText(`Condominium Name: ${data.condoName || 'N/A'}`)
      .addText(`Property Address: ${data.propertyAddress || 'N/A'}`)
      .addText(`Unit Number: ${data.unitNumber || 'N/A'}`)
      .addLineBreak()
      .addSubtitle('ASSOCIATION INFORMATION')
      .addText(`Association Name: ${data.associationName || 'N/A'}`)
      .addText(`Management Company: ${data.managementCompany || 'N/A'}`)
      .addText(`Total Units: ${data.totalUnits || 'N/A'}`)
      .addText(`Year Built: ${data.yearBuilt || 'N/A'}`)
      .addLineBreak()
      .addSubtitle('FINANCIAL INFORMATION')
      .addText(`Monthly HOA Fee: $${data.monthlyFee || '0.00'}`)
      .addText(`Reserve Fund Balance: $${data.reserveBalance || '0.00'}`)
      .addText(`Percentage of Owner-Occupied Units: ${data.ownerOccupiedPercentage || '0'}%`)
      .addText(`Percentage of Units in Arrears: ${data.arrearsPercentage || '0'}%`)
      .addLineBreak()
      .addSubtitle('INSURANCE INFORMATION')
      .addText(`Insurance Carrier: ${data.insuranceCarrier || 'N/A'}`)
      .addText(`Policy Number: ${data.policyNumber || 'N/A'}`)
      .addText(`Expiration Date: ${data.expirationDate || 'N/A'}`)
      .addLineBreak()
      .addSignatureField('Completed By');
    
    return pdf;
  }
}
