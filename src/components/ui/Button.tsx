import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-sage-600 hover:bg-sage-700 text-sand-50 shadow-md shadow-sage-600/10 focus:ring-sage-500',
    secondary: 'bg-sand-200 hover:bg-sand-300 text-sage-800 focus:ring-sand-400',
    outline: 'border-2 border-sage-300 hover:bg-sage-50 text-sage-700 focus:ring-sage-400',
    danger: 'bg-terracotta-600 hover:bg-terracotta-700 text-sand-50 shadow-md shadow-terracotta-600/10 focus:ring-terracotta-500',
    ghost: 'hover:bg-sand-100 text-sage-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
