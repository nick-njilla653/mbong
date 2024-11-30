import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonImg,
  useIonRouter
} from '@ionic/react';
import { restaurantOutline, arrowForward } from 'ionicons/icons';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {

  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader className="welcome-header">
        <IonToolbar>
          <IonTitle className="ion-text-center">Mbong</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="welcome-content">
        <div className="welcome-container">
          <IonCard className="welcome-type-card">
            <div className="logo-container">
              <IonIcon
                icon={restaurantOutline}
                className="welcome-logo-icon"
              />
            </div>

            <div className="welcome-text">
              <h1>Bienvenue sur Mbong</h1>
              <p>
                Découvrez des repas équilibrés adaptés
                à vos préférences et à votre style de vie
              </p>
            </div>

            <div className="features-container">
              <div className="feature-item">
                <div className="feature-circle">
                  🥗
                </div>
                <p>Repas équilibrés</p>
              </div>
              <div className="feature-item">
                <div className="feature-circle">
                  🎯
                </div>
                <p>Personnalisé pour vous</p>
              </div>
              <div className="feature-item">
                <div className="feature-circle">
                  🤖
                </div>
                <p>IA intelligente</p>
              </div>
            </div>

            <IonButton
              className="start-button"
              expand="block"
              onClick={() => router.push('/PreferencesPage')}
            >
              Commencer
              <IonIcon icon={arrowForward} slot="end" />
            </IonButton>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
