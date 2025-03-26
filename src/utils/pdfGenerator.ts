
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

// Define the data needed for condo questionnaires
export interface CondoQuestionnaireData {
  condoName: string;
  propertyAddress: string;
  unitNumber: string;
  associationName: string;
  managementCompany: string;
  totalUnits: string;
  yearBuilt: string;
  monthlyFee: string;
  reserveBalance: string;
  ownerOccupiedPercentage: string;
  arrearsPercentage: string;
  insuranceCarrier: string;
  policyNumber: string;
  expirationDate: string;
}

// Define the data needed for account statements
export interface AccountStatementData {
  ownerName: string;
  propertyAddress: string;
  accountNumber: string;
  statementDate: string;
  previousBalance: string;
  payments: string;
  newCharges: string;
  currentBalance: string;
  transactions: any[][];
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

  // Add the missing methods
  static createCondoQuestionnaire(data: CondoQuestionnaireData) {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Condominium Questionnaire', 105, 20, { align: 'center' });
    
    // Add property and association info
    doc.setFontSize(12);
    doc.text(`Condominium: ${data.condoName}`, 20, 40);
    doc.text(`Property: ${data.propertyAddress}`, 20, 50);
    doc.text(`Unit: ${data.unitNumber}`, 20, 60);
    doc.text(`Association: ${data.associationName}`, 20, 70);
    
    // Add basic information
    doc.setFontSize(14);
    doc.text('Basic Information', 20, 90);
    
    // Create basic info table
    (doc as any).autoTable({
      startY: 95,
      head: [['Item', 'Details']],
      body: [
        ['Management Company', data.managementCompany],
        ['Total Units', data.totalUnits],
        ['Year Built', data.yearBuilt],
        ['Monthly Fee', `$${data.monthlyFee}`],
        ['Reserve Balance', `$${data.reserveBalance}`],
        ['Owner-Occupied %', `${data.ownerOccupiedPercentage}%`],
        ['Units in Arrears %', `${data.arrearsPercentage}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add insurance information
    let yPos = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.text('Insurance Information', 20, yPos);
    
    yPos += 10;
    
    // Create insurance table
    (doc as any).autoTable({
      startY: yPos,
      head: [['Item', 'Details']],
      body: [
        ['Insurance Carrier', data.insuranceCarrier],
        ['Policy Number', data.policyNumber],
        ['Expiration Date', data.expirationDate]
      ],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add footer with certification
    yPos = (doc as any).lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.text('This questionnaire is completed in compliance with lender requirements.', 20, yPos);
    yPos += 10;
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    
    return doc;
  }
  
  static createAccountStatement(data: AccountStatementData) {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Account Statement', 105, 20, { align: 'center' });
    
    // Add account info
    doc.setFontSize(12);
    doc.text(`Owner: ${data.ownerName}`, 20, 40);
    doc.text(`Property: ${data.propertyAddress}`, 20, 50);
    doc.text(`Account #: ${data.accountNumber}`, 20, 60);
    doc.text(`Statement Date: ${data.statementDate}`, 20, 70);
    
    // Add account summary
    doc.setFontSize(14);
    doc.text('Account Summary', 20, 90);
    
    // Create account summary table
    (doc as any).autoTable({
      startY: 95,
      head: [['Item', 'Amount']],
      body: [
        ['Previous Balance', `$${data.previousBalance}`],
        ['Payments', `$${data.payments}`],
        ['New Charges', `$${data.newCharges}`],
        ['Current Balance', `$${data.currentBalance}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add transaction history
    let yPos = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.text('Transaction History', 20, yPos);
    
    yPos += 10;
    
    // Create transactions table
    (doc as any).autoTable({
      startY: yPos,
      head: [['Date', 'Description', 'Amount', 'Balance']],
      body: data.transactions || [],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add footer
    yPos = (doc as any).lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.text('Please contact the management office regarding any questions about this statement.', 20, yPos);
    yPos += 10;
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    
    return doc;
  }
}
