import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useHistory } from 'react-router';

const Home: React.FC = () => {

  const history = useHistory();

  const handleNavigationToWelcomePage = () => {
    history.push('/WelcomePage');
  };

  const handleNavigationToPreferencesPage = () => {
    history.push('/PreferencesPage');
  };

  const handleNavigationToMealSelection = () => {
    history.push('/MealSelection');
  };

  const handleNavigationToAIPage = () => {
    history.push('/AIPage');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <IonButton onClick={handleNavigationToWelcomePage}>Go to Welcome Page</IonButton>
        <IonButton onClick={handleNavigationToPreferencesPage}>Go to PreferncesPage</IonButton>
        <IonButton onClick={handleNavigationToMealSelection}>Go to MealSelection</IonButton>
        <IonButton onClick={handleNavigationToAIPage}>Go to AIPage</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
