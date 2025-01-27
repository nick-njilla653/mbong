// src/navigation/GamificationRoutes.tsx
import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { 
  IonRouterOutlet, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonIcon,
  IonButton
} from '@ionic/react';
import { trophy, flame, star, ribbonOutline } from 'ionicons/icons';
import { StreakTracker } from '../components/gamification/StreakTracker';
import { useGamification } from '../contexts/GamificationContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/gamification.css';

const AchievementsPage: React.FC = () => {
  const { achievements } = useGamification();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Succès</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="p-4 space-y-4">
          {achievements.map((achievement) => (
            <IonCard key={achievement.id} className={achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}>
              <IonCardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <IonIcon icon={ribbonOutline} className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold">{achievement.title}</h3>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <p className="text-gray-600">{achievement.description}</p>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

const LevelProgressPage: React.FC = () => {
  const { user } = useAuth();
  const currentLevel = Math.floor(user?.xp || 0 / 100);
  const nextLevelXP = (currentLevel + 1) * 100;
  const progress = ((user?.xp || 0) % 100);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Progression</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="p-4">
          <IonCard>
            <IonCardContent>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Niveau {currentLevel}</h2>
                <p className="text-gray-600">XP total : {user?.xp || 0}</p>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full mb-4">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                {nextLevelXP - (user?.xp || 0)} XP jusqu'au niveau suivant
              </p>
            </IonCardContent>
          </IonCard>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <IonCard>
                <IonCardContent className="text-center">
                  <IonIcon icon={trophy} className="w-8 h-8 text-yellow-500 mb-2" />
                  <h4 className="font-bold">{user?.completedLessons?.length || 0}</h4>
                  <p className="text-sm text-gray-600">Recettes maîtrisées</p>
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardContent className="text-center">
                  <IonIcon icon={flame} className="w-8 h-8 text-orange-500 mb-2" />
                  <h4 className="font-bold">{user?.streak || 0} jours</h4>
                  <p className="text-sm text-gray-600">Série actuelle</p>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export const GamificationRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route exact path="/app/gamification" render={() => <LevelProgressPage />} />
      <Route exact path="/app/gamification/achievements" component={AchievementsPage} />
      <Route exact path="/app/gamification/streak" component={StreakTracker} />
    </IonRouterOutlet>
  );
};

export default GamificationRoutes;