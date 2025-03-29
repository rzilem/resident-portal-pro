
import React from 'react';
import { Star } from 'lucide-react';

interface VendorRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
}

const VendorRating: React.FC<VendorRatingProps> = ({ 
  rating, 
  maxRating = 5,
  size = 'small'
}) => {
  const roundedRating = Math.round(rating * 2) / 2;
  
  const sizeClass = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4', 
    large: 'h-5 w-5'
  }[size];
  
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        let fillClass = 'text-muted-foreground/30';
        
        if (roundedRating >= starValue) {
          fillClass = 'text-yellow-400';
        } else if (roundedRating >= starValue - 0.5) {
          fillClass = 'text-yellow-300';
        }
        
        return (
          <Star
            key={index}
            className={`${sizeClass} ${fillClass} fill-current`}
          />
        );
      })}
      <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

export default VendorRating;
