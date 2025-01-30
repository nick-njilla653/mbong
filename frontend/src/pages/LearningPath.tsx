/*  // src/pages/LearningPath.tsx
 import React, { useState, useEffect } from 'react';
 import {
   IonPage,
   IonContent,
   IonHeader,
   IonToolbar,
   IonTitle,
   IonCard,
   IonCardContent,
   IonIcon,
   IonSpinner,
   IonBadge,
   useIonRouter
 } from '@ionic/react';
 import { lockClosed, checkmarkCircle, timeOutline, star, trophy, location } from 'ionicons/icons';
 import { LearningService } from '../services/learning.service';
 import { useAuth } from '../contexts/AuthContext';
 import { Level, Lesson } from '../types';
 import '../styles/LearningPath.css';


 const LearningPath: React.FC = () => {
   const [levels, setLevels] = useState<Level[]>([]);
   const [loading, setLoading] = useState(true);
   const router = useIonRouter();
   const { user } = useAuth();

   useEffect(() => {
     loadLevels();
   }, []);

   const loadLevels = async () => {
     try {
       const levelsData = await LearningService.getLevels();
       setLevels(levelsData);
     } catch (error) {
       console.error('Error loading levels:', error);
     } finally {
       setLoading(false);
     }
   };

   const checkLessonAvailability = (lesson: Lesson, level: Level): boolean => {
     if (!level.unlocked) return false;

     if (lesson.unlockRequirements) {
       const { level: reqLevel, xp: reqXP, completedLessons } = lesson.unlockRequirements;

       if (reqLevel && user && user.level < reqLevel) return false;
       if (reqXP && user && user.xp < reqXP) return false;
       if (completedLessons && user?.completedLessons) {
         // Conversion explicite en string pour la comparaison
         const missingPrereqs = completedLessons.map(String).filter(
           reqId => !user.completedLessons.includes(reqId)
         );
         if (missingPrereqs.length > 0) return false;
       }
     }
     if (lesson.requirements && user?.completedLessons) {
       // Conversion explicite en string pour la comparaison
       const missingReqs = lesson.requirements.map(String).filter(
         reqId => !user.completedLessons.includes(reqId)
       );
       if (missingReqs.length > 0) return false;
     }

     return true;
   };

   const handleLessonClick = (level: Level, lesson: Lesson) => {
     if (checkLessonAvailability(lesson, level)) {
       const recipeId: string = String(lesson.id);
       router.push(`/app/recipe/${recipeId}`);
     }
   };

   const getCategoryColor = (category: Level['category']) => {
     switch (category) {
       case 'beginner': return 'text-green-500';
       case 'intermediate': return 'text-yellow-500';
       case 'advanced': return 'text-red-500';
       default: return 'text-gray-500';
     }
   };
  if (loading) {
     return (
       <div className="flex items-center justify-center h-screen">
         <IonSpinner />
       </div>
     );
   }
   return (
     <IonPage>
       <IonHeader>
         <IonToolbar>
           <IonTitle>Parcours d'apprentissage</IonTitle>
         </IonToolbar>
       </IonHeader>

       <IonContent>
         <div className="p-4 space-y-6">
           {levels.map((level) => (
             <div key={level.id} className="space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-xl font-bold">{level.title}</h2>
                   <p className={`text-sm ${getCategoryColor(level.category)}`}>
                     {level.category.charAt(0).toUpperCase() + level.category.slice(1)}
                   </p>
                </div>
                 {level.unlocked ? (
                  <div className="flex items-center space-x-2">
                     <IonIcon icon={trophy} className="w-5 h-5 text-yellow-500" />
                     <span>{level.rewards?.xp || 0} XP</span>
                   </div>
                 ) : (
                   <div className="flex items-center text-gray-500">
                     <IonIcon icon={lockClosed} className="w-5 h-5 mr-1" />
                     <span>{level.requiredXP} XP requis</span>
                   </div>
                 )}
               </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {level.lessons.map((lesson) => (
                   <IonCard
                    key={lesson.id}
                     className={`${checkLessonAvailability(lesson, level)
                         ? 'cursor-pointer hover:shadow-lg'
                         : 'opacity-75'
                       } transition-all duration-200`}
                     onClick={() => handleLessonClick(level, lesson)}
                   >
                     <IonCardContent>
                       <div className="flex items-start space-x-4">
                         <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          {lesson.completed ? (
                             <IonIcon icon={checkmarkCircle} className="w-6 h-6 text-green-600" />
                           ) : (
                             <span className="text-2xl">🥘</span>
                           )}
                         </div>
                         <div className="flex-1">
                           <h3 className="font-bold mb-1">{lesson.name}</h3>
                           <p className="text-sm text-gray-600 mb-2">
                             {lesson.description}
                           </p>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center text-sm text-gray-500 space-x-4">
                               <div className="flex items-center">
                                 <IonIcon icon={timeOutline} className="w-4 h-4 mr-1" />
                                 <span>{lesson.duration} min</span>
                               </div>
                               {lesson.region && (
                                 <div className="flex items-center">
                                   <IonIcon icon={location} className="w-4 h-4 mr-1" />
                                   <span>{lesson.region}</span>
                                 </div>
                               )}
                             </div>
                             <IonBadge color={
                               lesson.difficulty === 'easy' ? 'success' :
                                 lesson.difficulty === 'medium' ? 'warning' : 'danger'
                             }>
                               {lesson.difficulty}
                             </IonBadge>
                           </div>
                         </div>
                       </div>
                     </IonCardContent>
                   </IonCard>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </IonContent>
     </IonPage>
   );
 };

export default LearningPath;
 */















// src/pages/LearningPathMock.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { lockClosed, checkmarkCircle, timeOutline, trophy, location } from 'ionicons/icons';

// Mock types
interface Lesson {
  id: string;
  name: string;
  description: string;
  duration: number;
  region?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  unlockRequirements?: {
    level?: number;
    xp?: number;
    completedLessons?: string[];
  };
}

interface Level {
  id: string;
  title: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  unlocked: boolean;
  requiredXP?: number;
  rewards?: {
    xp?: number;
  };
  lessons: Lesson[];
}

const LearningPath: React.FC = () => {
  // Mock data for Cameroonian cuisine
  const [levels] = useState<Level[]>([
    {
      id: '1',
      title: 'Découverte des Saveurs du Cameroun',
      category: 'beginner',
      unlocked: true,
      rewards: { xp: 100 },
      lessons: [
        {
          id: '101',
          name: 'Ndolé, le Plat National',
          description: 'Apprenez à préparer le célèbre ndolé, un plat emblématique du Cameroun',
          duration: 60,
          region: 'Douala',
          difficulty: 'medium',
          completed: false
        },
        {
          id: '102',
          name: 'Poulet DG (Directeur Général)',
          description: 'Maîtrisez la recette du poulet DG, un plat de prestige camerounais',
          duration: 45,
          region: 'Yaoundé',
          difficulty: 'easy',
          completed: true
        }
      ]
    },
    {
      id: '2',
      title: 'Cuisine Traditionnelle des Régions',
      category: 'intermediate',
      unlocked: false,
      requiredXP: 200,
      lessons: [
        {
          id: '201',
          name: 'Eru des Anglophones',
          description: 'Découvrez le plat traditionnel des régions anglophones du Cameroun',
          duration: 75,
          region: 'Nord-Ouest',
          difficulty: 'hard',
          completed: false,
          unlockRequirements: {
            xp: 150,
            completedLessons: ['102']
          }
        },
        {
          id: '202',
          name: 'Koki Corn du Sud',
          description: 'Préparez les célèbres galettes de maïs de la région du Sud',
          duration: 50,
          region: 'Sud',
          difficulty: 'medium',
          completed: false
        }
      ]
    },
    {
      id: '3',
      title: 'Techniques Avancées',
      category: 'advanced',
      unlocked: false,
      requiredXP: 350,
      lessons: [
        {
          id: '301',
          name: 'Sauce Pistache de l\'Est',
          description: 'Maîtrisez la préparation complexe de la sauce pistache',
          duration: 90,
          region: 'Est',
          difficulty: 'hard',
          completed: false,
          unlockRequirements: {
            xp: 300,
            completedLessons: ['201', '202']
          }
        }
      ]
    }
  ]);

  const getCategoryColor = (category: Level['category']) => {
    switch (category) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const checkLessonAvailability = (lesson: Lesson, level: Level): boolean => {
    // Simple mock availability check
    return level.unlocked && 
           (!lesson.unlockRequirements || 
            ((!lesson.unlockRequirements.xp || lesson.unlockRequirements.xp <= 100) &&
             (!lesson.unlockRequirements.completedLessons || 
              lesson.unlockRequirements.completedLessons.every(id => ['102'].includes(id)))));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Parcours Culinaire Camerounais</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4 space-y-6">
          {levels.map((level) => (
            <div key={level.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{level.title}</h2>
                  <p className={`text-sm ${getCategoryColor(level.category)}`}>
                    {level.category === 'beginner' ? 'Débutant' :
                     level.category === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </p>
                </div>
                {level.unlocked ? (
                  <div className="flex items-center space-x-2">
                    <IonIcon icon={trophy} className="w-5 h-5 text-yellow-500" />
                    <span>{level.rewards?.xp || 0} XP</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <IonIcon icon={lockClosed} className="w-5 h-5 mr-1" />
                    <span>{level.requiredXP} XP requis</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {level.lessons.map((lesson) => (
                  <IonCard
                    key={lesson.id}
                    className={`${checkLessonAvailability(lesson, level)
                      ? 'cursor-pointer hover:shadow-lg'
                      : 'opacity-75'
                    } transition-all duration-200`}
                  >
                    <IonCardContent>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          {lesson.completed ? (
                            <IonIcon icon={checkmarkCircle} className="w-6 h-6 text-green-600" />
                          ) : (
                            <span className="text-2xl">🍲</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{lesson.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center">
                                <IonIcon icon={timeOutline} className="w-4 h-4 mr-1" />
                                <span>{lesson.duration} min</span>
                              </div>
                              {lesson.region && (
                                <div className="flex items-center">
                                  <IonIcon icon={location} className="w-4 h-4 mr-1" />
                                  <span>{lesson.region}</span>
                                </div>
                              )}
                            </div>
                            <IonBadge color={
                              lesson.difficulty === 'easy' ? 'success' :
                              lesson.difficulty === 'medium' ? 'warning' : 'danger'
                            }>
                              {lesson.difficulty === 'easy' ? 'Facile' :
                               lesson.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                            </IonBadge>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LearningPath;