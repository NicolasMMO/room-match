import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const logoClass = `font-bold text-primary-500 ${sizeClasses[size]} ${className}`;

  return (
    <h1 className={logoClass}>
      Room<span className="text-accent-500">Match</span>
    </h1>
  );
};

export default Logo;
