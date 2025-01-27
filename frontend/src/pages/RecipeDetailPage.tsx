// src/pages/RecipeDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { timer, checkmark, ribbon, time } from 'ionicons/icons';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../types';
import RecipeSteps from '../components/features/recipe/RecipeSteps';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import '../styles/RecipeDetailPage.css';


const RecipeDetailPage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const { user } = useAuth();
  const { updateProgress } = useGamification();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const recipeData = await RecipeService.getRecipeById(id);
      setRecipe(recipeData);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async (stepIndex: number) => {
    if (!recipe) return;

    try {
      setCurrentStep(stepIndex + 1);
      await RecipeService.updateRecipeProgress(id, ((stepIndex + 1) / recipe.steps.length) * 100);

      if (stepIndex + 1 === recipe.steps.length) {
        // La recette est terminée
        await updateProgress(id, 'completed');
        // Rediriger vers le quiz ou la page de félicitations
        router.push(`/app/recipe/${id}/quiz`);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IonSpinner />
      </div>
    );
  }

  if (!recipe) {
    return <div>Recette non trouvée</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/learning" />
          </IonButtons>
          <IonTitle>{recipe.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => router.push(`/app/recipe/${id}/info`)}>
              <IonIcon slot="icon-only" icon={ribbon} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          {/* En-tête de la recette */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <IonIcon icon={time} className="w-5 h-5 mr-1" />
                <span>{recipe.duration} min</span>
              </div>
              <div className="flex items-center">
                <IonIcon icon={ribbon} className="w-5 h-5 mr-1" />
                <span>{recipe.difficulty}</span>
              </div>
              {recipe.region && (
                <div className="px-2 py-1 bg-green-100 rounded-full text-green-800 text-sm">
                  {recipe.region}
                </div>
              )}
            </div>
          </div>

          {/* Liste des ingrédients */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Ingrédients</h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Étapes de la recette */}
          <div>
            <h2 className="text-xl font-bold mb-3">Instructions</h2>
            <RecipeSteps
              steps={recipe.steps || []}
              currentStep={currentStep}
              onStepComplete={handleStepComplete}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetailPage;