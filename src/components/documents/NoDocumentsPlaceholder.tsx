
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, RefreshCw, Search } from 'lucide-react';

interface NoDocumentsPlaceholderProps {
  searchQuery?: string;
  category?: string;
  filter?: string;
  onRefresh?: () => void;
}

const NoDocumentsPlaceholder: React.FC<NoDocumentsPlaceholderProps> = ({
  searchQuery,
  category,
  filter,
  onRefresh
}) => {
  // Generate appropriate message based on filters
  const getMessage = () => {
    if (searchQuery) {
      return {
        title: 'No matching documents found',
        description: `No documents match your search for "${searchQuery}"`
      };
    }
    
    if (category && category !== 'all') {
      return {
        title: 'No documents in this category',
        description: `There are no documents in the "${category}" category`
      };
    }
    
    if (filter === 'recent') {
      return {
        title: 'No recent documents',
        description: 'No documents have been added recently'
      };
    }
    
    if (filter === 'shared') {
      return {
        title: 'No shared documents',
        description: 'No documents have been shared with you'
      };
    }
    
    return {
      title: 'No documents available',
      description: 'Get started by uploading your first document'
    };
  };
  
  const message = getMessage();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          {searchQuery ? (
            <Search className="h-10 w-10 text-muted-foreground mb-2" />
          ) : (
            <File className="h-10 w-10 text-muted-foreground mb-2" />
          )}
          
          <h3 className="text-lg font-medium">{message.title}</h3>
          <p className="text-muted-foreground mb-4">
            {message.description}
          </p>
          
          {onRefresh && !searchQuery && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDocumentsPlaceholder;
