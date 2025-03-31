
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import JournalEntryList from '@/components/accounting/journal/JournalEntryList';
import JournalEntryForm from '@/components/accounting/journal/JournalEntryForm';

const JournalEntries = () => {
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const handleEditEntry = (entry: any) => {
    setSelectedEntry(entry);
    setIsCreating(true);
  };
  
  const handleCreateNew = () => {
    setSelectedEntry(null);
    setIsCreating(true);
  };
  
  const handleFormComplete = () => {
    setIsCreating(false);
    setSelectedEntry(null);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Journal Entries</h1>
        
        <TooltipButton
          onClick={handleCreateNew}
          tooltipText="Create new journal entry"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Journal Entry
        </TooltipButton>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {isCreating ? (selectedEntry ? 'Edit Journal Entry' : 'Create Journal Entry') : 'Journal Entry List'}
          </CardTitle>
          <CardDescription>
            {isCreating
              ? 'Fill in the form to create a new journal entry'
              : 'View and manage general ledger journal entries'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCreating ? (
            <JournalEntryForm entry={selectedEntry} onComplete={handleFormComplete} />
          ) : (
            <JournalEntryList onEditEntry={handleEditEntry} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalEntries;
