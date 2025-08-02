import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className = '' }) => (
  <div className={`tabs ${className}`} data-default-value={defaultValue}>{children}</div>
);

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => (
  <div className={`tabs-list ${className}`}>{children}</div>
);

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => (
  <button className={`tabs-trigger ${className}`} data-value={value}>{children}</button>
);

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => (
  <div className={`tabs-content ${className}`} data-value={value}>{children}</div>
);
