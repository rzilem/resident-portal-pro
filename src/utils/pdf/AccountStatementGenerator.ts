
import { PDFGeneratorCore } from './PDFGeneratorCore';

export interface AccountStatementData {
  ownerName?: string;
  propertyAddress?: string;
  accountNumber?: string;
  statementDate?: string;
  previousBalance?: string;
  payments?: string;
  newCharges?: string;
  currentBalance?: string;
  transactions?: any[][];
}

export class AccountStatementGenerator extends PDFGeneratorCore {
  static create(data: AccountStatementData) {
    const pdf = new PDFGeneratorCore({
      title: 'Account Statement',
      filename: 'account-statement.pdf',
      subject: 'HOA Account Statement'
    });
    
    pdf.addTitle('ACCOUNT STATEMENT')
      .addLineBreak()
      .addSubtitle('ACCOUNT INFORMATION')
      .addText(`Owner: ${data.ownerName || 'N/A'}`)
      .addText(`Property Address: ${data.propertyAddress || 'N/A'}`)
      .addText(`Account Number: ${data.accountNumber || 'N/A'}`)
      .addText(`Statement Date: ${data.statementDate || 'N/A'}`)
      .addLineBreak()
      .addSubtitle('ACCOUNT SUMMARY')
      .addText(`Previous Balance: $${data.previousBalance || '0.00'}`)
      .addText(`Payments: $${data.payments || '0.00'}`)
      .addText(`New Charges: $${data.newCharges || '0.00'}`)
      .addText(`Current Balance: $${data.currentBalance || '0.00'}`)
      .addLineBreak()
      .addSubtitle('TRANSACTION HISTORY')
      .addTable(
        ['Date', 'Description', 'Amount', 'Balance'],
        data.transactions || []
      );
    
    return pdf;
  }
}
