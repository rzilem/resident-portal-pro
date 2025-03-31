
import { jsPDF } from 'jspdf';

// Type definitions
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
  insuranceInfo: string;
  reserves: string;
  specialAssessments: string;
  litigation: string;
  occupancyRestrictions: string;
  petRestrictions: string;
  parkingInfo: string;
  completedBy: string;
  completionDate: string;
}

export interface AccountStatementData {
  propertyAddress: string;
  ownerName: string;
  statementDate: string;
  statementPeriod: string;
  balanceForward: string;
  currentCharges: string;
  payments: string;
  currentBalance: string;
  dueDate: string;
  lineItems: Array<{
    date: string;
    description: string;
    amount: string;
    balance: string;
  }>;
}

// PDF generation functions
export const generateResaleCertificate = (data: ResaleCertificateData): jsPDF => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.text('Resale Certificate', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`${data.associationName}`, 105, 30, { align: 'center' });
  
  // Add property information
  doc.setFontSize(14);
  doc.text('Property Information', 20, 50);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 60);
  doc.text(`Unit Number: ${data.unitNumber}`, 20, 65);
  doc.text(`Current Owner: ${data.ownerName}`, 20, 70);
  doc.text(`Purchaser: ${data.purchaserName}`, 20, 75);
  doc.text(`Closing Date: ${data.closingDate}`, 20, 80);
  
  // Add financial information
  doc.setFontSize(14);
  doc.text('Financial Information', 20, 95);
  
  doc.setFontSize(10);
  doc.text(`Monthly Assessment: ${data.assessmentAmount}`, 20, 105);
  doc.text(`Outstanding Dues: ${data.outstandingDues}`, 20, 110);
  doc.text(`Special Assessments: ${data.specialAssessments}`, 20, 115);
  
  // Add certification
  doc.setFontSize(14);
  doc.text('Certification', 20, 130);
  
  doc.setFontSize(10);
  doc.text(`Certified by: ${data.certifiedBy}`, 20, 140);
  doc.text(`Date: ${data.certificationDate}`, 20, 145);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('This certificate is valid for 30 days from the certification date.', 20, 270);
  doc.text('For questions, please contact the association office.', 20, 275);
  
  return doc;
};

export const generateCondoQuestionnaire = (data: CondoQuestionnaireData): jsPDF => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.text('Condominium Questionnaire', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`${data.associationName}`, 105, 30, { align: 'center' });
  
  // Add property information
  doc.setFontSize(14);
  doc.text('Property Information', 20, 50);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 60);
  doc.text(`Association Name: ${data.associationName}`, 20, 65);
  doc.text(`Management Company: ${data.managementCompany}`, 20, 70);
  
  // Add questionnaire items
  doc.setFontSize(14);
  doc.text('Association Information', 20, 85);
  
  doc.setFontSize(10);
  doc.text(`Insurance Information: ${data.insuranceInfo}`, 20, 95);
  doc.text(`Reserve Fund Status: ${data.reserves}`, 20, 100);
  doc.text(`Special Assessments: ${data.specialAssessments}`, 20, 105);
  doc.text(`Litigation: ${data.litigation}`, 20, 110);
  doc.text(`Occupancy Restrictions: ${data.occupancyRestrictions}`, 20, 115);
  doc.text(`Pet Restrictions: ${data.petRestrictions}`, 20, 120);
  doc.text(`Parking Information: ${data.parkingInfo}`, 20, 125);
  
  // Add certification
  doc.setFontSize(14);
  doc.text('Certification', 20, 140);
  
  doc.setFontSize(10);
  doc.text(`Completed by: ${data.completedBy}`, 20, 150);
  doc.text(`Date: ${data.completionDate}`, 20, 155);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('This questionnaire is valid for 30 days from the completion date.', 20, 270);
  doc.text('For questions, please contact the association office.', 20, 275);
  
  return doc;
};

export const generateAccountStatement = (data: AccountStatementData): jsPDF => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.text('Account Statement', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Statement Date: ${data.statementDate}`, 20, 30);
  doc.text(`Statement Period: ${data.statementPeriod}`, 20, 35);
  
  // Add account information
  doc.setFontSize(14);
  doc.text('Account Information', 20, 50);
  
  doc.setFontSize(10);
  doc.text(`Property Address: ${data.propertyAddress}`, 20, 60);
  doc.text(`Owner: ${data.ownerName}`, 20, 65);
  
  // Add summary
  doc.setFontSize(14);
  doc.text('Summary', 20, 80);
  
  doc.setFontSize(10);
  doc.text(`Balance Forward: ${data.balanceForward}`, 20, 90);
  doc.text(`Current Charges: ${data.currentCharges}`, 20, 95);
  doc.text(`Payments: ${data.payments}`, 20, 100);
  doc.text(`Current Balance: ${data.currentBalance}`, 20, 105);
  doc.text(`Due Date: ${data.dueDate}`, 20, 110);
  
  // Add line items
  doc.setFontSize(14);
  doc.text('Transaction History', 20, 125);
  
  // Add table headers
  doc.setFontSize(10);
  doc.text('Date', 20, 135);
  doc.text('Description', 55, 135);
  doc.text('Amount', 150, 135);
  doc.text('Balance', 180, 135);
  
  // Draw line under headers
  doc.line(20, 137, 190, 137);
  
  // Add line items
  let y = 145;
  for (const item of data.lineItems) {
    doc.text(item.date, 20, y);
    doc.text(item.description, 55, y);
    doc.text(item.amount, 150, y);
    doc.text(item.balance, 180, y);
    y += 7;
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Please remit payment by the due date to avoid late fees.', 20, 270);
  doc.text('For questions, please contact the association office.', 20, 275);
  
  return doc;
};
