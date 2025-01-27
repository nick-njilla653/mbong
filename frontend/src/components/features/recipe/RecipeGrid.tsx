// src/components/recipe/RecipeGrid.tsx
import React from 'react';
import { IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, useIonRouter } from '@ionic/react';
import { lockClosed, checkmarkCircle } from 'ionicons/icons';
import { ProgressBar } from '../../ui/ProgressBar';
import { LearningService } from '../../../services/learning.service'
import '../../../styles/recipes.css';

interface Recipe {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  region: string;
  duration: number;
  imageUrl?: string;
  unlocked: boolean;
  progress: number;
}

interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeSelect: (recipeId: string) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onRecipeSelect }) => {
  const router = useIonRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    if (recipe.unlocked) {
      onRecipeSelect(recipe.id);
      router.push(`/app/recipe/${recipe.id}`);
    }
  };

  return (
    <IonGrid>
      <IonRow>
        {recipes.map((recipe) => (
          <IonCol size="12" sizeMd="6" key={recipe.id}>
            <IonCard 
              className={`relative overflow-hidden transition-transform duration-200 ${
                recipe.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-75'
              }`}
              onClick={() => handleRecipeClick(recipe)}
            >
              <div className="relative h-48 bg-gray-200">
                {recipe.imageUrl ? (
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">🍲</span>
                  </div>
                )}
                {!recipe.unlocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <IonIcon icon={lockClosed} className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              <IonCardContent>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{recipe.title}</h3>
                  {recipe.progress === 100 && (
                    <IonIcon icon={checkmarkCircle} className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <div className="mb-4">
                  <p className={`text-sm ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {recipe.region} • {recipe.duration} min
                  </p>
                </div>

                {recipe.unlocked && (
                  <ProgressBar 
                    progress={recipe.progress} 
                    className="h-2"
                  />
                )}
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};

export default RecipeGrid;