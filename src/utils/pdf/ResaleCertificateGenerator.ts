
import { PDFGeneratorCore } from './PDFGeneratorCore';

export interface ResaleCertificateData {
  propertyAddress?: string;
  ownerName?: string;
  associationName?: string;
  closingDate?: string;
  regularAssessment?: string;
  assessmentFrequency?: string;
  specialAssessment?: string;
  transferFee?: string;
  outstandingBalance?: string;
  violations?: string;
  litigation?: string;
}

export class ResaleCertificateGenerator extends PDFGeneratorCore {
  static create(data: ResaleCertificateData) {
    const pdf = new PDFGeneratorCore({
      title: 'Texas Resale Certificate',
      filename: 'texas-resale-certificate.pdf',
      subject: 'HOA Resale Certificate',
      keywords: 'resale, certificate, texas, hoa'
    });
    
    pdf.addTitle('TEXAS RESALE CERTIFICATE')
      .addLineBreak()
      .addSubtitle('PROPERTY INFORMATION')
      .addText(`Address: ${data.propertyAddress || 'N/A'}`)
      .addText(`Owner: ${data.ownerName || 'N/A'}`)
      .addText(`Association: ${data.associationName || 'N/A'}`)
      .addText(`Closing Date: ${data.closingDate || 'N/A'}`)
      .addLineBreak()
      .addSubtitle('FINANCIAL INFORMATION')
      .addText(`Current Regular Assessment: $${data.regularAssessment || '0.00'} ${data.assessmentFrequency || 'monthly'}`)
      .addText(`Special Assessment: ${data.specialAssessment || 'None'}`)
      .addText(`Transfer Fee: $${data.transferFee || '0.00'}`)
      .addText(`Outstanding Balance: $${data.outstandingBalance || '0.00'}`)
      .addLineBreak()
      .addSubtitle('LEGAL MATTERS')
      .addText(`Violations: ${data.violations || 'None reported'}`)
      .addText(`Litigation: ${data.litigation || 'No pending litigation'}`)
      .addLineBreak()
      .addSubtitle('CERTIFICATION')
      .addText('This Resale Certificate is issued in compliance with Texas Property Code Chapter 207.')
      .addLineBreak()
      .addSignatureField('Authorized Signature');
    
    return pdf;
  }
}
