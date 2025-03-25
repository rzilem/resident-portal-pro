
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JournalEntryList from '@/components/accounting/journal/JournalEntryList';
import JournalEntryForm from '@/components/accounting/journal/JournalEntryForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

const JournalEntries = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingEntry, setEditingEntry] = useState(null);

  const handleCreateNew = () => {
    setEditingEntry(null);
    setActiveTab('create');
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setActiveTab('create');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Journal Entries</h1>
          {activeTab === 'list' && (
            <Button 
              onClick={handleCreateNew}
              className="mt-4 md:mt-0 flex items-center gap-2"
            >
              <PlusCircle size={16} />
              New Journal Entry
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Journal Entries</TabsTrigger>
            <TabsTrigger value="create">{editingEntry ? 'Edit' : 'Create'} Journal Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <JournalEntryList onEditEntry={handleEditEntry} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{editingEntry ? 'Edit' : 'Create'} Journal Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <JournalEntryForm 
                  entry={editingEntry} 
                  onComplete={() => setActiveTab('list')} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default JournalEntries;
