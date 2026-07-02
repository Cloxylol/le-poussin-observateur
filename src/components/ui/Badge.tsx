import React, { type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'sand' | 'river' | 'terracotta' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans tracking-wide border';

  const variants = {
    sage: 'bg-sage-50 text-sage-700 border-sage-200/80',
    sand: 'bg-sand-100 text-sand-800 border-sand-200',
    river: 'bg-river-50 text-river-700 border-river-200/80',
    terracotta: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200/80',
    gray: 'bg-stone-100 text-stone-600 border-stone-200'
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
