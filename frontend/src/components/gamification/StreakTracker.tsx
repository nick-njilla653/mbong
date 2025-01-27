// src/components/gamification/StreakTracker.tsx
import React from 'react';
import { IonIcon } from '@ionic/react';
import { flame } from 'ionicons/icons';

interface StreakTrackerProps {
  currentStreak: number;
  bestStreak: number;
  daysThisWeek: boolean[];
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak,
  bestStreak,
  daysThisWeek
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <IonIcon icon={flame} className="text-orange-500 w-6 h-6 mr-2" />
          <span className="font-bold text-xl">{currentStreak} jours</span>
        </div>
        <div className="text-sm text-gray-500">
          Record : {bestStreak} jours
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysThisWeek.map((completed, index) => (
          <div
            key={index}
            className={`h-2 rounded-full ${
              completed ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mer</span>
        <span>Jeu</span>
        <span>Ven</span>
        <span>Sam</span>
        <span>Dim</span>
      </div>
    </div>
  );
};