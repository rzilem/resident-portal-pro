
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

// Define types for PDF documents
export interface ResaleCertificateData {
  propertyAddress: string;
  unitNumber: string;
  associationName: string;
  ownerName: string;
  purchaserName: string;
  closingDate: string;
  assessmentAmount: string;
  outstandingDues: string;
  specialAssessments: string;
  certifiedBy: string;
  certificationDate: string;
}

export interface CondoQuestionnaireData {
  associationName: string;
  propertyAddress: string;
  unitNumber: string;
  totalUnits: number;
  ownerOccupancyRate: number;
  reservesAdequate: boolean;
  pendingLitigation: boolean;
  specialAssessments: string;
  insuranceCoverage: string[];
  delinquencyRate: number;
  completedBy: string;
  completedDate: string;
}

export interface AccountStatementData {
  ownerName: string;
  propertyAddress: string;
  unitNumber: string;
  associationName: string;
  statementDate: string;
  balanceForward: string;
  currentDues: string;
  payments: Array<{date: string, description: string, amount: string}>;
  charges: Array<{date: string, description: string, amount: string}>;
  totalBalance: string;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  date: string;
  columns: string[];
  data: string[][];
  summary?: {[key: string]: string};
}

/**
 * Generates a PDF report with tabular data
 */
export const generateReport = (reportData: ReportData): jsPDF => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(reportData.title, 14, 22);
  
  // Add subtitle if provided
  if (reportData.subtitle) {
    doc.setFontSize(12);
    doc.text(reportData.subtitle, 14, 30);
  }
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${reportData.date}`, 14, reportData.subtitle ? 38 : 30);
  
  // Add table
  autoTable(doc, {
    head: [reportData.columns],
    body: reportData.data,
    startY: reportData.subtitle ? 42 : 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Add summary if provided
  if (reportData.summary) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text('Summary:', 14, finalY);
    
    let yOffset = finalY + 6;
    Object.entries(reportData.summary).forEach(([key, value]) => {
      doc.setFontSize(10);
      doc.text(`${key}: ${value}`, 14, yOffset);
      yOffset += 6;
    });
  }
  
  return doc;
};

/**
 * Generates a resale certificate PDF
 */
export const generateResaleCertificate = (data: ResaleCertificateData): jsPDF => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('RESALE CERTIFICATE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Association: ${data.associationName}`, 20, 35);
  
  // Property information section
  doc.setFontSize(14);
  doc.text('Property Information', 20, 45);
  doc.setLineWidth(0.5);
  doc.line(20, 47, 190, 47);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 55);
  doc.text(`Unit Number: ${data.unitNumber}`, 20, 62);
  doc.text(`Current Owner: ${data.ownerName}`, 20, 69);
  doc.text(`Purchaser: ${data.purchaserName}`, 20, 76);
  doc.text(`Closing Date: ${data.closingDate}`, 20, 83);
  
  // Financial information section
  doc.setFontSize(14);
  doc.text('Financial Information', 20, 95);
  doc.setLineWidth(0.5);
  doc.line(20, 97, 190, 97);
  
  doc.setFontSize(10);
  doc.text(`Monthly Assessment Amount: ${data.assessmentAmount}`, 20, 105);
  doc.text(`Outstanding Dues: ${data.outstandingDues}`, 20, 112);
  doc.text(`Special Assessments: ${data.specialAssessments}`, 20, 119);
  
  // Certification section
  doc.setFontSize(14);
  doc.text('Certification', 20, 135);
  doc.setLineWidth(0.5);
  doc.line(20, 137, 190, 137);
  
  doc.setFontSize(10);
  doc.text(`This information is certified by: ${data.certifiedBy}`, 20, 145);
  doc.text(`Date: ${data.certificationDate}`, 20, 152);
  
  // Add disclaimer
  doc.setFontSize(8);
  doc.text('This certificate is valid for 30 days from the certification date.', 20, 170);
  
  return doc;
};

/**
 * Generates a condo questionnaire PDF
 */
export const generateCondoQuestionnaire = (data: CondoQuestionnaireData): jsPDF => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('CONDOMINIUM QUESTIONNAIRE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Association: ${data.associationName}`, 20, 35);
  
  // Property information section
  doc.setFontSize(14);
  doc.text('Property Information', 20, 45);
  doc.setLineWidth(0.5);
  doc.line(20, 47, 190, 47);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 55);
  doc.text(`Unit Number: ${data.unitNumber}`, 20, 62);
  doc.text(`Total Units in Association: ${data.totalUnits}`, 20, 69);
  doc.text(`Owner Occupancy Rate: ${data.ownerOccupancyRate}%`, 20, 76);
  
  // Financial information section
  doc.setFontSize(14);
  doc.text('Financial Information', 20, 90);
  doc.setLineWidth(0.5);
  doc.line(20, 92, 190, 92);
  
  doc.setFontSize(10);
  doc.text(`Are reserves adequate? ${data.reservesAdequate ? 'Yes' : 'No'}`, 20, 100);
  doc.text(`Delinquency Rate: ${data.delinquencyRate}%`, 20, 107);
  doc.text(`Special Assessments: ${data.specialAssessments}`, 20, 114);
  
  // Insurance & Legal section
  doc.setFontSize(14);
  doc.text('Insurance & Legal Status', 20, 128);
  doc.setLineWidth(0.5);
  doc.line(20, 130, 190, 130);
  
  doc.setFontSize(10);
  doc.text(`Insurance Coverage: ${data.insuranceCoverage.join(', ')}`, 20, 138);
  doc.text(`Is there any pending litigation? ${data.pendingLitigation ? 'Yes' : 'No'}`, 20, 145);
  
  // Certification section
  doc.setFontSize(10);
  doc.text(`Completed By: ${data.completedBy}`, 20, 165);
  doc.text(`Date: ${data.completedDate}`, 20, 172);
  
  return doc;
};

/**
 * Generates an account statement PDF
 */
export const generateAccountStatement = (data: AccountStatementData): jsPDF => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('ACCOUNT STATEMENT', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // Owner information
  doc.setFontSize(10);
  doc.text(`Owner: ${data.ownerName}`, 20, 35);
  doc.text(`Property: ${data.propertyAddress}, Unit ${data.unitNumber}`, 20, 42);
  doc.text(`Association: ${data.associationName}`, 20, 49);
  doc.text(`Statement Date: ${data.statementDate}`, 20, 56);
  
  // Summary
  doc.setFontSize(12);
  doc.text('ACCOUNT SUMMARY', 20, 70);
  doc.setLineWidth(0.5);
  doc.line(20, 72, 190, 72);
  
  doc.setFontSize(10);
  doc.text(`Previous Balance: ${data.balanceForward}`, 20, 80);
  doc.text(`Current Charges: ${data.currentDues}`, 20, 87);
  
  // Payments
  doc.setFontSize(12);
  doc.text('PAYMENT HISTORY', 20, 100);
  doc.setLineWidth(0.5);
  doc.line(20, 102, 190, 102);
  
  // Payments table
  const paymentsBody = data.payments.map(p => [p.date, p.description, p.amount]);
  
  autoTable(doc, {
    head: [['Date', 'Description', 'Amount']],
    body: paymentsBody,
    startY: 105,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Charges table
  const chargesY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('CHARGES', 20, chargesY);
  doc.setLineWidth(0.5);
  doc.line(20, chargesY + 2, 190, chargesY + 2);
  
  const chargesBody = data.charges.map(c => [c.date, c.description, c.amount]);
  
  autoTable(doc, {
    head: [['Date', 'Description', 'Amount']],
    body: chargesBody,
    startY: chargesY + 5,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Total balance
  const totalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Balance Due: ${data.totalBalance}`, 130, totalY);
  
  // Add footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text('Please remit payment to the association office. Thank you.', 20, totalY + 20);
  
  return doc;
};

export default {
  generateReport,
  generateResaleCertificate,
  generateCondoQuestionnaire,
  generateAccountStatement
};
