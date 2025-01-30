// src/types/index.ts

// Types pour l'authentification
export interface AuthFormData {
    email: string;
    password: string;
    dietaryPreferences?: string;
    allergies?: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    dietaryPreferences: string[];
    allergies: string[];
    xp: number;
    level: number;
    streak: number;
    completedLessons: string[];
    lastLoginDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Types pour les leçons et l'apprentissage
export interface Lesson {
    id: string;
    name: string;
    completed: boolean;
    description: string;
    xpReward: number;
    duration: number; // en minutes
    requirements?: string[]; // IDs des leçons prérequises 
    ingredients?: string[];
    steps?: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    region?: string; // région d'origine de la recette
    estimatedTime?: number; // temps de préparation en minutes
    unlockRequirements?: {
        level?: number;
        xp?: number;
        completedLessons?: number[];
    };
}

export interface Level {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    unlocked: boolean;
    requiredXP: number;
    order: number;
    category: 'beginner' | 'intermediate' | 'advanced';
    rewards?: {
        xp: number;
        badges?: string[];
        unlocks?: string[];
    };
}

// Types pour la progression
export interface Progress {
    userId: string;
    lessonId: number;
    completed: boolean;
    startedAt: Date;
    completedAt?: Date;
    score?: number;
    attempts: number;
    timeSpent: number; // en secondes
}

// Types pour les badges et récompenses
export interface Badge {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    requirements: {
        lessons?: number[];
        xp?: number;
        streak?: number;
    };
}

// Types pour les préférences utilisateur
export interface UserPreferences {
    userId: string;
    language: string;
    notifications: {
        daily: boolean;
        weeklyProgress: boolean;
        achievements: boolean;
        newContent: boolean;
    };
    dietaryRestrictions: string[];
    allergies: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    preferredRegions: string[];
}

// Types pour les statistiques
export interface UserStats {
    userId: string;
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    completedLessons: number;
    totalTimeSpent: number; // en minutes
    averageScore: number;
    badges: string[];
    lastActive: Date;
}

export interface Step {
    id: string;
    description: string;
    duration: number;
    tips?: string;
    image?: string;
}

// src/types/auth.ts
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    level: number;
    xp: number;
    streak: number;
    completedLessons: string[];
    dietaryPreferences: string[];
    allergies: string[];
    lastLoginDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

// src/types/index.ts
export interface LearningProgress {
    lessonId: number;
    completedStages: string[];
    quiz: {
        score: number;
        completedAt: Date;
    };
    lastAccessed: Date;
}


// src/types/index.ts
export interface CulturalVariation {
    region?: string;
    description: string;
    ingredients?: string[];
}

export interface CulturalInfo {
    region: string;
    ethnicity: string;
    occasions: string[];
    culturalSignificance: string;
    history?: string;
    variations?: CulturalVariation[];
}

export interface CookingStep extends Step {
    category: 'preparation' | 'mainCooking' | 'sauce' | 'assembly';
    ingredients: string[]; // IDs des ingrédients utilisés à cette étape
    criticalPoints?: string[]; // Points importants à surveiller
    temperature?: number;
    equipmentNeeded?: string[];
}

export interface HealthInfo {
    benefits: string[];
    caloriesPerServing: number;
    nutritionalHighlights: string[];
    dietaryConsiderations: string[];
}

export interface RecipeIngredient {
    name: string;
    quantity: string;
    unit: string;
    isOptional: boolean;
    category: 'main' | 'sauce' | 'accompaniment';
    seasonalityInfo?: {
        bestSeasons: ('spring' | 'summer' | 'autumn' | 'winter')[];
        notes?: string;
    };
    nutritionalInfo?: {
        caloriesPer100g: number;
        proteinsPer100g: number;
        carbohydratesPer100g: number;
        lipidsPer100g: number;
    };
    substitutes?: string[];
    preparationNotes?: string;
    storageInstructions?: string;
}


export interface Recipe {
    id: string;
    title: string;
    name: string; // Pour compatibilité avec l'affichage
    alternateName?: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    region: string;
    duration: number;
    imageUrl?: string;
    videoUrl?: string; // Ajout pour les tutoriels vidéo
    unlocked: boolean;
    progress: number;
    description: string;
    healthInfo: HealthInfo;
    culturalInfo: CulturalInfo;
    ingredients: {
        main: RecipeIngredient[];
        sauce?: RecipeIngredient[];
        accompaniment?: RecipeIngredient[];
    };
    steps: {
        preparation: CookingStep[];
        mainCooking: CookingStep[];
        sauce?: CookingStep[];
        assembly: CookingStep[];
    };
    requiredLevel?: number;
    xpReward: number;
    nutritionFacts: {
        perServing: {
            calories: number;
            proteins: number;
            lipids: number;
            carbohydrates: number;
            fiber: number;
            vitamins?: Record<string, number>;
            minerals?: Record<string, number>;
        };
        totalRecipe?: {
            calories: number;
            proteins: number;
            lipids: number;
            carbohydrates: number;
            fiber: number;
        };
    };

    tips: {
        preparation?: string[];
        cooking?: string[];
        storage?: string[];
        reheating?: string[];
    };

    substitutions: {
        ingredient: string;
        alternatives: {
            name: string;
            proportion: string;
            notes?: string;
        }[];
    }[];
    // Métadonnées supplémentaires
    complexity: {
        techniqueLevel: 'beginner' | 'intermediate' | 'advanced';
        equipmentNeeded: string[];
        criticalSteps: number[];
    };

    seasonality?: {
        bestMonths: number[];
        availableAllYear: boolean;
    };

    servings: {
        min: number;
        max: number;
        defaultSize: number;
    };
    prepTime: number; // Temps de préparation spécifique
    cookTime: number; // Temps de cuisson spécifique
    totalTime: number; // Temps total (prep + cuisson)
    category?: string; // Pour catégoriser les recettes (entrée, plat, dessert, etc.)
    tags?: string[]; // Pour le filtrage et la recherche
    rating?: {
        average: number;
        count: number;
    };
    status?: 'not_started' | 'in_progress' | 'completed'; // Pour suivre l'état de la recette
}



// src/types/meal.ts
export interface Ingredient {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
    nutritionFacts: {
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        vitamins: Record<string, number>;
        minerals: Record<string, number>;
    };
    seasonality?: {
        start: number;
        end: number;
    };
    allergens?: string[];
}

export interface NutritionalInfo {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
    servingSize: string;
}

export interface RecipeSuggestion {
    recipe: Recipe;
    nutritionalMatch: number;
    missingIngredients: {
        name: string;
        quantity: string;
    }[];
    totalTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    unlocked: boolean;
    requiredLevel?: number;
}