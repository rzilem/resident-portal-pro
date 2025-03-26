
import { jsPDF } from 'jspdf';

export class PdfTextManager {
  static addTitle(
    doc: jsPDF, 
    text: string, 
    pageWidth: number,
    currentY: number,
    fontSize: number = 18
  ): number {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, pageWidth / 2, currentY, { align: 'center' });
    return currentY;
  }
  
  static addSubtitle(
    doc: jsPDF,
    text: string,
    marginLeft: number,
    currentY: number,
    fontSize: number = 14
  ): number {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, marginLeft, currentY);
    return currentY;
  }
  
  static addText(
    doc: jsPDF,
    text: string,
    marginLeft: number,
    currentY: number,
    fontSize: number = 10
  ): number {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(text, marginLeft, currentY);
    return currentY;
  }
}
