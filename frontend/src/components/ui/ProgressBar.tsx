

// components/ui/progress-bar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  max?: number;
  className?: string;
}

export const ProgressBar = ({
  progress,
  max = 100,
  className = '',
}: ProgressBarProps) => {
  const percentage = Math.min((progress / max) * 100, 100);

  return (
    <div className={`w-full h-4 bg-gray-200 rounded-full ${className}`}>
      <div
        className="h-full bg-green-600 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
