import React, { ReactNode } from 'react';
import Icon from './Icon';

interface ButtonProps {
  children: ReactNode;
  // FIX: Update the onClick prop type to correctly handle mouse events, allowing the event object to be passed to handlers.
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  iconLeft,
  iconRight,
  size = 'md',
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-opacity-90 focus:ring-[var(--color-primary)]',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-[var(--color-primary)] border border-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-[var(--color-primary)]',
  };
  
  const sizeClasses = {
    md: 'px-4 py-2 text-base',
    sm: 'px-2.5 py-1.5 text-sm',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };

  const iconSizeClasses = {
    md: 'text-xl',
    sm: 'text-base',
    lg: 'text-2xl',
    icon: 'text-2xl',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {iconLeft && <Icon name={iconLeft} className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />}
      {children}
      {iconRight && <Icon name={iconRight} className={`${iconSizeClasses[size]} ${children ? 'ml-2' : ''}`} />}
    </button>
  );
};

export default Button;