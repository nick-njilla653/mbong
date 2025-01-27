// src/contexts/GamificationContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { useStreak } from '../hooks/useStreak';

// Définition des types d'achievements possibles
const ACHIEVEMENTS = {
    FIRST_RECIPE: {
      id: 'first_recipe',
      title: 'Premier pas',
      description: 'Compléter votre première recette'
    },
    FIVE_RECIPES: {
      id: 'five_recipes',
      title: 'Chef en herbe',
      description: 'Compléter 5 recettes'
    },
    PERFECT_QUIZ: {
      id: 'perfect_quiz',
      title: 'Expert culinaire',
      description: 'Obtenir un score parfait au quiz'
    },
    STREAK_WEEK: {
      id: 'streak_week',
      title: 'Régularité',
      description: 'Maintenir une série de 7 jours'
    }
   } as const;
   
   interface AchievementProgress {
    recipes: string[];
    perfectQuizzes: number;
    longestStreak: number;
   }

interface GamificationContextType {
    achievements: Achievement[];
    streak: StreakData;
    checkAndUpdateStreak: () => void;
    updateProgress: (recipeId: string, stageType: string) => void;
  }

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface StreakData {
  current: number;
  best: number;
  lastUpdate: Date | null;
  daysThisWeek: boolean[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { streak, checkAndUpdateStreak } = useStreak();
  
  const updateProgress = async (recipeId: string, stageType: string) => {
    try {
      // Mise à jour du progrès
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
        },
        body: JSON.stringify({ recipeId, stageType })
      });
 
      // Vérifier les achievements débloqués
      checkAndUpdateAchievements();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du progrès:', error);
    }
  };
 
  const checkAndUpdateAchievements = async () => {
   try {
     // Récupérer la progression actuelle
     const response = await fetch('/api/user/progress', {
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
       }
     });
     const progress: AchievementProgress = await response.json();

     const newAchievements: Achievement[] = [];

     // Premier pas
     if (progress.recipes.length === 1) {
       newAchievements.push({
         ...ACHIEVEMENTS.FIRST_RECIPE,
         unlocked: true
       });
     }

     // Chef en herbe
     if (progress.recipes.length >= 5) {
       newAchievements.push({
         ...ACHIEVEMENTS.FIVE_RECIPES,
         unlocked: true
       });
     }

     // Expert culinaire
     if (progress.perfectQuizzes > 0) {
       newAchievements.push({
         ...ACHIEVEMENTS.PERFECT_QUIZ,
         unlocked: true
       });
     }

     // Série hebdomadaire
     if (progress.longestStreak >= 7) {
       newAchievements.push({
         ...ACHIEVEMENTS.STREAK_WEEK,
         unlocked: true
       });
     }

     // Filtrer les achievements déjà débloqués
     const currentAchievementIds = achievements.map(a => a.id);
     const uniqueNewAchievements = newAchievements.filter(
       a => !currentAchievementIds.includes(a.id)
     );

     if (uniqueNewAchievements.length > 0) {
       // Mise à jour locale
       setAchievements(prev => [...prev, ...uniqueNewAchievements]);

       // Mise à jour serveur
       await fetch('/api/achievements', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
         },
         body: JSON.stringify({ achievements: uniqueNewAchievements })
       });

       // Notification pour chaque nouvel achievement
       uniqueNewAchievements.forEach(achievement => {
         // Afficher une notification ou un toast
         console.log(`Nouvel achievement débloqué : ${achievement.title}`);
       });
     }
   } catch (error) {
     console.error('Erreur lors de la vérification des achievements:', error);
   }
 };
  return (
   <GamificationContext.Provider value={{
     achievements,
     streak,
     checkAndUpdateStreak,
     updateProgress
   }}>
     {children}
   </GamificationContext.Provider>
 );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};