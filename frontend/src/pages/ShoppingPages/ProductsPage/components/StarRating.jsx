import React from 'react';
const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`h-5 w-5 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .288l2.833 8.718H24l-7.167 5.25 2.833 8.718L12 17.426 4.5 23l2.833-8.718L0 8.706h9.167z" />
          </svg>
        ))}
      </div>
    );
  };

  export default StarRating;