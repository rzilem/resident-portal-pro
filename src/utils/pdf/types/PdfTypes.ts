
export interface PdfOptions {
  title?: string;
  filename?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  orientation?: 'portrait' | 'landscape';
  unit?: 'pt' | 'mm' | 'cm' | 'in';
  format?: 'a4' | 'letter' | 'legal' | [number, number];
  compress?: boolean;
  footer?: {
    text: string;
    fontSize?: number;
    color?: string;
  };
}

export interface PdfBase {
  save(): PdfBase;
  getBlob(): Blob;
  getBase64(): string;
  getPdfUrl(): string;
}
