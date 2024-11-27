import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  description 
}) => {
  return (
    <div className={`
      bg-white 
      shadow-md 
      rounded-lg 
      p-6 
      w-full 
      max-w-md 
      mx-auto 
      ${className}
    `}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};