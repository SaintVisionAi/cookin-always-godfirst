import React from 'react';

// Simple UI components for SuperSal
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input className="input" {...props} />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select className="select" {...props}>{children}</select>
);

export const Progress: React.FC<{ value: number; max?: number; className?: string }> = ({ 
  value, 
  max = 100, 
  className = '' 
}) => (
  <div className={`progress ${className}`}>
    <div className="progress-bar" style={{ width: `${(value / max) * 100}%` }} />
  </div>
);

export const Alert: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`alert ${className}`}>{children}</div>
);

export const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`alert-description ${className}`}>{children}</div>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  <label className="label" {...props} />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea className="textarea" {...props} />
);

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input type="checkbox" className="checkbox" {...props} />
);

export const RadioGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`radio-group ${className}`}>{children}</div>
);

export const RadioGroupItem: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input type="radio" className="radio-item" {...props} />
);

export const Slider: React.FC<{ 
  value: number[]; 
  onValueChange?: (value: number[]) => void; 
  max?: number; 
  step?: number;
  className?: string;
}> = ({ value, onValueChange, max = 100, step = 1, className = '' }) => (
  <input
    type="range"
    min={0}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
    className={`slider ${className}`}
  />
);
