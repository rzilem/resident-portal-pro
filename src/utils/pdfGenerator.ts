
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF to include the autoTable function
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  propertyAddress: string;
  associationName: string;
  managementCompany: string;
  insuranceProvider: string;
  monthlyFee: string;
  numberOfUnits: string;
  amenities: string[];
  reserveFundBalance: string;
  specialAssessments: string;
  litigations: string;
  petRestrictions: string;
  rentalRestrictions: string;
}

export interface AccountStatementData {
  propertyAddress: string;
  ownerName: string;
  accountNumber: string;
  statementDate: string;
  dueDate: string;
  regularAssessment: string;
  specialAssessment: string;
  lateFees: string;
  otherFees: string;
  totalDue: string;
  paymentHistory: {
    date: string;
    amount: string;
    type: string;
  }[];
}

export interface ReportGenerationOptions {
  title: string;
  subtitle: string;
  date: string;
  columns: string[];
  data: (string | number)[][];
  summary?: Record<string, string>;
}

// Function to generate a generic report PDF
export const generateReport = (options: ReportGenerationOptions): jsPDF => {
  const doc = new jsPDF();
  const { title, subtitle, date, columns, data, summary } = options;

  // Add title
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });

  // Add subtitle
  doc.setFontSize(14);
  doc.text(subtitle, 105, 30, { align: 'center' });

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${date}`, 105, 40, { align: 'center' });

  // Create table
  doc.autoTable({
    head: [columns],
    body: data,
    startY: 50,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // Add summary if provided
  if (summary) {
    const summaryY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Summary', 14, summaryY);
    
    let currentY = summaryY + 10;
    Object.entries(summary).forEach(([key, value]) => {
      doc.setFontSize(10);
      doc.text(`${key}: ${value}`, 20, currentY);
      currentY += 6;
    });
  }

  return doc;
};

export const generateResaleCertificate = (data: ResaleCertificateData): jsPDF => {
  // Implementation for generating a resale certificate PDF
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Resale Certificate', 105, 20, { align: 'center' });
  
  // Add property information
  doc.setFontSize(14);
  doc.text('Property Information', 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 50);
  doc.text(`Unit Number: ${data.unitNumber}`, 20, 58);
  doc.text(`Association: ${data.associationName}`, 20, 66);
  doc.text(`Current Owner: ${data.ownerName}`, 20, 74);
  doc.text(`Purchaser: ${data.purchaserName}`, 20, 82);
  doc.text(`Closing Date: ${data.closingDate}`, 20, 90);
  
  // Add financial information
  doc.setFontSize(14);
  doc.text('Financial Information', 14, 110);
  
  doc.setFontSize(10);
  doc.text(`Monthly Assessment: ${data.assessmentAmount}`, 20, 120);
  doc.text(`Outstanding Dues: ${data.outstandingDues}`, 20, 128);
  doc.text(`Special Assessments: ${data.specialAssessments}`, 20, 136);
  
  // Add certification
  doc.setFontSize(14);
  doc.text('Certification', 14, 156);
  
  doc.setFontSize(10);
  doc.text(`Certified By: ${data.certifiedBy}`, 20, 166);
  doc.text(`Date: ${data.certificationDate}`, 20, 174);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('This certificate is valid for 30 days from the certification date.', 105, 280, { align: 'center' });
  
  return doc;
};

export const generateCondoQuestionnaire = (data: CondoQuestionnaireData): jsPDF => {
  // Implementation for generating a condo questionnaire PDF
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Condominium Questionnaire', 105, 20, { align: 'center' });
  
  // Add basic information
  doc.setFontSize(14);
  doc.text('Property Information', 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 50);
  doc.text(`Association Name: ${data.associationName}`, 20, 58);
  doc.text(`Management Company: ${data.managementCompany}`, 20, 66);
  doc.text(`Insurance Provider: ${data.insuranceProvider}`, 20, 74);
  doc.text(`Monthly Fee: ${data.monthlyFee}`, 20, 82);
  doc.text(`Number of Units: ${data.numberOfUnits}`, 20, 90);
  
  // Add financial information
  doc.setFontSize(14);
  doc.text('Financial & Legal Information', 14, 110);
  
  doc.setFontSize(10);
  doc.text(`Reserve Fund Balance: ${data.reserveFundBalance}`, 20, 120);
  doc.text(`Special Assessments: ${data.specialAssessments}`, 20, 128);
  doc.text(`Pending Litigations: ${data.litigations}`, 20, 136);
  
  // Add restrictions
  doc.setFontSize(14);
  doc.text('Restrictions', 14, 156);
  
  doc.setFontSize(10);
  doc.text(`Pet Restrictions: ${data.petRestrictions}`, 20, 166);
  doc.text(`Rental Restrictions: ${data.rentalRestrictions}`, 20, 174);
  
  // Add amenities
  doc.setFontSize(14);
  doc.text('Amenities', 14, 194);
  
  doc.setFontSize(10);
  data.amenities.forEach((amenity, index) => {
    doc.text(`• ${amenity}`, 20, 204 + (index * 8));
  });
  
  return doc;
};

export const generateAccountStatement = (data: AccountStatementData): jsPDF => {
  // Implementation for generating an account statement PDF
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Account Statement', 105, 20, { align: 'center' });
  
  // Add account information
  doc.setFontSize(14);
  doc.text('Account Information', 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 50);
  doc.text(`Owner Name: ${data.ownerName}`, 20, 58);
  doc.text(`Account Number: ${data.accountNumber}`, 20, 66);
  doc.text(`Statement Date: ${data.statementDate}`, 20, 74);
  doc.text(`Due Date: ${data.dueDate}`, 20, 82);
  
  // Add charges
  doc.setFontSize(14);
  doc.text('Current Charges', 14, 100);
  
  doc.setFontSize(10);
  doc.text(`Regular Assessment: ${data.regularAssessment}`, 20, 110);
  doc.text(`Special Assessment: ${data.specialAssessment}`, 20, 118);
  doc.text(`Late Fees: ${data.lateFees}`, 20, 126);
  doc.text(`Other Fees: ${data.otherFees}`, 20, 134);
  doc.text(`Total Due: ${data.totalDue}`, 20, 142);
  
  // Add payment history
  doc.setFontSize(14);
  doc.text('Payment History', 14, 160);
  
  // Create a payment history table
  const tableData = data.paymentHistory.map(payment => [
    payment.date,
    payment.type,
    payment.amount
  ]);
  
  doc.autoTable({
    head: [['Date', 'Type', 'Amount']],
    body: tableData,
    startY: 170,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
  });
  
  return doc;
};
