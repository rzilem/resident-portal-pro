
import React from 'react';
import { Star } from 'lucide-react';

interface VendorRatingProps {
  rating: number;
}

const VendorRating = ({ rating }: VendorRatingProps) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    );
  }
  
  // Add half star
  if (hasHalfStar) {
    stars.push(
      <span key="half" className="relative">
        <Star className="h-4 w-4 text-yellow-400" />
        <Star 
          className="h-4 w-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" 
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </span>
    );
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
    );
  }
  
  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
    </div>
  );
};

export default VendorRating;
