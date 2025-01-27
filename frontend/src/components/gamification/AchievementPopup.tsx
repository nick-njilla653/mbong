// src/components/gamification/AchievementPopup.tsx
import React from 'react';
import { IonCard } from '@ionic/react';
import { motion } from 'framer-motion';

interface AchievementPopupProps {
  title: string;
  description: string;
  xpGained: number;
  icon: string;
  onClose: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  title,
  description,
  xpGained,
  icon,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <IonCard className="achievement-popup">
        <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-lg">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-800">{title}</h3>
            <p className="text-sm text-green-600">{description}</p>
            <p className="text-xs text-green-500 mt-1">+{xpGained} XP</p>
          </div>
        </div>
      </IonCard>
    </motion.div>
  );
};
