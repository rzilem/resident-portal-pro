
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/lead';

interface EmailData {
  from: string;
  subject: string;
  body: string;
  attachments?: any[];
  received_at?: string;
}

export const useEmailToLead = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  const processEmailAsLead = async (emailData: EmailData) => {
    setIsProcessing(true);
    setProcessingError(null);
    console.log("Starting email-to-lead processing for:", emailData.from);
    
    try {
      // Extract potential lead information from email
      const name = extractNameFromEmail(emailData.from);
      const email = extractEmailFromEmail(emailData.from);
      
      console.log("Extracted name:", name, "and email:", email);
      
      if (!email) {
        const error = "Could not extract valid email address from: " + emailData.from;
        console.error(error);
        setProcessingError(error);
        setIsProcessing(false);
        return { error };
      }
      
      // Check if the lead already exists
      console.log("Checking if lead exists with email:", email);
      const { data: existingLeads, error: checkError } = await supabase
        .from('leads')
        .select('id, notes, tags, lastcontactedat')
        .eq('email', email);
        
      if (checkError) {
        console.error("Database error checking for existing lead:", checkError);
        setProcessingError(checkError.message);
        throw checkError;
      }
      
      console.log("Existing leads check result:", existingLeads);
      
      if (existingLeads && existingLeads.length > 0) {
        // Update existing lead with new contact
        console.log("Updating existing lead:", existingLeads[0].id);
        
        // Merge existing tags with new ones extracted from email
        const existingTags = existingLeads[0].tags || [];
        const newTags = [...existingTags, ...extractTagsFromEmail(emailData.subject, emailData.body)];
        const uniqueTags = [...new Set(newTags)]; // Remove duplicates
        
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            lastcontactedat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            notes: appendToNotes(existingLeads[0].notes || '', emailData.subject, emailData.body),
            tags: uniqueTags
          })
          .eq('id', existingLeads[0].id);
          
        if (updateError) {
          console.error("Error updating existing lead:", updateError);
          setProcessingError(updateError.message);
          throw updateError;
        }
        
        // Handle attachments if any
        if (emailData.attachments && emailData.attachments.length > 0) {
          await processAttachments(emailData.attachments, existingLeads[0].id);
        }
        
        // Log the interaction for lead status workflow
        await logLeadInteraction(existingLeads[0].id, 'email_received', {
          subject: emailData.subject,
          timestamp: new Date().toISOString()
        });
        
        console.log("Successfully updated existing lead");
        toast.success('Existing lead updated from email');
        setIsProcessing(false);
        return { updated: true, id: existingLeads[0].id };
      } else {
        // Create new lead
        console.log("Creating new lead for:", email);
        
        // Extract potential organization info and contact details
        const companyName = extractCompanyFromEmail(emailData.from, emailData.body);
        const phoneNumber = extractPhoneFromEmailBody(emailData.body);
        const tags = extractTagsFromEmail(emailData.subject, emailData.body);
        
        const newLead = {
          name: name || 'Unknown',
          email: email,
          company: companyName || undefined,
          phone: phoneNumber || undefined,
          status: 'new',
          source: 'email',
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
          lastcontactedat: new Date().toISOString(),
          notes: `Email received: ${emailData.subject}\n\n${emailData.body}`,
          tags: tags.length > 0 ? tags : undefined
        };
        
        console.log("New lead data:", newLead);
        const { data: createdLead, error: createError } = await supabase
          .from('leads')
          .insert([newLead])
          .select();
          
        if (createError) {
          console.error("Error creating new lead:", createError);
          setProcessingError(createError.message);
          throw createError;
        }
        
        console.log("New lead created with ID:", createdLead?.[0]?.id);
        
        // Handle attachments if any
        if (emailData.attachments && emailData.attachments.length > 0 && createdLead && createdLead.length > 0) {
          await processAttachments(emailData.attachments, createdLead[0].id);
        }
        
        // Log the interaction for lead status workflow
        if (createdLead && createdLead.length > 0) {
          await logLeadInteraction(createdLead[0].id, 'lead_created', {
            source: 'email',
            timestamp: new Date().toISOString()
          });
        }
        
        toast.success('New lead created from email!');
        setIsProcessing(false);
        return { created: true, id: createdLead?.[0]?.id };
      }
    } catch (error) {
      console.error('Error processing email as lead:', error);
      setProcessingError(error.message || "Unknown error");
      toast.error('Failed to process email as lead');
      setIsProcessing(false);
      return { error: error.message || "Unknown error" };
    }
  };
  
  // Helper functions
  const extractNameFromEmail = (from: string): string => {
    console.log("Extracting name from:", from);
    // Pattern for "Name <email@example.com>"
    let match = from.match(/"?(.*?)"?\s*<.*>/);
    if (match) {
      return match[1].trim();
    }
    
    // Pattern for name.surname@example.com
    match = from.match(/^([^@.]+)\.([^@.]+)@/);
    if (match) {
      return `${capitalizeFirstLetter(match[1])} ${capitalizeFirstLetter(match[2])}`;
    }
    
    // Pattern for namesurname@example.com - try to intelligently split
    match = from.match(/^([a-zA-Z]+)([A-Z][a-z]+)@/);
    if (match) {
      return `${capitalizeFirstLetter(match[1])} ${match[2]}`;
    }
    
    return '';
  };
  
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  const extractEmailFromEmail = (from: string): string => {
    console.log("Extracting email from:", from);
    // Extract email from format: "John Doe <john@example.com>"
    const match = from.match(/<([^>]+)>/) || from.match(/([^\s<]+@[^\s>]+)/);
    const result = match ? match[1].trim() : from;
    console.log("Extracted email:", result);
    return result;
  };
  
  const extractCompanyFromEmail = (from: string, body: string): string | null => {
    // Try to extract from email domain first
    const emailDomain = from.match(/@([^>]+)/) || from.match(/@([^\s]+)/);
    if (emailDomain) {
      const domain = emailDomain[1].split('.')[0];
      if (domain && !['gmail', 'yahoo', 'hotmail', 'outlook', 'aol', 'icloud'].includes(domain)) {
        return capitalizeFirstLetter(domain);
      }
    }
    
    // Try to extract company name from signature in email body
    const companyPatterns = [
      /Company:\s*([A-Za-z0-9\s&\.,]+)/i,
      /Organization:\s*([A-Za-z0-9\s&\.,]+)/i,
      /(?:^|\n)([A-Za-z0-9\s&\.,]+)(?:\n|$)/
    ];
    
    for (const pattern of companyPatterns) {
      const match = body.match(pattern);
      if (match && match[1].trim().length > 0 && match[1].trim().length < 50) {
        return match[1].trim();
      }
    }
    
    return null;
  };
  
  const extractPhoneFromEmailBody = (body: string): string | null => {
    // Match common phone number formats
    const phonePatterns = [
      /(?:Phone|Tel|Mobile):\s*(\+?[0-9\s\(\)\.\-]{10,20})/i,
      /(\+?[0-9]{1,3}[\s\.\-]?\(?\d{3}\)?[\s\.\-]?\d{3}[\s\.\-]?\d{4})/
    ];
    
    for (const pattern of phonePatterns) {
      const match = body.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    return null;
  };
  
  const extractTagsFromEmail = (subject: string, body: string): string[] => {
    const tags: string[] = [];
    
    // Add tag based on subject
    if (subject.toLowerCase().includes('inquiry') || subject.toLowerCase().includes('enquiry')) {
      tags.push('inquiry');
    }
    if (subject.toLowerCase().includes('quote') || subject.toLowerCase().includes('pricing')) {
      tags.push('pricing');
    }
    if (subject.toLowerCase().includes('urgent') || subject.toLowerCase().includes('asap')) {
      tags.push('urgent');
    }
    
    // Extract hashtags from body
    const hashtagMatches = body.match(/#([a-zA-Z0-9_]+)/g);
    if (hashtagMatches) {
      hashtagMatches.forEach(tag => {
        tags.push(tag.substring(1).toLowerCase());
      });
    }
    
    return [...new Set(tags)]; // Remove duplicates
  };
  
  const appendToNotes = (existingNotes: string = '', subject: string, body: string): string => {
    const dateStr = new Date().toLocaleString();
    const newNote = `\n\n--- Email received on ${dateStr} ---\nSubject: ${subject}\n\n${body}`;
    return existingNotes + newNote;
  };
  
  const processAttachments = async (attachments: any[], leadId: string) => {
    console.log("Processing attachments for lead:", leadId);
    
    try {
      // Process attachments and link them to the lead
      const processedFiles = await Promise.all(attachments.map(async (attachment) => {
        const fileName = attachment.filename || `Attachment_${Date.now()}`;
        const fileType = attachment.contentType || 'application/octet-stream';
        const filePath = `leads/${leadId}/${fileName}`;
        
        // If we have the file data, upload it to storage
        if (attachment.content) {
          try {
            const { data, error } = await supabase.storage
              .from('lead_attachments')
              .upload(filePath, attachment.content, {
                contentType: fileType,
                upsert: true
              });
            
            if (error) {
              console.error("Error uploading attachment:", error);
              return null;
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('lead_attachments')
              .getPublicUrl(filePath);
              
            return {
              name: fileName,
              size: attachment.size || 0,
              type: fileType,
              path: filePath,
              url: urlData.publicUrl,
              uploadedAt: new Date().toISOString()
            };
          } catch (e) {
            console.error("Error in attachment processing:", e);
            return null;
          }
        } else {
          // If we only have attachment metadata
          return {
            name: fileName,
            size: attachment.size || 0,
            type: fileType,
            path: filePath,
            url: attachment.url || '',
            uploadedAt: new Date().toISOString()
          };
        }
      }));
      
      // Filter out null values (failed uploads)
      const validFiles = processedFiles.filter(file => file !== null);
      
      if (validFiles.length > 0) {
        await supabase
          .from('leads')
          .update({
            uploaded_files: validFiles
          })
          .eq('id', leadId);
      }
        
      console.log("Attachments processed:", validFiles.length);
      return validFiles;
    } catch (error) {
      console.error("Error processing attachments:", error);
      return [];
    }
  };
  
  const logLeadInteraction = async (leadId: string, interactionType: string, metadata: any) => {
    try {
      const { error } = await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: leadId,
          interaction_type: interactionType,
          metadata,
          created_at: new Date().toISOString()
        }]);
        
      if (error) {
        console.error("Error logging lead interaction:", error);
      }
    } catch (error) {
      console.error("Error in logLeadInteraction:", error);
    }
  };
  
  return {
    processEmailAsLead,
    isProcessing,
    processingError
  };
};
