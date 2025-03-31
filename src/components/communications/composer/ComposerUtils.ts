
export const appendToContent = (
  currentContent: string,
  textToAppend: string
): string => {
  // If the content is HTML formatted, ensure proper insertion
  if (currentContent.includes('</') && currentContent.includes('<')) {
    // Find the closing body tag or use the end of the content
    const bodyEndIndex = currentContent.lastIndexOf('</body>');
    if (bodyEndIndex > -1) {
      return (
        currentContent.substring(0, bodyEndIndex) +
        textToAppend +
        currentContent.substring(bodyEndIndex)
      );
    }
  }
  
  // For plain content, just append
  return currentContent + textToAppend;
};

export const isHtmlContent = (content: string): boolean => {
  return (
    content.includes('<') && 
    content.includes('>') && 
    (content.includes('</') || content.includes('/>'))
  );
};

export const convertTextToHtml = (plainText: string): string => {
  return `<p>${plainText.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
};

export const stripHtmlTags = (htmlContent: string): string => {
  return htmlContent.replace(/<[^>]*>/g, '');
};

export const getSubjectPrefix = (type: string): string => {
  switch (type) {
    case 'emergency':
      return '🚨 EMERGENCY: ';
    case 'announcement':
      return '📢 ANNOUNCEMENT: ';
    case 'meeting':
      return '📅 MEETING: ';
    case 'maintenance':
      return '🔧 MAINTENANCE: ';
    case 'reminder':
      return '⏰ REMINDER: ';
    default:
      return '';
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const getRecipientSummary = (recipients: string[]): string => {
  if (recipients.length === 0) return 'No recipients selected';
  if (recipients.length === 1) return recipients[0];
  return `${recipients[0]} and ${recipients.length - 1} more`;
};

// Function to filter templates by community
export const filterTemplatesByCommunity = (templates: any[], communityId?: string) => {
  if (!communityId) return templates;
  
  return templates.filter(template => {
    // If template has no communities specified, or specifies 'all', include it
    if (!template.communities || template.communities.includes('all')) {
      return true;
    }
    
    // Include if this community is in the template's communities
    return template.communities.includes(communityId);
  });
};
