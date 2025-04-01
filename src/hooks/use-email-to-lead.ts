
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { LeadData } from '@/components/leads/types';

export const useEmailToLead = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processEmailAsLead = async (emailData: {
    from: string;
    subject: string;
    body: string;
    attachments?: any[];
    received_at?: string;
  }) => {
    setIsProcessing(true);
    
    try {
      // Extract potential lead information from email
      const name = extractNameFromEmail(emailData.from);
      const email = extractEmailFromEmail(emailData.from);
      
      // Check if the lead already exists
      const { data: existingLeads, error: checkError } = await supabase
        .from('leads')
        .select('id')
        .eq('email', email);
        
      if (checkError) throw checkError;
      
      if (existingLeads && existingLeads.length > 0) {
        // Update existing lead with new contact
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            lastcontactedat: new Date().toISOString(),
            lastcontacttype: 'email',
            updatedat: new Date().toISOString(),
            notes: appendToNotes(existingLeads[0].notes, emailData.subject, emailData.body)
          })
          .eq('id', existingLeads[0].id);
          
        if (updateError) throw updateError;
        
        // Handle attachments if any
        if (emailData.attachments && emailData.attachments.length > 0) {
          await processAttachments(emailData.attachments, existingLeads[0].id);
        }
        
        toast.success('Existing lead updated from email');
        setIsProcessing(false);
        return { updated: true, id: existingLeads[0].id };
      } else {
        // Create new lead
        const newLead = {
          name: name || 'Unknown',
          email: email,
          status: 'new',
          source: 'email',
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
          lastcontactedat: new Date().toISOString(),
          lastcontacttype: 'email',
          notes: `Email received: ${emailData.subject}\n\n${emailData.body}`
        };
        
        const { data: createdLead, error: createError } = await supabase
          .from('leads')
          .insert([newLead])
          .select();
          
        if (createError) throw createError;
        
        // Handle attachments if any
        if (emailData.attachments && emailData.attachments.length > 0 && createdLead && createdLead.length > 0) {
          await processAttachments(emailData.attachments, createdLead[0].id);
        }
        
        toast.success('New lead created from email');
        setIsProcessing(false);
        return { created: true, id: createdLead?.[0]?.id };
      }
    } catch (error) {
      console.error('Error processing email as lead:', error);
      toast.error('Failed to process email as lead');
      setIsProcessing(false);
      return { error: true };
    }
  };
  
  // Helper functions
  const extractNameFromEmail = (from: string): string => {
    // Extract name from format: "John Doe <john@example.com>"
    const match = from.match(/"?(.*?)"?\s*<.*>/);
    return match ? match[1].trim() : '';
  };
  
  const extractEmailFromEmail = (from: string): string => {
    // Extract email from format: "John Doe <john@example.com>"
    const match = from.match(/<([^>]+)>/) || from.match(/([^\s<]+@[^\s>]+)/);
    return match ? match[1].trim() : from;
  };
  
  const appendToNotes = (existingNotes: string = '', subject: string, body: string): string => {
    const dateStr = new Date().toLocaleString();
    const newNote = `\n\n--- Email received on ${dateStr} ---\nSubject: ${subject}\n\n${body}`;
    return existingNotes + newNote;
  };
  
  const processAttachments = async (attachments: any[], leadId: string) => {
    // Process attachments and link them to the lead
    // Simplified for this implementation
    const processedFiles = attachments.map(attachment => ({
      name: attachment.filename || 'Attachment',
      size: attachment.size || 0,
      type: attachment.contentType || 'application/octet-stream',
      path: `leads/${leadId}/${attachment.filename || Date.now()}`,
      url: attachment.url || '',
      uploadedAt: new Date().toISOString()
    }));
    
    await supabase
      .from('leads')
      .update({
        uploaded_files: processedFiles
      })
      .eq('id', leadId);
  };
  
  return {
    processEmailAsLead,
    isProcessing
  };
};
