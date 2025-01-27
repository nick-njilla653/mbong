
// components/ui/card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }: CardProps) => (
  <div className={className}>{children}</div>
);