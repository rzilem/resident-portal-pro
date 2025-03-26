
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ResaleCertificate } from '@/types/supabase';

// Define the specific data needed for resale certificates
export interface ResaleCertificateData {
  propertyAddress: string;
  ownerName: string;
  associationName: string;
  closingDate: string;
  regularAssessment: string;
  assessmentFrequency: string;
  specialAssessment: string;
  transferFee: string;
  outstandingBalance: string;
  violations: string;
  litigation: string;
}

export class PdfGenerator {
  static createResaleCertificate(data: ResaleCertificateData) {
    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.text('Resale Certificate', 105, 20, { align: 'center' });
    
    // Add property and association info
    doc.setFontSize(12);
    doc.text(`Property: ${data.propertyAddress}`, 20, 40);
    doc.text(`Owner: ${data.ownerName}`, 20, 50);
    doc.text(`Association: ${data.associationName}`, 20, 60);
    doc.text(`Closing Date: ${data.closingDate}`, 20, 70);
    
    // Add financial information
    doc.setFontSize(14);
    doc.text('Financial Information', 20, 90);
    
    // Create financial table
    (doc as any).autoTable({
      startY: 95,
      head: [['Item', 'Amount']],
      body: [
        ['Regular Assessment', `$${data.regularAssessment} (${data.assessmentFrequency})`],
        ['Special Assessment', data.specialAssessment],
        ['Transfer Fee', `$${data.transferFee}`],
        ['Outstanding Balance', `$${data.outstandingBalance}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add violations and litigation
    let yPos = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.text('Property Status', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.text('Violations:', 20, yPos);
    yPos += 10;
    doc.text(data.violations, 30, yPos);
    
    yPos += 20;
    doc.text('Litigation:', 20, yPos);
    yPos += 10;
    doc.text(data.litigation, 30, yPos);
    
    // Add footer with certification
    yPos += 30;
    doc.setFontSize(10);
    doc.text('This certificate is issued in compliance with state law governing property transfers.', 20, yPos);
    yPos += 10;
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    
    return doc;
  }
}
