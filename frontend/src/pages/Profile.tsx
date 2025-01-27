// src/pages/Profile.tsx
import React from 'react';
import {
  IonPage,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonCard,
  IonCardContent,
  IonButton,
  useIonToast
} from '@ionic/react';
import { trophy, flame, book, ribbon, time, star } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import '../styles/Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { achievements, streak } = useGamification();
  const [present] = useIonToast();

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;
  const calculateProgress = (xp: number) => (xp % 100);

  if (!user) {
    return <div>Chargement...</div>;
  }

  const level = calculateLevel(user.xp);
  const progress = calculateProgress(user.xp);

  const stats = [
    {
      icon: trophy,
      value: level,
      label: 'Niveau',
      color: 'text-yellow-500'
    },
    {
      icon: flame,
      value: streak.current,
      label: 'Série',
      color: 'text-orange-500'
    },
    {
      icon: book,
      value: user.completedLessons.length,
      label: 'Recettes',
      color: 'text-blue-500'
    },
    {
      icon: star,
      value: achievements.length,
      label: 'Succès',
      color: 'text-purple-500'
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profil</IonTitle>
          {/* <IonButtons slot="end">
            <IonButton onClick={handleLogout} color="danger">
              Déconnexion
            </IonButton>
          </IonButtons> */}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* En-tête du profil */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name || user.email}</h2>
              <p className="text-gray-600">Niveau {level} • {user.xp} XP</p>
            </div>
          </div>
          
          <IonCard>
            <IonCardContent>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Progression niveau {level}</span>
                  <span className="text-sm text-gray-600">{progress}/100 XP</span>
                </div>
                <ProgressBar progress={progress} className="h-2" />
              </div>
              <p className="text-sm text-gray-500">
                {100 - progress} XP jusqu'au niveau {level + 1}
              </p>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <IonCard key={index} className="text-center">
              <IonCardContent>
                <IonIcon 
                  icon={stat.icon} 
                  className={`w-8 h-8 mb-2 ${stat.color}`}
                />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        {/* Succès débloqués */}
        <h3 className="text-lg font-bold mb-4">Succès débloqués</h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <IonCard key={achievement.id} className={achievement.unlocked ? '' : 'opacity-50'}>
              <IonCardContent>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <IonIcon icon={ribbon} className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;


