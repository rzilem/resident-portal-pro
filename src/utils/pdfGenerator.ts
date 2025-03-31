
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AccountStatementData } from './pdf/AccountStatementGenerator';
import { ResaleCertificateData } from './pdf/ResaleCertificateGenerator';
import { CondoQuestionnaireData } from './pdf/CondoQuestionnaireGenerator';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export class PdfGenerator {
  static createAccountStatement(data: AccountStatementData) {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('ACCOUNT STATEMENT', 105, 20, { align: 'center' });
    
    // Add account information
    doc.setFontSize(14);
    doc.text('ACCOUNT INFORMATION', 20, 40);
    doc.setFontSize(12);
    doc.text(`Owner: ${data.ownerName || 'N/A'}`, 20, 50);
    doc.text(`Property Address: ${data.propertyAddress || 'N/A'}`, 20, 60);
    doc.text(`Account Number: ${data.accountNumber || 'N/A'}`, 20, 70);
    doc.text(`Statement Date: ${data.statementDate || 'N/A'}`, 20, 80);
    
    // Add account summary
    doc.setFontSize(14);
    doc.text('ACCOUNT SUMMARY', 20, 100);
    doc.setFontSize(12);
    doc.text(`Previous Balance: $${data.previousBalance || '0.00'}`, 20, 110);
    doc.text(`Payments: $${data.payments || '0.00'}`, 20, 120);
    doc.text(`New Charges: $${data.newCharges || '0.00'}`, 20, 130);
    doc.text(`Current Balance: $${data.currentBalance || '0.00'}`, 20, 140);
    
    // Add transaction history
    doc.setFontSize(14);
    doc.text('TRANSACTION HISTORY', 20, 160);
    
    // Add table of transactions
    const header = ['Date', 'Description', 'Amount', 'Balance'];
    const transactions = data.transactions || [];
    
    doc.autoTable({
      head: [header],
      body: transactions,
      startY: 170,
      margin: { top: 180 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 133, 244] }
    });
    
    return doc;
  }

  static createResaleCertificate(data: ResaleCertificateData) {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('TEXAS RESALE CERTIFICATE', 105, 20, { align: 'center' });
    
    // Property information
    doc.setFontSize(14);
    doc.text('PROPERTY INFORMATION', 20, 40);
    doc.setFontSize(12);
    doc.text(`Address: ${data.propertyAddress || 'N/A'}`, 20, 50);
    doc.text(`Owner: ${data.ownerName || 'N/A'}`, 20, 60);
    doc.text(`Association: ${data.associationName || 'N/A'}`, 20, 70);
    doc.text(`Closing Date: ${data.closingDate || 'N/A'}`, 20, 80);
    
    // Financial information
    doc.setFontSize(14);
    doc.text('FINANCIAL INFORMATION', 20, 100);
    doc.setFontSize(12);
    doc.text(`Current Regular Assessment: $${data.regularAssessment || '0.00'} ${data.assessmentFrequency || 'monthly'}`, 20, 110);
    doc.text(`Special Assessment: ${data.specialAssessment || 'None'}`, 20, 120);
    doc.text(`Transfer Fee: $${data.transferFee || '0.00'}`, 20, 130);
    doc.text(`Outstanding Balance: $${data.outstandingBalance || '0.00'}`, 20, 140);
    
    // Legal matters
    doc.setFontSize(14);
    doc.text('LEGAL MATTERS', 20, 160);
    doc.setFontSize(12);
    doc.text(`Violations: ${data.violations || 'None reported'}`, 20, 170);
    doc.text(`Litigation: ${data.litigation || 'No pending litigation'}`, 20, 180);
    
    // Certification
    doc.setFontSize(14);
    doc.text('CERTIFICATION', 20, 200);
    doc.setFontSize(12);
    doc.text('This Resale Certificate is issued in compliance with Texas Property Code Chapter 207.', 20, 210);
    
    // Signature line
    doc.line(20, 240, 100, 240);
    doc.text('Authorized Signature', 20, 250);
    
    return doc;
  }

  static createCondoQuestionnaire(data: CondoQuestionnaireData) {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('CONDOMINIUM QUESTIONNAIRE', 105, 20, { align: 'center' });
    
    // Property information
    doc.setFontSize(14);
    doc.text('PROPERTY INFORMATION', 20, 40);
    doc.setFontSize(12);
    doc.text(`Condominium Name: ${data.condoName || 'N/A'}`, 20, 50);
    doc.text(`Property Address: ${data.propertyAddress || 'N/A'}`, 20, 60);
    doc.text(`Unit Number: ${data.unitNumber || 'N/A'}`, 20, 70);
    
    // Association information
    doc.setFontSize(14);
    doc.text('ASSOCIATION INFORMATION', 20, 90);
    doc.setFontSize(12);
    doc.text(`Association Name: ${data.associationName || 'N/A'}`, 20, 100);
    doc.text(`Management Company: ${data.managementCompany || 'N/A'}`, 20, 110);
    doc.text(`Total Units: ${data.totalUnits || 'N/A'}`, 20, 120);
    doc.text(`Year Built: ${data.yearBuilt || 'N/A'}`, 20, 130);
    
    // Financial information
    doc.setFontSize(14);
    doc.text('FINANCIAL INFORMATION', 20, 150);
    doc.setFontSize(12);
    doc.text(`Monthly HOA Fee: $${data.monthlyFee || '0.00'}`, 20, 160);
    doc.text(`Reserve Fund Balance: $${data.reserveBalance || '0.00'}`, 20, 170);
    doc.text(`Percentage of Owner-Occupied Units: ${data.ownerOccupiedPercentage || '0'}%`, 20, 180);
    doc.text(`Percentage of Units in Arrears: ${data.arrearsPercentage || '0'}%`, 20, 190);
    
    // Insurance information
    doc.setFontSize(14);
    doc.text('INSURANCE INFORMATION', 20, 210);
    doc.setFontSize(12);
    doc.text(`Insurance Carrier: ${data.insuranceCarrier || 'N/A'}`, 20, 220);
    doc.text(`Policy Number: ${data.policyNumber || 'N/A'}`, 20, 230);
    doc.text(`Expiration Date: ${data.expirationDate || 'N/A'}`, 20, 240);
    
    // Signature line
    doc.line(20, 260, 100, 260);
    doc.text('Completed By', 20, 270);
    
    return doc;
  }
  
  // Function to save the PDF
  static savePdf(doc: jsPDF, filename: string) {
    doc.save(filename);
  }
}
