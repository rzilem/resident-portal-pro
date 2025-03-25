
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  preview: string;
}

interface MessageTemplatesProps {
  onSelectTemplate: (template: MessageTemplate) => void;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'community-update',
    name: 'Community Update',
    description: 'General update for the community',
    subject: 'Community Update - [Date]',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://placehold.co/600x100/2563eb/ffffff?text=Oakridge+HOA" alt="Community Logo" style="max-width: 100%; height: auto; border-radius: 4px;">
        </div>
        <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px; text-align: center;">Community Update</h1>
        <p style="margin-bottom: 15px;">Dear Residents,</p>
        <p style="margin-bottom: 15px;">We hope this message finds you well. Here are some important updates about our community for the month of July:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h2 style="color: #4b5563; font-size: 18px; margin-bottom: 10px;">Recent Developments</h2>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 8px;">The pool area renovation has been completed. New hours are 8 AM - 9 PM daily.</li>
            <li style="margin-bottom: 8px;">Community garden plots are now available for reservation for the summer season.</li>
            <li style="margin-bottom: 8px;">New security cameras have been installed throughout the common areas.</li>
          </ul>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h2 style="color: #4b5563; font-size: 18px; margin-bottom: 10px;">Upcoming Events</h2>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 8px;"><strong>July 15, 6:30 PM</strong>: Board Meeting in the Community Center</li>
            <li style="margin-bottom: 8px;"><strong>July 22, 4:00 PM</strong>: Summer BBQ by the pool area</li>
            <li style="margin-bottom: 8px;"><strong>August 5, 9:00 AM</strong>: Community cleanup day</li>
          </ul>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h2 style="color: #4b5563; font-size: 18px; margin-bottom: 10px;">Reminders</h2>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 8px;">Please keep your yards maintained per community guidelines.</li>
            <li style="margin-bottom: 8px;">Quarterly HOA dues are due by the end of the month.</li>
            <li style="margin-bottom: 8px;">The guest parking policy has been updated. See attached document.</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 15px;">Thank you for your attention to these matters. If you have any questions, please don't hesitate to contact the management office.</p>
        
        <p style="margin-bottom: 5px;">Best regards,</p>
        <p style="font-weight: bold; margin-bottom: 0;">Oakridge HOA Board</p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
          <p style="margin-bottom: 5px;">Oakridge Homeowners Association</p>
          <p style="margin-bottom: 5px;">123 Oakridge Drive, Anytown, CA 90210</p>
          <p style="margin-bottom: 5px;">Phone: (555) 123-4567 | Email: info@oakridgehoa.com</p>
        </div>
      </div>
    `,
    preview: 'A general update template for notifying residents about community news and changes.'
  },
  {
    id: 'emergency-notice',
    name: 'Emergency Notice',
    description: 'Urgent information for residents',
    subject: 'IMPORTANT: Emergency Notice',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; border-radius: 8px;">
        <div style="background-color: #dc2626; color: white; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 4px;">
          <h1 style="font-size: 24px; margin: 0;">EMERGENCY NOTICE</h1>
        </div>
        
        <p style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">Dear Residents,</p>
        
        <p style="margin-bottom: 15px;">Please be advised of the following <strong>emergency situation</strong> affecting our community:</p>
        
        <div style="background-color: #fee2e2; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
          <p style="margin-bottom: 10px; font-weight: bold;">Water Main Break on Oak Street</p>
          <p style="margin-bottom: 0;">A water main has broken on Oak Street affecting properties between 100-200 Oak Street. Emergency repairs are underway. Water service is expected to be shut off in the affected area from 2:00 PM until approximately 8:00 PM today.</p>
        </div>
        
        <p style="margin-bottom: 15px; font-weight: bold;">Please follow these instructions:</p>
        
        <ol style="margin-bottom: 20px; padding-left: 20px;">
          <li style="margin-bottom: 10px;">Store enough water for drinking and basic needs until service is restored.</li>
          <li style="margin-bottom: 10px;">Avoid using water for non-essential purposes in the affected area.</li>
          <li style="margin-bottom: 10px;">Check on elderly neighbors or those with special needs who may require assistance.</li>
          <li style="margin-bottom: 0;">Report any flooding or other issues to the emergency maintenance line.</li>
        </ol>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin-bottom: 5px; font-weight: bold;">Important Contacts:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 5px;">Emergency Maintenance: (555) 911-4567</li>
            <li style="margin-bottom: 5px;">City Water Department: (555) 888-3456</li>
            <li style="margin-bottom: 0;">Property Management: (555) 123-4567</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 15px;">We will provide updates via email and our community app as more information becomes available.</p>
        
        <p style="margin-bottom: 5px;">Thank you for your cooperation during this emergency,</p>
        <p style="font-weight: bold; margin-bottom: 20px;">Community Management Team</p>
        
        <div style="background-color: #dc2626; color: white; padding: 10px; text-align: center; font-size: 14px; border-radius: 4px;">
          <p style="margin: 0;">This is an emergency communication. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    preview: 'For urgent communications about emergencies or critical situations.'
  },
  {
    id: 'maintenance-schedule',
    name: 'Maintenance Schedule',
    description: 'Upcoming maintenance information',
    subject: 'Scheduled Maintenance Notice',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://placehold.co/600x100/0891b2/ffffff?text=Maintenance+Notice" alt="Maintenance Logo" style="max-width: 100%; height: auto; border-radius: 4px;">
        </div>
        
        <h1 style="color: #0891b2; font-size: 24px; margin-bottom: 20px; text-align: center;">Scheduled Maintenance Notice</h1>
        
        <p style="margin-bottom: 15px;">Dear Residents,</p>
        
        <p style="margin-bottom: 15px;">Please be advised that we have scheduled maintenance as detailed below. We appreciate your patience and cooperation as we work to maintain and improve our community facilities.</p>
        
        <div style="margin-bottom: 20px; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
            <thead>
              <tr style="background-color: #0891b2; color: white;">
                <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Date</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Time</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Area</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">July 15, 2023</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">9:00 AM - 12:00 PM</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Building A Hallways</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Carpet cleaning - please use caution</td>
              </tr>
              <tr>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">July 16, 2023</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">10:00 AM - 2:00 PM</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Pool Area</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Pool closed for cleaning and maintenance</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">July 17, 2023</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">8:00 AM - 4:00 PM</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Parking Garage</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Pressure washing - please remove vehicles</td>
              </tr>
              <tr>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">July 18, 2023</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">1:00 PM - 3:00 PM</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Fitness Center</td>
                <td style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Equipment maintenance - limited access</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #10b981;">
          <p style="margin-bottom: 10px; font-weight: bold;">Important Notes:</p>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 5px;">Please ensure your personal items are removed from common areas being serviced.</li>
            <li style="margin-bottom: 5px;">All maintenance is weather permitting and may be rescheduled if necessary.</li>
            <li style="margin-bottom: 0;">Notifications will be posted in affected areas 24 hours in advance.</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 15px;">We apologize for any inconvenience this may cause. If you have any questions or special needs during these maintenance periods, please contact our maintenance department.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin-bottom: 5px; font-weight: bold;">Maintenance Contact:</p>
          <p style="margin-bottom: 0;">Email: maintenance@oakridgehoa.com | Phone: (555) 123-4567 ext. 2</p>
        </div>
        
        <p style="margin-bottom: 5px;">Thank you for your understanding,</p>
        <p style="font-weight: bold; margin-bottom: 0;">Maintenance Department</p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
          <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    preview: 'Inform residents about scheduled maintenance activities and potential service disruptions.'
  },
  {
    id: 'community-event',
    name: 'Community Event',
    description: 'Announcement for community gathering',
    subject: 'Upcoming Community Event: [Event Name]',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #faf5ff;">
        <div style="text-align: center; margin-bottom: 10px;">
          <img src="https://placehold.co/600x200/8b5cf6/ffffff?text=Summer+BBQ+Celebration" alt="Event Banner" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #8b5cf6; font-size: 28px; margin-bottom: 10px;">Summer BBQ Celebration!</h1>
          <p style="font-size: 18px; color: #6d28d9; margin: 0;">You're Invited!</p>
        </div>
        
        <p style="margin-bottom: 20px;">Dear Residents,</p>
        
        <p style="margin-bottom: 20px;">We're excited to announce our upcoming community summer event! Join us for food, games, and a chance to meet your neighbors at our annual Summer BBQ.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c4b5fd;">
          <div style="display: flex; margin-bottom: 15px;">
            <div style="width: 24px; margin-right: 10px; color: #8b5cf6;">📅</div>
            <div>
              <p style="font-weight: bold; margin: 0; color: #6d28d9;">Date:</p>
              <p style="margin: 0;">Saturday, July 15, 2023</p>
            </div>
          </div>
          
          <div style="display: flex; margin-bottom: 15px;">
            <div style="width: 24px; margin-right: 10px; color: #8b5cf6;">🕒</div>
            <div>
              <p style="font-weight: bold; margin: 0; color: #6d28d9;">Time:</p>
              <p style="margin: 0;">3:00 PM - 7:00 PM</p>
            </div>
          </div>
          
          <div style="display: flex; margin-bottom: 15px;">
            <div style="width: 24px; margin-right: 10px; color: #8b5cf6;">📍</div>
            <div>
              <p style="font-weight: bold; margin: 0; color: #6d28d9;">Location:</p>
              <p style="margin: 0;">Community Pool & Courtyard</p>
            </div>
          </div>
          
          <div style="display: flex;">
            <div style="width: 24px; margin-right: 10px; color: #8b5cf6;">🎟️</div>
            <div>
              <p style="font-weight: bold; margin: 0; color: #6d28d9;">RSVP:</p>
              <p style="margin: 0;">By July 10th via the community portal or call (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c4b5fd;">
          <h2 style="color: #8b5cf6; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Event Highlights</h2>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 8px;"><strong>Delicious BBQ</strong> - Burgers, hot dogs, and vegetarian options</li>
            <li style="margin-bottom: 8px;"><strong>Pool Games</strong> - For children and adults</li>
            <li style="margin-bottom: 8px;"><strong>Live Music</strong> - Local band performance from 4-6 PM</li>
            <li style="margin-bottom: 8px;"><strong>Raffle Prizes</strong> - Win gift cards and community perks</li>
            <li style="margin-bottom: 0;"><strong>Kids' Zone</strong> - Face painting and games</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 15px;">This is a family-friendly event. Each household may bring up to 2 guests. Please bring your own chairs or blankets for seating.</p>
        
        <div style="background-color: #ede9fe; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <p style="font-weight: bold; margin-bottom: 10px; color: #6d28d9;">We need volunteers!</p>
          <p style="margin-bottom: 10px;">If you'd like to help with setup, cooking, or cleanup, please indicate when you RSVP.</p>
          <a href="#" style="background-color: #8b5cf6; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">Volunteer Sign-up</a>
        </div>
        
        <p style="margin-bottom: 5px;">We look forward to seeing you there!</p>
        <p style="font-weight: bold; margin-bottom: 20px;">The Social Committee</p>
        
        <div style="margin-top: 10px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
          <p style="margin: 0;">This event is for Oakridge community residents and their guests only.</p>
        </div>
      </div>
    `,
    preview: 'Announce and provide details about upcoming community events, gatherings or celebrations.'
  },
  {
    id: 'welcome-new-resident',
    name: 'Welcome New Resident',
    description: 'Welcome message for new community members',
    subject: 'Welcome to Our Community!',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://placehold.co/600x150/059669/ffffff?text=Welcome+to+Oakridge" alt="Welcome Banner" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
        
        <h1 style="color: #059669; font-size: 24px; margin-bottom: 20px; text-align: center;">Welcome to Our Community!</h1>
        
        <p style="margin-bottom: 15px;">Dear [New Resident Name],</p>
        
        <p style="margin-bottom: 15px;">On behalf of all residents and the management team, we'd like to extend a warm welcome to the Oakridge community! We're delighted that you've chosen to make your home here.</p>
        
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #6ee7b7;">
          <h2 style="color: #059669; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Important Information</h2>
          
          <div style="margin-bottom: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px; color: #059669;">Community Office:</p>
            <p style="margin: 0;">Located at the Clubhouse, 123 Oakridge Drive</p>
            <p style="margin: 0;">Hours: Monday-Friday, 9:00 AM - 5:00 PM</p>
            <p style="margin: 0;">Phone: (555) 123-4567</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px; color: #059669;">Maintenance Requests:</p>
            <p style="margin: 0;">Submit through the resident portal at www.oakridgehoa.com</p>
            <p style="margin: 0;">Emergency maintenance: (555) 987-6543</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px; color: #059669;">Amenities:</p>
            <ul style="padding-left: 20px; margin: 0;">
              <li>Swimming Pool (6:00 AM - 10:00 PM)</li>
              <li>Fitness Center (24/7 Access with Key Fob)</li>
              <li>Tennis Courts (7:00 AM - 9:00 PM)</li>
              <li>Clubhouse (Available for Reservation)</li>
              <li>Dog Park (Dawn to Dusk)</li>
            </ul>
          </div>
          
          <div>
            <p style="font-weight: bold; margin-bottom: 5px; color: #059669;">Community Website:</p>
            <p style="margin: 0;">www.oakridgehoa.com - Use access code WELCOME23 to register</p>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #374151; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Your Move-In Checklist</h2>
          
          <div style="display: flex; margin-bottom: 10px;">
            <div style="min-width: 24px; height: 24px; background-color: #d1fae5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: #059669;">✓</span>
            </div>
            <div>Register on the community website</div>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <div style="min-width: 24px; height: 24px; background-color: #d1fae5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: #059669;">✓</span>
            </div>
            <div>Set up utilities (if not already done)</div>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <div style="min-width: 24px; height: 24px; background-color: #d1fae5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: #059669;">✓</span>
            </div>
            <div>Program your gate remote and key fob</div>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <div style="min-width: 24px; height: 24px; background-color: #d1fae5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: #059669;">✓</span>
            </div>
            <div>Review community rules and regulations</div>
          </div>
          
          <div style="display: flex;">
            <div style="min-width: 24px; height: 24px; background-color: #d1fae5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: #059669;">✓</span>
            </div>
            <div>Sign up for community events and newsletters</div>
          </div>
        </div>
        
        <p style="margin-bottom: 15px;">We've attached our community handbook which contains additional important information including architectural guidelines, parking rules, and trash collection schedule.</p>
        
        <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px dashed #059669;">
          <p style="font-weight: bold; margin-bottom: 10px; color: #059669;">Join us for New Resident Orientation!</p>
          <p style="margin-bottom: 0;">Saturday, August 5th at 10:00 AM in the Clubhouse</p>
        </div>
        
        <p style="margin-bottom: 15px;">If you have any questions, please don't hesitate to contact us at welcome@oakridgehoa.com or stop by the office during business hours.</p>
        
        <p style="margin-bottom: 5px;">We're delighted to have you join our community and look forward to meeting you!</p>
        
        <p style="margin-bottom: 5px;">Warm regards,</p>
        <p style="font-weight: bold; margin-bottom: 0;">The Oakridge Community Team</p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
          <p style="margin-bottom: 5px;">Oakridge Homeowners Association</p>
          <p style="margin-bottom: 5px;">123 Oakridge Drive, Anytown, CA 90210</p>
          <p style="margin: 0;">Phone: (555) 123-4567 | Email: info@oakridgehoa.com</p>
        </div>
      </div>
    `,
    preview: 'A friendly welcome message for new residents joining the community.'
  }
];

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ onSelectTemplate }) => {
  const { toast } = useToast();

  const handleUseTemplate = (template: MessageTemplate) => {
    onSelectTemplate(template);
    toast({
      title: "Template selected",
      description: `"${template.name}" template has been loaded into the editor.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Message Templates</h3>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-muted/30">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                <p className="line-clamp-3">{template.preview}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleUseTemplate(template)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageTemplates;
