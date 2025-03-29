
import { ProjectTypeQuestions } from '../types';

// Import all question modules
import { CONSTRUCTION_QUESTIONS } from './questions/construction/construction-questions';
import { RENOVATION_QUESTIONS } from './questions/construction/renovation-questions';
import { FENCING_QUESTIONS } from './questions/facility/fencing-questions';
import { ROOFING_QUESTIONS } from './questions/facility/roofing-questions';
import { HVAC_QUESTIONS } from './questions/system/hvac-questions';
import { PLUMBING_QUESTIONS } from './questions/system/plumbing-questions';
import { ELECTRICAL_QUESTIONS } from './questions/system/electrical-questions';
import { LANDSCAPING_QUESTIONS } from './questions/maintenance/landscaping-questions';
import { WINDOW_QUESTIONS } from './questions/maintenance/window-questions';
import { TRASH_QUESTIONS } from './questions/maintenance/trash-questions';
import { SPORTS_COURT_QUESTIONS } from './questions/maintenance/sports-court-questions';
import { PEST_CONTROL_QUESTIONS } from './questions/maintenance/pest-control-questions';
import { PRESSURE_WASHING_QUESTIONS } from './questions/maintenance/pressure-washing-questions';
import { ASPHALT_PAVING_QUESTIONS } from './questions/maintenance/asphalt-paving-questions';
import { CONCRETE_QUESTIONS } from './questions/maintenance/concrete-questions';
import { MISC_QUESTIONS } from './questions/misc/misc-questions';

// Combine all questions from different categories
export const PROJECT_QUESTIONS: ProjectTypeQuestions = {
  ...CONSTRUCTION_QUESTIONS,
  ...RENOVATION_QUESTIONS,
  ...FENCING_QUESTIONS,
  ...ROOFING_QUESTIONS,
  ...HVAC_QUESTIONS,
  ...PLUMBING_QUESTIONS,
  ...ELECTRICAL_QUESTIONS,
  ...LANDSCAPING_QUESTIONS,
  ...WINDOW_QUESTIONS,
  ...TRASH_QUESTIONS,
  ...SPORTS_COURT_QUESTIONS,
  ...PEST_CONTROL_QUESTIONS,
  ...PRESSURE_WASHING_QUESTIONS,
  ...ASPHALT_PAVING_QUESTIONS,
  ...CONCRETE_QUESTIONS,
  ...MISC_QUESTIONS
};
