import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  className = '' 
}) => (
  <div className={`progress ${className}`}>
    <div className="progress-bar" style={{ width: `${(value / max) * 100}%` }} />
  </div>
);
