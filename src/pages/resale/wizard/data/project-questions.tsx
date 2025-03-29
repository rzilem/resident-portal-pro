
import { ProjectTypeQuestions } from '../types';
import { CONSTRUCTION_QUESTIONS } from './questions/construction-questions';
import { FACILITY_QUESTIONS } from './questions/facility-questions';
import { SYSTEM_QUESTIONS } from './questions/system-questions';
import { MAINTENANCE_QUESTIONS } from './questions/maintenance-questions';
import { MISC_QUESTIONS } from './questions/misc-questions';

// Combine all questions from different categories
export const PROJECT_QUESTIONS: ProjectTypeQuestions = {
  ...CONSTRUCTION_QUESTIONS,
  ...FACILITY_QUESTIONS,
  ...SYSTEM_QUESTIONS,
  ...MAINTENANCE_QUESTIONS,
  ...MISC_QUESTIONS
};
