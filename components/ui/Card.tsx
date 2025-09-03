import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-200' : ''}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;