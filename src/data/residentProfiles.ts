
import { ResidentProfiles } from '@/types/resident';
import aliceJohnson from './residents/aliceJohnson';
import robertSmith from './residents/robertSmith';
import emilyDavis from './residents/emilyDavis';
import { michaelWilson, sarahBrown, davidMiller } from './residents/otherResidents';

// Combine all resident profiles into a single object
const residentProfiles: ResidentProfiles = {
  101: aliceJohnson,
  102: robertSmith,
  103: emilyDavis,
  201: michaelWilson,
  202: sarahBrown,
  301: davidMiller
};

export default residentProfiles;
