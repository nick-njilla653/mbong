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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  useIonToast
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { restaurant, book, leaf, information, timerOutline, locationOutline } from 'ionicons/icons';
import { Card, CardContent } from '../components/ui/card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Recipe, CookingStep } from '../types';
import '../styles/RecipeDetails.css';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recipe' | 'cultural' | 'nutrition' | 'tips'>('recipe');
  const [present] = useIonToast();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
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

  const handleStepComplete = async (stepId: string) => {
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

  const renderRecipeContent = () => (
    <Card className="mb-4">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{recipe?.title}</h1>
            {recipe?.alternateName && (
              <p className="text-sm text-gray-500">Aussi connu sous : {recipe.alternateName.join(', ')}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <IonIcon icon={timerOutline} className="w-5 h-5 mr-1" />
              <span>{recipe?.totalTime} min</span>
            </div>
            <div className="flex items-center">
              <IonIcon icon={locationOutline} className="w-5 h-5 mr-1" />
              <span>{recipe?.region}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Ingrédients</h2>
          {Object.entries(recipe?.ingredients || {}).map(([category, ingredients]) => (
            <div key={category} className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="list-disc pl-5">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-1">
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                    {ingredient.isOptional && " (facultatif)"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Étapes</h2>
          {Object.entries(recipe?.steps || {}).map(([category, steps]) => (
            <div key={category} className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg mb-4 ${index === currentStep
                      ? 'bg-green-50 border-2 border-green-500'
                      : index < currentStep
                        ? 'bg-gray-50'
                        : 'bg-white'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p>{step.description}</p>
                        {step.tips && (
                          <p className="text-sm text-green-600 mt-2 bg-green-50 p-2 rounded">
                            💡 {step.tips}
                          </p>
                        )}
                        {step.criticalPoints && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            ⚠️ Points importants:
                            <ul className="list-disc pl-4 mt-1">
                              {step.criticalPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderNutritionalInfo = () => (
    <Card className="mb-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Valeurs nutritionnelles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(recipe?.nutritionFacts.perServing || {}).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {typeof value === 'number' ? value.toString() : JSON.stringify(value)}
              </div>
              <div className="text-sm text-gray-600">{key}</div>
            </div>
          ))}
        </div>
        {recipe?.healthInfo && (
          <div>
            <h3 className="font-semibold mb-2">Bénéfices santé</h3>
            <ul className="list-disc pl-5">
              {recipe.healthInfo.benefits.map((benefit: string, index: number) => (
                <li key={index} className="mb-1">{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCulturalInfo = () => (
    <Card className="mb-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Histoire et Culture</h2>
        <p className="mb-4">{recipe?.culturalInfo.culturalSignificance}</p>
        {recipe?.culturalInfo.history && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Histoire</h3>
            <p>{recipe.culturalInfo.history}</p>
          </div>
        )}
        {recipe?.culturalInfo.variations && (
          <div>
            <h3 className="font-semibold mb-2">Variantes régionales</h3>
            <div className="space-y-2">
              {recipe.culturalInfo.variations.map((variation, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{variation.region}</h4>
                  <p className="text-sm text-gray-600">{variation.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  if (!recipe) {
    return <div className="flex items-center justify-center h-screen">Recette non trouvée</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/learning" />
          </IonButtons>
          <IonTitle>{recipe.title}</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as any)}>
            <IonSegmentButton value="recipe">
              <IonIcon icon={restaurant} />
              <IonLabel>Recette</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cultural">
              <IonIcon icon={book} />
              <IonLabel>Culture</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="nutrition">
              <IonIcon icon={leaf} />
              <IonLabel>Nutrition</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {activeTab === 'recipe' && renderRecipeContent()}
        {activeTab === 'cultural' && renderCulturalInfo()}
        {activeTab === 'nutrition' && renderNutritionalInfo()}
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetails;