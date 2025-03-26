
import { jsPDF } from 'jspdf';

export class PdfElementManager {
  static addHorizontalLine(
    doc: jsPDF,
    marginLeft: number,
    marginRight: number,
    pageWidth: number,
    currentY: number
  ): number {
    doc.line(
      marginLeft,
      currentY,
      pageWidth - marginRight,
      currentY
    );
    return currentY;
  }
  
  static addLogo(
    doc: jsPDF,
    imgData: string,
    marginLeft: number,
    currentY: number,
    width: number = 40,
    height: number = 20
  ): number {
    doc.addImage(imgData, 'PNG', marginLeft, currentY, width, height);
    return currentY + height;
  }
  
  static addSignatureField(
    doc: jsPDF,
    label: string,
    marginLeft: number,
    currentY: number
  ): number {
    doc.setFontSize(10);
    doc.text(label, marginLeft, currentY);
    doc.line(marginLeft, currentY + 5, marginLeft + 60, currentY + 5);
    doc.text('Date: _____________', marginLeft + 80, currentY);
    return currentY;
  }
  
  static addTable(
    doc: jsPDF,
    headers: string[],
    data: any[][],
    marginLeft: number,
    marginRight: number,
    currentY: number
  ): number {
    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: data,
      margin: { left: marginLeft, right: marginRight },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    return (doc as any).lastAutoTable.finalY + 10;
  }
}
