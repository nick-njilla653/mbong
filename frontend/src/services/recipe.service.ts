// src/services/recipe.service.ts
import { Step } from '../types';
import { Recipe } from '../types'



export class RecipeService {
  static async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch('/api/recipes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  static async getRecipeById(id: string): Promise<Recipe> {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recipe');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  }

  static async updateRecipeProgress(id: string, progress: number): Promise<void> {
    try {
      await fetch(`/api/recipes/${id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
        },
        body: JSON.stringify({ progress })
      });
    } catch (error) {
      console.error('Error updating recipe progress:', error);
      throw error;
    }
  }

  static async getProgress(id: string): Promise<number> {
    try {
      const response = await fetch(`/api/recipes/${id}/progress`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      return data.progress;
    } catch (error) {
      console.error('Error fetching recipe progress:', error);
      throw error;
    }
  }

  static async updateProgress(recipeId: number, stepId: number): Promise<void> {
    try {
      await fetch(`/api/recipes/${recipeId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stepId }),
      });
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de la progression');
    }
  }

  static async completeRecipe(recipeId: number, score: number): Promise<void> {
    try {
      await fetch(`/api/recipes/${recipeId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      });
    } catch (error) {
      throw new Error('Erreur lors de la validation de la recette');
    }
  }

  static getRecommendedRecipes(userPreferences: any): Promise<Recipe[]> {
    // Implémentation de la logique de recommandation
    return fetch('/api/recipes/recommended')
      .then(response => response.json())
      .catch(() => {
        throw new Error('Erreur lors du chargement des recommandations');
      });
  }
}














