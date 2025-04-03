
export * from './documentUtils';
export * from './fileUtils';
export * from './filterDocumentsByCategory';
export * from './filterDocumentsBySearch';
export * from './filterDocumentsByTags';
export * from './filterDocumentsByDate';

export const isPreviewableDocument = (fileType: string = '') => {
  return (
    fileType.startsWith('image/') || 
    fileType === 'application/pdf' ||
    fileType.startsWith('text/') ||
    fileType.includes('word') ||
    fileType.includes('sheet') ||
    fileType.includes('presentation')
  );
};

export const useGoogleDocsViewer = (fileType: string = '') => {
  return (
    fileType.includes('word') ||
    fileType.includes('sheet') ||
    fileType.includes('presentation') ||
    fileType === 'application/pdf'
  );
};
