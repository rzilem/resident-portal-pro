
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LetterTemplate } from '@/types/letter-templates';
import { ArrowLeft, Edit, Printer, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface LetterTemplatePreviewProps {
  template: LetterTemplate;
  onBack: () => void;
  onEdit: () => void;
  isReadOnly?: boolean;
}

const LetterTemplatePreview: React.FC<LetterTemplatePreviewProps> = ({
  template,
  onBack,
  onEdit,
  isReadOnly = false
}) => {
  // Function to handle printing
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Unable to open print window. Please check your browser settings.');
      return;
    }
    
    // Basic styling for the print window
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print: ${template.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .content {
            margin-bottom: 30px;
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              margin: 0.5in;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px;">
          <button onclick="window.print();">Print</button>
          <button onclick="window.close();">Close</button>
        </div>
        
        <div class="header">
          <h1>${template.name}</h1>
          <p>${template.description || ''}</p>
        </div>
        
        <div class="content">
          ${template.content}
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };
  
  // Function to export as PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(template.name, 20, 20);
      
      // Add description if present
      if (template.description) {
        doc.setFontSize(12);
        doc.text(template.description, 20, 30);
      }
      
      // Add category badge
      doc.setFontSize(10);
      doc.text(`Category: ${template.category}`, 20, 40);
      
      // Content - using html parser
      doc.html(
        `<div style="margin-top: 10px; font-size: 12px;">${template.content}</div>`,
        {
          x: 20,
          y: 50,
          callback: function() {
            // Save the PDF
            doc.save(`template-${template.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
            toast.success('PDF file downloaded');
          }
        }
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="px-2 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">{template.category}</Badge>
            
            {!isReadOnly && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
        <CardTitle>{template.name}</CardTitle>
        {template.description && (
          <p className="text-sm text-muted-foreground">{template.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="border p-6 rounded-md bg-white">
          <div 
            className="preview-content prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: template.content }} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportPDF}
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LetterTemplatePreview;
