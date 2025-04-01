import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Announcement } from '@/pages/communications/types';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['general', 'urgent', 'event', 'maintenance', 'meeting']),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().nullable().optional(),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
  onSave: (announcement: Announcement) => Promise<void>;
}

const AnnouncementDialog: React.FC<AnnouncementDialogProps> = ({
  open,
  onOpenChange,
  announcement,
  onSave,
}) => {
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'general',
      startDate: new Date(),
      endDate: null,
      isPinned: false,
      isPublished: true,
    },
  });

  useEffect(() => {
    if (announcement) {
      form.reset({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        startDate: new Date(announcement.startDate),
        endDate: announcement.endDate ? new Date(announcement.endDate) : null,
        isPinned: announcement.isPinned,
        isPublished: announcement.isPublished,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        type: 'general',
        startDate: new Date(),
        endDate: null,
        isPinned: false,
        isPublished: true,
      });
    }
  }, [announcement, form, open]);

  const onSubmit = async (values: AnnouncementFormValues) => {
    const savedAnnouncement: Announcement = {
      id: announcement?.id || '',
      title: values.title,
      content: values.content,
      type: values.type,
      startDate: values.startDate.toISOString().split('T')[0],
      endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : null,
      isPinned: values.isPinned,
      isPublished: values.isPublished,
      createdAt: announcement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(savedAnnouncement);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{announcement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
          <DialogDescription>
            {announcement
              ? 'Update your community announcement'
              : 'Create a new announcement for your community'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>No end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => 
                            date < (form.getValues().startDate || new Date())
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Announcement content..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pin Announcement</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Pinned announcements will be displayed at the top of the list
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish Immediately</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Published announcements will be visible to all community members
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {announcement ? 'Update Announcement' : 'Create Announcement'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
