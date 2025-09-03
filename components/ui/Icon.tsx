import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, className = 'text-2xl', style }) => {
  return (
    <span className={`material-icons-outlined ${className}`} style={style}>
      {name}
    </span>
  );
};

export default Icon;