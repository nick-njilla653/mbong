// src/pages/Settings.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonButton,
  useIonToast,
  IonIcon,
  IonNote
} from '@ionic/react';
import {
  notifications,
  language,
  speedometer,
  colorPalette,
  volumeHigh,
  nutrition,
  logOut
} from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Settings.css';

interface UserSettings {
  notifications: {
    dailyReminder: boolean;
    achievements: boolean;
    tips: boolean;
  };
  preferences: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    language: 'fr' | 'en';
    theme: 'light' | 'dark' | 'system';
    sound: boolean;
    dietaryRestrictions: string[];
  };
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [present] = useIonToast();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      dailyReminder: true,
      achievements: true,
      tips: true
    },
    preferences: {
      difficulty: 'intermediate',
      language: 'fr',
      theme: 'system',
      sound: true,
      dietaryRestrictions: []
    }
  });

  const handleNotificationChange = (key: keyof UserSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePreferenceChange = (key: keyof UserSettings['preferences'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      present({
        message: 'Déconnexion réussie',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      present({
        message: 'Erreur lors de la déconnexion',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Ici, vous appelleriez votre API pour sauvegarder les paramètres
      await new Promise(resolve => setTimeout(resolve, 1000));
      present({
        message: 'Paramètres sauvegardés',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      present({
        message: 'Erreur lors de la sauvegarde',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Paramètres</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Section Notifications */}
        <IonList className="settings-section">
          <IonItem className="section-header">
            <IonIcon icon={notifications} slot="start" color="primary" />
            <IonLabel>Notifications</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Rappel quotidien</IonLabel>
            <IonToggle
              checked={settings.notifications.dailyReminder}
              onIonChange={() => handleNotificationChange('dailyReminder')}
            />
          </IonItem>

          <IonItem>
            <IonLabel>Succès débloqués</IonLabel>
            <IonToggle
              checked={settings.notifications.achievements}
              onIonChange={() => handleNotificationChange('achievements')}
            />
          </IonItem>

          <IonItem>
            <IonLabel>Astuces et conseils</IonLabel>
            <IonToggle
              checked={settings.notifications.tips}
              onIonChange={() => handleNotificationChange('tips')}
            />
          </IonItem>
        </IonList>

        {/* Section Préférences */}
        <IonList className="settings-section">
          <IonItem className="section-header">
            <IonIcon icon={speedometer} slot="start" color="primary" />
            <IonLabel>Préférences d'apprentissage</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Niveau de difficulté</IonLabel>
            <IonSelect
              value={settings.preferences.difficulty}
              onIonChange={e => handlePreferenceChange('difficulty', e.detail.value)}
            >
              <IonSelectOption value="beginner">Débutant</IonSelectOption>
              <IonSelectOption value="intermediate">Intermédiaire</IonSelectOption>
              <IonSelectOption value="advanced">Avancé</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonIcon icon={language} slot="start" />
            <IonLabel>Langue</IonLabel>
            <IonSelect
              value={settings.preferences.language}
              onIonChange={e => handlePreferenceChange('language', e.detail.value)}
            >
              <IonSelectOption value="fr">Français</IonSelectOption>
              <IonSelectOption value="en">English</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonIcon icon={colorPalette} slot="start" />
            <IonLabel>Thème</IonLabel>
            <IonSelect
              value={settings.preferences.theme}
              onIonChange={e => handlePreferenceChange('theme', e.detail.value)}
            >
              <IonSelectOption value="light">Clair</IonSelectOption>
              <IonSelectOption value="dark">Sombre</IonSelectOption>
              <IonSelectOption value="system">Système</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonIcon icon={volumeHigh} slot="start" />
            <IonLabel>Sons</IonLabel>
            <IonToggle
              checked={settings.preferences.sound}
              onIonChange={() => handlePreferenceChange('sound', !settings.preferences.sound)}
            />
          </IonItem>
        </IonList>

        {/* Section Restrictions alimentaires */}
        <IonList className="settings-section">
          <IonItem className="section-header">
            <IonIcon icon={nutrition} slot="start" color="primary" />
            <IonLabel>Restrictions alimentaires</IonLabel>
          </IonItem>

          <IonItem>
            <IonSelect
              multiple={true}
              value={settings.preferences.dietaryRestrictions}
              onIonChange={e => handlePreferenceChange('dietaryRestrictions', e.detail.value)}
            >
              <IonSelectOption value="vegetarian">Végétarien</IonSelectOption>
              <IonSelectOption value="vegan">Végan</IonSelectOption>
              <IonSelectOption value="gluten-free">Sans gluten</IonSelectOption>
              <IonSelectOption value="dairy-free">Sans lactose</IonSelectOption>
              <IonSelectOption value="nut-free">Sans arachides</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        {/* Section Compte */}
        <IonList className="settings-section">
          <IonItem className="section-header">
            <IonLabel>Compte</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <h2>Email</h2>
              <IonNote>{user?.email}</IonNote>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonButton
              expand="block"
              color="danger"
              onClick={handleLogout}
              className="ion-margin-vertical"
            >
              <IonIcon icon={logOut} slot="start" />
              Déconnexion
            </IonButton>
          </IonItem>
        </IonList>

        {/* Bouton de sauvegarde */}
        <div className="ion-padding">
          <IonButton expand="block" onClick={handleSaveSettings}>
            Enregistrer les modifications
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;