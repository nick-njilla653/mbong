// src/hooks/useStreak.ts
import { useState, useEffect } from 'react';

export const useStreak = () => {
  const [streak, setStreak] = useState({
    current: 0,
    best: 0,
    lastUpdate: null as Date | null,
    daysThisWeek: [] as boolean[]
  });

  const updateStreak = () => {
    const today = new Date();
    const lastUpdate = streak.lastUpdate ? new Date(streak.lastUpdate) : null;

    if (!lastUpdate) {
      // Premier jour
      setStreak(prev => ({
        ...prev,
        current: 1,
        best: 1,
        lastUpdate: today,
        daysThisWeek: [true]
      }));
      return;
    }

    const dayDifference = Math.floor(
      (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 1) {
      // Jour consécutif
      const newCurrent = streak.current + 1;
      setStreak(prev => ({
        ...prev,
        current: newCurrent,
        best: Math.max(newCurrent, prev.best),
        lastUpdate: today,
        daysThisWeek: [...prev.daysThisWeek, true]
      }));
    } else if (dayDifference > 1) {
      // Streak perdu
      setStreak(prev => ({
        ...prev,
        current: 1,
        lastUpdate: today,
        daysThisWeek: [true]
      }));
    }
  };

  const checkAndUpdateStreak = () => {
    const today = new Date();
    if (!streak.lastUpdate || 
        today.toDateString() !== new Date(streak.lastUpdate).toDateString()) {
      updateStreak();
    }
  };

  return { streak, checkAndUpdateStreak };
};