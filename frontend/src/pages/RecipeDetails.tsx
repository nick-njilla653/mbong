// src/pages/RecipeDetails.tsx
import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton,
  IonTitle,
  useIonToast
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ProgressBar } from '../components/ui/ProgressBar';
import '../styles/RecipeDetails.css';

interface RecipeStep {
  id: number;
  description: string;
  image?: string;
  duration: number;
  completed: boolean;
}

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      // Simulation d'appel API
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      setRecipe(data);
      setLoading(false);
    } catch (error) {
      present({
        message: 'Erreur lors du chargement de la recette',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleStepComplete = async (stepId: number) => {
    try {
      await fetch(`/api/recipes/${id}/steps/${stepId}/complete`, {
        method: 'POST'
      });
      setCurrentStep(prev => prev + 1);
      present({
        message: 'Étape complétée !',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      present({
        message: 'Erreur lors de la validation de l\'étape',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/learning" />
          </IonButtons>
          <IonTitle>{recipe?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <Card className="mb-4">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{recipe?.name}</h1>
              <div className="text-sm text-gray-500">
                {recipe?.duration} min • {recipe?.difficulty}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Ingrédients</h2>
              <ul className="list-disc pl-5">
                {recipe?.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="mb-1">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Étapes</h2>
              {recipe?.steps.map((step: RecipeStep, index: number) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg mb-4 ${
                    index === currentStep
                      ? 'bg-green-50 border-2 border-green-500'
                      : index < currentStep
                      ? 'bg-gray-50'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <p>{step.description}</p>
                    </div>
                    {index === currentStep && (
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Terminer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetails;