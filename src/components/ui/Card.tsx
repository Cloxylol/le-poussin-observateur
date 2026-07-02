import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'paper' | 'flat' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'paper',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-300';
  
  const variants = {
    paper: 'bg-sand-50 border border-sand-200/80 shadow-md shadow-stone-200/50 hover:shadow-lg hover:shadow-stone-200/70',
    flat: 'bg-sand-100/55 border border-transparent',
    outline: 'border-2 border-dashed border-sand-200 hover:border-sage-300 bg-transparent'
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
