// // src/pages/LearningPath.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   IonPage,
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonCard,
//   IonCardContent,
//   IonIcon,
//   IonSpinner,
//   IonBadge,
//   useIonRouter
// } from '@ionic/react';
// import { lockClosed, checkmarkCircle, timeOutline, star, trophy, location } from 'ionicons/icons';
// import { LearningService } from '../services/learning.service';
// import { useAuth } from '../contexts/AuthContext';
// import { Level, Lesson } from '../types';
// import '../styles/LearningPath.css';


// const LearningPath: React.FC = () => {
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useIonRouter();
//   const { user } = useAuth();

//   useEffect(() => {
//     loadLevels();
//   }, []);

//   const loadLevels = async () => {
//     try {
//       const levelsData = await LearningService.getLevels();
//       setLevels(levelsData);
//     } catch (error) {
//       console.error('Error loading levels:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkLessonAvailability = (lesson: Lesson, level: Level): boolean => {
//     if (!level.unlocked) return false;

//     if (lesson.unlockRequirements) {
//       const { level: reqLevel, xp: reqXP, completedLessons } = lesson.unlockRequirements;

//       if (reqLevel && user && user.level < reqLevel) return false;
//       if (reqXP && user && user.xp < reqXP) return false;
//       if (completedLessons && user?.completedLessons) {
//         // Conversion explicite en string pour la comparaison
//         const missingPrereqs = completedLessons.map(String).filter(
//           reqId => !user.completedLessons.includes(reqId)
//         );
//         if (missingPrereqs.length > 0) return false;
//       }
//     }

//     if (lesson.requirements && user?.completedLessons) {
//       // Conversion explicite en string pour la comparaison
//       const missingReqs = lesson.requirements.map(String).filter(
//         reqId => !user.completedLessons.includes(reqId)
//       );
//       if (missingReqs.length > 0) return false;
//     }

//     return true;
//   };

//   const handleLessonClick = (level: Level, lesson: Lesson) => {
//     if (checkLessonAvailability(lesson, level)) {
//       const recipeId: string = String(lesson.id);
//       router.push(`/app/recipe/${recipeId}`);
//     }
//   };

//   const getCategoryColor = (category: Level['category']) => {
//     switch (category) {
//       case 'beginner': return 'text-green-500';
//       case 'intermediate': return 'text-yellow-500';
//       case 'advanced': return 'text-red-500';
//       default: return 'text-gray-500';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <IonSpinner />
//       </div>
//     );
//   }

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Parcours d'apprentissage</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent>
//         <div className="p-4 space-y-6">
//           {levels.map((level) => (
//             <div key={level.id} className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold">{level.title}</h2>
//                   <p className={`text-sm ${getCategoryColor(level.category)}`}>
//                     {level.category.charAt(0).toUpperCase() + level.category.slice(1)}
//                   </p>
//                 </div>
//                 {level.unlocked ? (
//                   <div className="flex items-center space-x-2">
//                     <IonIcon icon={trophy} className="w-5 h-5 text-yellow-500" />
//                     <span>{level.rewards?.xp || 0} XP</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center text-gray-500">
//                     <IonIcon icon={lockClosed} className="w-5 h-5 mr-1" />
//                     <span>{level.requiredXP} XP requis</span>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {level.lessons.map((lesson) => (
//                   <IonCard
//                     key={lesson.id}
//                     className={`${checkLessonAvailability(lesson, level)
//                         ? 'cursor-pointer hover:shadow-lg'
//                         : 'opacity-75'
//                       } transition-all duration-200`}
//                     onClick={() => handleLessonClick(level, lesson)}
//                   >
//                     <IonCardContent>
//                       <div className="flex items-start space-x-4">
//                         <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
//                           {lesson.completed ? (
//                             <IonIcon icon={checkmarkCircle} className="w-6 h-6 text-green-600" />
//                           ) : (
//                             <span className="text-2xl">🥘</span>
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-bold mb-1">{lesson.name}</h3>
//                           <p className="text-sm text-gray-600 mb-2">
//                             {lesson.description}
//                           </p>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center text-sm text-gray-500 space-x-4">
//                               <div className="flex items-center">
//                                 <IonIcon icon={timeOutline} className="w-4 h-4 mr-1" />
//                                 <span>{lesson.duration} min</span>
//                               </div>
//                               {lesson.region && (
//                                 <div className="flex items-center">
//                                   <IonIcon icon={location} className="w-4 h-4 mr-1" />
//                                   <span>{lesson.region}</span>
//                                 </div>
//                               )}
//                             </div>
//                             <IonBadge color={
//                               lesson.difficulty === 'easy' ? 'success' :
//                                 lesson.difficulty === 'medium' ? 'warning' : 'danger'
//                             }>
//                               {lesson.difficulty}
//                             </IonBadge>
//                           </div>
//                         </div>
//                       </div>
//                     </IonCardContent>
//                   </IonCard>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default LearningPath;

// src/pages/LearningPath.tsx
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
  IonSpinner,
  IonBadge,
  useIonRouter
} from '@ionic/react';
import { lockClosed, checkmarkCircle, timeOutline, star, trophy, location } from 'ionicons/icons';
import '../styles/LearningPath.css';

const mockLevels = [
  {
    id: "1",
    title: "Bases de la cuisine camerounaise",
    description: "Apprenez les fondamentaux",
    category: 'beginner' as const,
    unlocked: true,
    requiredXP: 0,
    rewards: {
      xp: 100,
      badges: ["débutant"]
    },
    lessons: [
      {
        id: "1",
        name: "Ndolé traditionnel",
        description: "Apprenez à préparer le fameux Ndolé",
        duration: 60,
        difficulty: 'medium' as const,
        completed: false,
        region: "Littoral",
        xpReward: 50
      },
      {
        id: "2",
        name: "Eru",
        description: "Découvrez l'Eru traditionnel",
        duration: 45,
        difficulty: 'easy' as const,
        completed: true,
        region: "Sud-Ouest",
        xpReward: 30
      }
    ]
  },
  {
    id: "2",
    title: "Cuisine avancée",
    description: "Perfectionnez vos techniques",
    category: 'intermediate' as const,
    unlocked: false,
    requiredXP: 100,
    rewards: {
      xp: 200,
      badges: ["chef"]
    },
    lessons: [
      {
        id: "3",
        name: "Poulet DG",
        description: "Le célèbre Poulet Directeur Général",
        duration: 90,
        difficulty: 'hard' as const,
        completed: false,
        region: "Littoral",
        xpReward: 80
      }
    ]
  }
];

const LearningPath: React.FC = () => {
  const [levels, setLevels] = useState(mockLevels);
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

  const checkLessonAvailability = (lesson: typeof mockLevels[0]['lessons'][0], level: typeof mockLevels[0]): boolean => {
    return level.unlocked;
  };

  const handleLessonClick = (level: typeof mockLevels[0], lesson: typeof mockLevels[0]['lessons'][0]) => {
    if (checkLessonAvailability(lesson, level)) {
      router.push(`/app/recipe/${lesson.id}`);
    }
  };

  const getCategoryColor = (category: 'beginner' | 'intermediate' | 'advanced') => {
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