// src/services/meal.service.ts
import { Recipe, Ingredient } from '../types';

interface MealSuggestion {
  recipe: Recipe;
  missingIngredients: {
    name: string;
    quantity: string;
  }[];
  nutritionMatch: number; // Pourcentage de correspondance avec les besoins nutritionnels
}

export class MealService {
  static async getIngredientsByMealType(
    mealType: 'breakfast' | 'lunch' | 'dinner',
    userPreferences: {
      dietaryRestrictions: string[];
      allergies: string[];
    }
  ): Promise<Ingredient[]> {
    try {
      const response = await fetch(`/api/ingredients/${mealType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userPreferences)
      });
      
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }

  static async getSuggestedRecipes(
    selectedIngredients: string[],
    userPreferences: {
      dietaryRestrictions: string[];
      allergies: string[];
    },
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ): Promise<MealSuggestion[]> {
    try {
      const response = await fetch('/api/recipes/suggest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          preferences: userPreferences,
          mealType
        })
      });
      
      if (!response.ok) throw new Error('Failed to get recipe suggestions');
      return await response.json();
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      throw error;
    }
  }

  static calculateNutritionalValue(ingredients: Ingredient[]): {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  } {
    // Calculer les valeurs nutritionnelles totales
    return ingredients.reduce((acc, ingredient) => ({
      calories: acc.calories + ingredient.nutritionFacts.calories,
      proteins: acc.proteins + ingredient.nutritionFacts.proteins,
      carbs: acc.carbs + ingredient.nutritionFacts.carbs,
      fats: acc.fats + ingredient.nutritionFacts.fats,
      vitamins: this.mergeNutrients(acc.vitamins, ingredient.nutritionFacts.vitamins),
      minerals: this.mergeNutrients(acc.minerals, ingredient.nutritionFacts.minerals)
    }), {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      vitamins: {},
      minerals: {}
    });
  }

  private static mergeNutrients(
    acc: Record<string, number>, 
    current: Record<string, number>
  ): Record<string, number> {
    const result = { ...acc };
    for (const [key, value] of Object.entries(current)) {
      result[key] = (result[key] || 0) + value;
    }
    return result;
  }
}