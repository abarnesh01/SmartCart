import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, size = 'sm', interactive = false, onRatingChange, numReviews }) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'button'}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform p-0.5`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= Math.round(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
