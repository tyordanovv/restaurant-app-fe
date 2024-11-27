export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ 
    children, 
    className = '', 
    ...props 
  }) => {
    return (
      <a 
        className={`
          text-blue-600 
          hover:underline 
          hover:text-blue-800 
          transition-colors 
          ${className}
        `}
        {...props}
      >
        {children}
      </a>
    );
  };