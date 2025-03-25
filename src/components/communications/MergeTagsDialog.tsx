
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Tag } from 'lucide-react';
import { mergeTagService } from '@/services/mergeTagService';
import { MergeTag, MergeTagGroup } from '@/types/mergeTags';

interface MergeTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTag: (tag: MergeTag) => void;
}

const MergeTagsDialog: React.FC<MergeTagsDialogProps> = ({ 
  open, 
  onOpenChange,
  onSelectTag
}) => {
  const [tagGroups, setTagGroups] = useState<MergeTagGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<MergeTagGroup[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const fetchTagGroups = async () => {
      const groups = await mergeTagService.getMergeTagGroups();
      setTagGroups(groups);
      setFilteredGroups(groups);
    };
    
    if (open) {
      fetchTagGroups();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery) {
      // Filter tags based on search query
      const filtered = tagGroups.map(group => ({
        ...group,
        tags: group.tags.filter(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.tags.length > 0);
      
      setFilteredGroups(filtered);
    } else if (activeCategory !== 'all') {
      // Filter by selected category
      setFilteredGroups(tagGroups.filter(group => group.category === activeCategory));
    } else {
      // No filters
      setFilteredGroups(tagGroups);
    }
  }, [searchQuery, tagGroups, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
  };

  const handleInsertTag = (tag: MergeTag) => {
    onSelectTag(tag);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Insert Merge Tag
          </DialogTitle>
          <DialogDescription>
            Select a merge tag to insert dynamic content into your message
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search merge tags..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
            <ScrollArea className="w-full">
              <TabsList className="w-full justify-start border-b pb-px mb-4">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {tagGroups.map(group => (
                  <TabsTrigger key={group.category} value={group.category}>
                    {group.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-6 pr-4">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map(group => (
                    <TabsContent key={group.category} value="all" className="m-0" forceMount={activeCategory === 'all' ? true : undefined}>
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">{group.name}</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {group.tags.map(tag => (
                            <div
                              key={tag.id}
                              className="flex flex-col p-3 border rounded-md hover:border-primary cursor-pointer transition-colors"
                              onClick={() => handleInsertTag(tag)}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium">{tag.name}</span>
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">{tag.tag}</code>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{tag.description}</p>
                              {tag.example && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Example: <span className="italic">{tag.example}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No merge tags found for your search criteria
                  </div>
                )}
                
                {filteredGroups.map(group => (
                  <TabsContent key={group.category} value={group.category} className="m-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        {group.tags.map(tag => (
                          <div
                            key={tag.id}
                            className="flex flex-col p-3 border rounded-md hover:border-primary cursor-pointer transition-colors"
                            onClick={() => handleInsertTag(tag)}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{tag.name}</span>
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">{tag.tag}</code>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{tag.description}</p>
                            {tag.example && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Example: <span className="italic">{tag.example}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MergeTagsDialog;
