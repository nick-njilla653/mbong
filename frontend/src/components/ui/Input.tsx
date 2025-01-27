
// components/ui/input.tsx
import React from 'react';
import { IonInput } from '@ionic/react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  className = '',
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <IonInput
        type={type}
        value={value}
        placeholder={placeholder}
        onIonChange={e => onChange(e.detail.value || '')}
        className={`p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};