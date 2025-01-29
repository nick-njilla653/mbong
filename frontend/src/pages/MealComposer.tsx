// src/pages/MealComposer.tsx
import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import { nutrition, lockClosed, checkmarkCircle } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types';
import '../styles/meal-composer.css';


type MealType = 'breakfast' | 'lunch' | 'dinner';
type Ingredient = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  nutritionFacts: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
};

const MealComposer: React.FC = () => {
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [step, setStep] = useState<'type' | 'ingredients' | 'suggestions'>('type');
  const { user } = useAuth();
  const [present] = useIonToast();

  useEffect(() => {
    // Charger les ingrédients disponibles en fonction du type de repas
    loadIngredients(mealType);
  }, [mealType]);

  const loadIngredients = async (type: MealType) => {
    // Appel API pour obtenir les ingrédients par type de repas
    // et filtrer selon les préférences/restrictions de l'utilisateur
  };

  const handleIngredientSelect = (ingredientId: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientId) 
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const findRecipes = async () => {
    // Appel API pour obtenir les recettes suggérées
    // basées sur les ingrédients sélectionnés
    setStep('suggestions');
  };

  const renderMealTypeSelection = () => (
    <div className="p-4">
      <IonSegment value={mealType} onIonChange={e => setMealType(e.detail.value as MealType)}>
        <IonSegmentButton value="breakfast">
          <IonLabel>Petit déjeuner</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="lunch">
          <IonLabel>Déjeuner</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="dinner">
          <IonLabel>Dîner</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonButton expand="block" className="mt-4" onClick={() => setStep('ingredients')}>
        Continuer
      </IonButton>
    </div>
  );

  const renderIngredientSelection = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sélectionnez vos ingrédients</h2>
      <IonGrid>
        <IonRow>
          {availableIngredients.map(ingredient => (
            <IonCol size="6" sizeMd="4" key={ingredient.id}>
              <IonCard 
                className={`ingredient-card ${
                  selectedIngredients.includes(ingredient.id) ? 'selected' : ''
                }`}
                onClick={() => handleIngredientSelect(ingredient.id)}
              >
                <img src={ingredient.imageUrl} alt={ingredient.name} />
                <IonCardContent>
                  <h3 className="font-bold">{ingredient.name}</h3>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <IonButton 
        expand="block" 
        disabled={selectedIngredients.length === 0}
        onClick={findRecipes}
      >
        Trouver des recettes
      </IonButton>
    </div>
  );

  const renderRecipeSuggestions = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recettes suggérées</h2>
      {suggestedRecipes.map(recipe => (
        <IonCard key={recipe.id}>
          <img src={recipe.imageUrl} alt={recipe.title} />
          <IonCardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{recipe.title}</h3>
                <p className="text-sm text-gray-600">{recipe.description}</p>
              </div>
              {recipe.unlocked ? (
                <IonIcon icon={checkmarkCircle} className="text-green-600 w-6 h-6" />
              ) : (
                <IonIcon icon={lockClosed} className="text-gray-400 w-6 h-6" />
              )}
            </div>
            
            {recipe.unlocked ? (
              <>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Valeurs nutritionnelles</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Afficher les informations nutritionnelles */}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Ingrédients nécessaires</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{ingredient.name}</span>
                        <span className="text-gray-600">{ingredient.quantity} {ingredient.unit || ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="mt-4 text-center text-gray-600">
                <p>Débloquez cette recette en atteignant le niveau {recipe.requiredLevel}</p>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Composer un repas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {step === 'type' && renderMealTypeSelection()}
        {step === 'ingredients' && renderIngredientSelection()}
        {step === 'suggestions' && renderRecipeSuggestions()}
      </IonContent>
    </IonPage>
  );
};

export default MealComposer;