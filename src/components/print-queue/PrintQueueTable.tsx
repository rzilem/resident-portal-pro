
import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PrintJob, PrintCategory } from '@/services/printQueueService';

interface PrintQueueTableProps {
  jobs: PrintJob[];
  selectedJobs: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onSetCategoryFilter: (category: PrintCategory) => void;
  onSetAssociationFilter: (id: string, name: string) => void;
}

const PrintQueueTable: React.FC<PrintQueueTableProps> = ({
  jobs,
  selectedJobs,
  onToggleSelect,
  onSelectAll,
  onSetCategoryFilter,
  onSetAssociationFilter,
}) => {
  // Group jobs by category for expandable rows
  const jobsByCategory: Record<PrintCategory, PrintJob[]> = {} as Record<PrintCategory, PrintJob[]>;
  jobs.forEach(job => {
    if (!jobsByCategory[job.category]) {
      jobsByCategory[job.category] = [];
    }
    jobsByCategory[job.category].push(job);
  });

  const categories = Object.keys(jobsByCategory) as PrintCategory[];
  
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 50 }}>
              <Checkbox 
                checked={jobs.length > 0 && selectedJobs.length === jobs.length}
                onCheckedChange={() => onSelectAll()}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead style={{ width: 120 }}>
              <div className="flex items-center gap-1">
                <span>Category</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Filter className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                      {['Bank Return', 'Statement', 'Notice', 'Invoice', 'Welcome Letter', 'Violation', 'Election Material', 'Other'].map((category) => (
                        <DropdownMenuItem 
                          key={category}
                          onClick={() => onSetCategoryFilter(category as PrintCategory)}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <span>Association</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Filter className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                      {Array.from(new Set(jobs.map(job => job.associationName))).map((name) => {
                        const job = jobs.find(j => j.associationName === name);
                        return job ? (
                          <DropdownMenuItem 
                            key={job.associationId}
                            onClick={() => onSetAssociationFilter(job.associationId, job.associationName)}
                          >
                            {name}
                          </DropdownMenuItem>
                        ) : null;
                      })}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Send Certified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No print jobs found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map(category => {
              const categoryJobs = jobsByCategory[category];
              const isExpanded = expandedCategories[category];
              
              return (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={7}>
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleCategory(category)}
                        className="p-0 hover:bg-transparent flex items-center gap-2"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                        <span className="font-medium">{category} (Count: {categoryJobs.length})</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && categoryJobs.map(job => (
                    <TableRow key={job.id} className="hover:bg-muted/20">
                      <TableCell>
                        <Checkbox 
                          checked={selectedJobs.includes(job.id)}
                          onCheckedChange={() => onToggleSelect(job.id)}
                          aria-label={`Select ${job.description}`}
                        />
                      </TableCell>
                      <TableCell>{job.category}</TableCell>
                      <TableCell>{job.associationName}</TableCell>
                      <TableCell>{job.category}</TableCell>
                      <TableCell>{format(new Date(job.createdAt), 'MM/dd/yyyy h:mm a')}</TableCell>
                      <TableCell>{job.description}</TableCell>
                      <TableCell>
                        <RadioGroup className="flex flex-row">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem 
                              value="yes" 
                              id={`yes-${job.id}`} 
                              checked={job.sendCertified === true}
                              disabled
                            />
                            <label htmlFor={`yes-${job.id}`} className="text-sm">Yes</label>
                          </div>
                          <div className="flex items-center space-x-1 ml-4">
                            <RadioGroupItem 
                              value="no" 
                              id={`no-${job.id}`} 
                              checked={job.sendCertified === false}
                              disabled
                            />
                            <label htmlFor={`no-${job.id}`} className="text-sm">No</label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrintQueueTable;
