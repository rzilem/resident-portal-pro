
import { Home, FileText, ClipboardList, Calendar, DollarSign, FileCheck } from 'lucide-react';
import { Step } from './types';

export const STEPS: Step[] = [
  { id: 'property', label: 'Property Details', icon: Home },
  { id: 'certificate', label: 'Resale Certificate', icon: FileText },
  { id: 'questionnaire', label: 'Condo Questionnaire', icon: ClipboardList },
  { id: 'inspection', label: 'Property Inspection', icon: Calendar },
  { id: 'statement', label: 'Account Statement', icon: DollarSign },
  { id: 'trec-forms', label: 'TREC Forms', icon: FileCheck }
];
