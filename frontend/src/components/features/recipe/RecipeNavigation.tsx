
// src/components/recipe/RecipeNavigation.tsx
import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';

interface RecipeNavigationProps {
  title: string;
}

const RecipeNavigation: React.FC<RecipeNavigationProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const navigateToSteps = () => history.push(`/recipe/${id}/steps`);
  const navigateToQuiz = () => history.push(`/recipe/${id}/quiz`);

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/app/learning" />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <button 
            onClick={navigateToSteps}
            className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg"
          >
            Étapes
          </button>
          <button 
            onClick={navigateToQuiz}
            className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg ml-2"
          >
            Quiz
          </button>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default RecipeNavigation;