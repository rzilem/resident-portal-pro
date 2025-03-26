
export * from './alertQueries';
export * from './alertMutations';
export * from './alertSolutions';
export * from './alertInitialization';

// Initialize solution actions on module load
import { initializeSolutionActions } from './alertInitialization';
initializeSolutionActions();
