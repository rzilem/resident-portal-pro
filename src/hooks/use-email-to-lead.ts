
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
    console.log("Starting email-to-lead processing for:", emailData.from);
    
    try {
      // Extract potential lead information from email
      const name = extractNameFromEmail(emailData.from);
      const email = extractEmailFromEmail(emailData.from);
      
      console.log("Extracted name:", name, "and email:", email);
      
      if (!email) {
        console.error("Could not extract valid email address from:", emailData.from);
        setIsProcessing(false);
        return { error: "Invalid email format" };
      }
      
      // Check if the lead already exists
      console.log("Checking if lead exists with email:", email);
      const { data: existingLeads, error: checkError } = await supabase
        .from('leads')
        .select('id, notes')
        .eq('email', email);
        
      if (checkError) {
        console.error("Database error checking for existing lead:", checkError);
        throw checkError;
      }
      
      console.log("Existing leads check result:", existingLeads);
      
      if (existingLeads && existingLeads.length > 0) {
        // Update existing lead with new contact
        console.log("Updating existing lead:", existingLeads[0].id);
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            lastcontactedat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            notes: appendToNotes(existingLeads[0].notes || '', emailData.subject, emailData.body)
          })
          .eq('id', existingLeads[0].id);
          
        if (updateError) {
          console.error("Error updating existing lead:", updateError);
          throw updateError;
        }
        
        // Handle attachments if any
        if (emailData.attachments && emailData.attachments.length > 0) {
          await processAttachments(emailData.attachments, existingLeads[0].id);
        }
        
        console.log("Successfully updated existing lead");
        toast.success('Existing lead updated from email');
        setIsProcessing(false);
        return { updated: true, id: existingLeads[0].id };
      } else {
        // Create new lead
        console.log("Creating new lead for:", email);
        const newLead = {
          name: name || 'Unknown',
          email: email,
          status: 'new',
          source: 'email',
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
          lastcontactedat: new Date().toISOString(),
          notes: `Email received: ${emailData.subject}\n\n${emailData.body}`
        };
        
        console.log("New lead data:", newLead);
        const { data: createdLead, error: createError } = await supabase
          .from('leads')
          .insert([newLead])
          .select();
          
        if (createError) {
          console.error("Error creating new lead:", createError);
          throw createError;
        }
        
        console.log("New lead created with ID:", createdLead?.[0]?.id);
        
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
      return { error: error.message || "Unknown error" };
    }
  };
  
  // Helper functions
  const extractNameFromEmail = (from: string): string => {
    console.log("Extracting name from:", from);
    // Extract name from format: "John Doe <john@example.com>"
    const match = from.match(/"?(.*?)"?\s*<.*>/);
    const result = match ? match[1].trim() : '';
    console.log("Extracted name:", result);
    return result;
  };
  
  const extractEmailFromEmail = (from: string): string => {
    console.log("Extracting email from:", from);
    // Extract email from format: "John Doe <john@example.com>"
    const match = from.match(/<([^>]+)>/) || from.match(/([^\s<]+@[^\s>]+)/);
    const result = match ? match[1].trim() : from;
    console.log("Extracted email:", result);
    return result;
  };
  
  const appendToNotes = (existingNotes: string = '', subject: string, body: string): string => {
    const dateStr = new Date().toLocaleString();
    const newNote = `\n\n--- Email received on ${dateStr} ---\nSubject: ${subject}\n\n${body}`;
    return existingNotes + newNote;
  };
  
  const processAttachments = async (attachments: any[], leadId: string) => {
    console.log("Processing attachments for lead:", leadId);
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
      
    console.log("Attachments processed:", processedFiles.length);
  };
  
  return {
    processEmailAsLead,
    isProcessing
  };
};
