import React from 'react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning';
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  type = 'error', 
  message, 
  className = '' 
}) => {
  const typeStyles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  return (
    <div 
      className={`
        p-3 
        rounded-md 
        border 
        ${typeStyles[type]} 
        ${className}
      `}
      role="alert"
    >
      {message}
    </div>
  );
};