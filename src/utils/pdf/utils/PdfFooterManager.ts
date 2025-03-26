
import { jsPDF } from 'jspdf';

export interface FooterOptions {
  text: string;
  fontSize?: number;
  color?: string;
}

export class PdfFooterManager {
  static addFooter(
    doc: jsPDF, 
    options: FooterOptions, 
    pageWidth: number, 
    pageHeight: number, 
    marginRight: number
  ): void {
    const { text, fontSize = 8, color = '#666666' } = options;
    
    const addFooterToPages = () => {
      const pageCount = doc.internal.pages.length - 1;
      
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(fontSize);
        doc.setTextColor(color);
        doc.text(
          text,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - marginRight,
          pageHeight - 10,
          { align: 'right' }
        );
      }
    };
    
    // Set up event handler for adding footer when document is complete
    doc.internal.events.subscribe('addPage', function() {
      addFooterToPages();
    });
    
    // Add footer to the first page
    addFooterToPages();
  }
}
