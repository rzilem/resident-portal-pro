
import { ProjectTypeQuestions } from '../types';

// Import all question modules
import { CONSTRUCTION_QUESTIONS } from './questions/construction/construction-questions';
import { RENOVATION_QUESTIONS } from './questions/construction/renovation-questions';
import { FENCING_QUESTIONS } from './questions/facility/fencing-questions';
import { ROOFING_QUESTIONS } from './questions/facility/roofing-questions';
import { HVAC_QUESTIONS } from './questions/system/hvac-questions';
import { PLUMBING_QUESTIONS } from './questions/system/plumbing-questions';
import { LANDSCAPING_QUESTIONS } from './questions/maintenance/landscaping-questions';
import { WINDOW_QUESTIONS } from './questions/maintenance/window-questions';
import { TRASH_QUESTIONS } from './questions/maintenance/trash-questions';
import { SPORTS_COURT_QUESTIONS } from './questions/maintenance/sports-court-questions';
import { MISC_QUESTIONS } from './questions/misc/misc-questions';

// Combine all questions from different categories
export const PROJECT_QUESTIONS: ProjectTypeQuestions = {
  ...CONSTRUCTION_QUESTIONS,
  ...RENOVATION_QUESTIONS,
  ...FENCING_QUESTIONS,
  ...ROOFING_QUESTIONS,
  ...HVAC_QUESTIONS,
  ...PLUMBING_QUESTIONS,
  ...LANDSCAPING_QUESTIONS,
  ...WINDOW_QUESTIONS,
  ...TRASH_QUESTIONS,
  ...SPORTS_COURT_QUESTIONS,
  ...MISC_QUESTIONS
};
