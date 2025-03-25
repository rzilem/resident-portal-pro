
// This utility uses a CSV approach since it doesn't require additional dependencies
// For a full Excel export, you could add xlsx library

export function exportToExcel(data: any[], fileName: string = 'export') {
  // Filter the data to only include visible columns
  const processData = (dataArray: any[]) => {
    if (!dataArray.length) return '';
    
    // Get headers
    const headers = Object.keys(dataArray[0]);
    
    // Convert data to CSV format
    const csvRows = [];
    
    // Add headers row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of dataArray) {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Handle values that contain commas, quotes, or newlines
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  // Process the data
  const csvString = processData(data);
  
  // Create a Blob containing the data
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  
  // Create the URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Set the download attributes
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  // Append to the DOM
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
}
