// components/ui/button.tsx
import React from 'react';
import { IonButton } from '@ionic/react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-colors';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  return (
    <IonButton
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </IonButton>
  );
};
