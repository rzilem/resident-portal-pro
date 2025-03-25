
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmergencyContact } from '@/types/user';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Edit, Plus, Save, Trash2, UserRound } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmergencyContactsFormProps {
  contacts: EmergencyContact[];
  updateContacts: (contacts: EmergencyContact[]) => void;
}

const EmergencyContactsForm = ({ contacts, updateContacts }: EmergencyContactsFormProps) => {
  const [contactsList, setContactsList] = useState<EmergencyContact[]>(contacts);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const addContact = () => {
    setEditingContact({
      id: uuidv4(),
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      isAuthorized: false
    });
    setIsDialogOpen(true);
  };
  
  const editContact = (contact: EmergencyContact) => {
    setEditingContact({ ...contact });
    setIsDialogOpen(true);
  };
  
  const deleteContact = (id: string) => {
    const updatedContacts = contactsList.filter(contact => contact.id !== id);
    setContactsList(updatedContacts);
    updateContacts(updatedContacts);
  };
  
  const handleSaveContact = () => {
    if (!editingContact) return;
    
    const isValid = 
      editingContact.name.trim() !== '' && 
      editingContact.relationship.trim() !== '' && 
      editingContact.phoneNumber.trim() !== '';
    
    if (!isValid) return;
    
    const updatedContacts = editingContact.id && contactsList.some(c => c.id === editingContact.id)
      ? contactsList.map(c => (c.id === editingContact.id ? editingContact : c))
      : [...contactsList, editingContact];
    
    setContactsList(updatedContacts);
    updateContacts(updatedContacts);
    setIsDialogOpen(false);
  };
  
  const handleInputChange = (field: keyof EmergencyContact, value: string | boolean) => {
    if (!editingContact) return;
    setEditingContact({
      ...editingContact,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Emergency Contacts</CardTitle>
          <Button onClick={addContact} variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
        </CardHeader>
        <CardContent>
          {contactsList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Authorized</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactsList.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.relationship}</TableCell>
                    <TableCell>{contact.phoneNumber}</TableCell>
                    <TableCell>{contact.email || '-'}</TableCell>
                    <TableCell>
                      {contact.isAuthorized ? 
                        <span className="text-green-600 text-sm">Yes</span> : 
                        <span className="text-slate-500 text-sm">No</span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editContact(contact)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <UserRound className="h-10 w-10 mb-2" />
              <p>No emergency contacts added yet</p>
              <p className="text-sm">Add contacts that should be notified in case of an emergency</p>
              <Button onClick={addContact} variant="outline" className="mt-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Emergency Contact</span>
              </Button>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Authorized contacts</p>
              <p className="text-amber-700">
                Authorized contacts can make decisions on your behalf in case of emergency, 
                such as approving urgent maintenance or medical decisions.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="default" 
            onClick={() => updateContacts(contactsList)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Contacts
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact && contactsList.some(c => c.id === editingContact.id) 
                ? "Edit Emergency Contact" 
                : "Add Emergency Contact"
              }
            </DialogTitle>
            <DialogDescription>
              Add details of a person who should be contacted in case of emergency.
            </DialogDescription>
          </DialogHeader>
          
          {editingContact && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editingContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={editingContact.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  placeholder="Spouse, Parent, Child, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editingContact.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  value={editingContact.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="authorized"
                  checked={editingContact.isAuthorized || false}
                  onCheckedChange={(checked) => handleInputChange('isAuthorized', checked)}
                />
                <Label htmlFor="authorized">
                  Authorized to make decisions on my behalf
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSaveContact}
            >
              Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyContactsForm;
