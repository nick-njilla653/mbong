// src/services/recipe.service.ts
import { PrismaClient, Prisma, Recipe } from '@prisma/client';
import { z } from 'zod';

// Schéma de validation pour la création/mise à jour de recette
const RecipeSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  region: z.string(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  
  culturalContext: z.object({
    communities: z.array(z.string()).optional(),
    historicalOrigin: z.string().optional(),
    socialContext: z.string().optional(),
    sharingTradition: z.string().optional()
  }).optional(),

  preparationDetails: z.object({
    preparationTime: z.number().int().positive().optional(),
    cookingTime: z.number().int().positive().optional(),
    difficultyNotes: z.string().optional()
  }).optional(),

  nutritionalProfile: z.object({
    macronutrients: z.object({
      proteins: z.number().nonnegative(),
      lipids: z.number().nonnegative(),
      carbs: z.number().nonnegative(),
      fibers: z.number().nonnegative()
    }),
    healthBenefits: z.array(z.string()).optional()
  }).optional(),

  dietaryOptions: z.object({
    vegetarianVariations: z.array(z.string()).optional(),
    localSubstitutions: z.record(z.array(z.string())).optional()
  }).optional(),

  ingredients: z.object({
    main: z.array(z.object({
      name: z.string(),
      quantity: z.string(),
      unit: z.string().optional()
    })),
    sauce: z.array(z.object({
      name: z.string(),
      quantity: z.string(),
      unit: z.string().optional()
    })).optional()
  }),

  steps: z.object({
    preparation: z.array(z.object({
      order: z.number().int(),
      description: z.string()
    })),
    mainCooking: z.array(z.object({
      order: z.number().int(),
      description: z.string()
    })),
    assembly: z.array(z.object({
      order: z.number().int(),
      description: z.string()
    }))
  })
});

export class RecipeService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Créer une nouvelle recette
  async createRecipe(recipeData: z.infer<typeof RecipeSchema>) {
    try {
      // Validation des données
      const validatedData = RecipeSchema.parse(recipeData);

      // Création de la recette
      const recipe = await this.prisma.recipe.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          region: validatedData.region,
          difficulty: validatedData.difficulty,
          
          // Utilisation de JSON pour les champs complexes
          culturalInfo: validatedData.culturalContext as Prisma.JsonObject,
          preparationDetails: validatedData.preparationDetails as Prisma.JsonObject,
          nutritionFacts: validatedData.nutritionalProfile as Prisma.JsonObject,
          
          ingredients: validatedData.ingredients as Prisma.JsonObject,
          steps: validatedData.steps as Prisma.JsonObject
        }
      });

      return recipe;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors[0].message}`);
      }
      throw error;
    }
  }

  // Récupérer une recette par ID
  async getRecipeById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        regionalVariants: true // Inclusion des variantes régionales si elles existent
      }
    });

    if (!recipe) {
      throw new Error('Recette non trouvée');
    }

    return recipe;
  }

  // Rechercher des recettes
  async searchRecipes(params: {
    title?: string;
    region?: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    minPreparationTime?: number;
    maxPreparationTime?: number;
  }) {
    const { 
      title, 
      region, 
      difficulty, 
      minPreparationTime, 
      maxPreparationTime 
    } = params;

    const recipes = await this.prisma.recipe.findMany({
      where: {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        region: region ? { equals: region } : undefined,
        difficulty: difficulty ? { equals: difficulty } : undefined,
        preparationDetails: minPreparationTime || maxPreparationTime 
          ? {
              path: ['preparationTime'],
              gte: minPreparationTime,
              lte: maxPreparationTime
            } 
          : undefined
      },
      orderBy: { createdAt: 'desc' }
    });

    return recipes;
  }

  // Ajouter une variante régionale
  async addRegionalVariant(recipeId: string, variantData: {
    region: string;
    ingredients: Record<string, any>;
    technique?: string;
  }) {
    return this.prisma.recipeRegionalVariant.create({
      data: {
        recipeId,
        region: variantData.region,
        ingredients: variantData.ingredients as Prisma.JsonObject,
        technique: variantData.technique
      }
    });
  }

  // Mettre à jour une recette
  async updateRecipe(id: string, recipeData: Partial<z.infer<typeof RecipeSchema>>) {
    try {
      // Validation partielle des données
      const validatedData = RecipeSchema.partial().parse(recipeData);

      const updatedRecipe = await this.prisma.recipe.update({
        where: { id },
        data: {
          ...validatedData,
          // Conversion des champs complexes en JSON
          ...(validatedData.culturalContext && { 
            culturalInfo: validatedData.culturalContext as Prisma.JsonObject 
          }),
          ...(validatedData.preparationDetails && { 
            preparationDetails: validatedData.preparationDetails as Prisma.JsonObject 
          }),
          ...(validatedData.nutritionalProfile && { 
            nutritionFacts: validatedData.nutritionalProfile as Prisma.JsonObject 
          }),
          ...(validatedData.ingredients && { 
            ingredients: validatedData.ingredients as Prisma.JsonObject 
          }),
          ...(validatedData.steps && { 
            steps: validatedData.steps as Prisma.JsonObject 
          })
        }
      });

      return updatedRecipe;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors[0].message}`);
      }
      throw error;
    }
  }

  // Supprimer une recette
  async deleteRecipe(id: string) {
    return this.prisma.recipe.delete({
      where: { id }
    });
  }

  // Exemple de recherche culturelle avancée
  async findRecipesByCommunity(community: string) {
    return this.prisma.recipe.findMany({
      where: {
        culturalInfo: {
          path: ['communities'],
          array_contains: community
        }
      }
    });
  }
}

// Exemple d'utilisation
async function exampleUsage() {
  const recipeService = new RecipeService();

  // Création d'une recette (Mendim Mezon)
  const mendimMezon = await recipeService.createRecipe({
    title: "Mendim Mezon",
    description: "Plat traditionnel de l'Est Cameroun",
    region: "Est",
    difficulty: "MEDIUM",
    
    culturalContext: {
      communities: ["Maka", "Gbaya"],
      historicalOrigin: "Cuisine traditionnelle de l'Est Cameroun",
      socialContext: "Réunions familiales et communautaires"
    },
    
    preparationDetails: {
      preparationTime: 40,
      cookingTime: 45,
      difficultyNotes: "Nécessite de la patience pour la cuisson des tubercules"
    },
    
    nutritionalProfile: {
      macronutrients: {
        proteins: 18,
        lipids: 12,
        carbs: 50,
        fibers: 7
      },
      healthBenefits: [
        "Riche en fibres",
        "Source de protéines"
      ]
    },
    
    ingredients: {
      main: [
        { name: "Manioc", quantity: "500", unit: "g" },
        { name: "Gombo", quantity: "300", unit: "g" }
      ],
      sauce: [
        { name: "Huile de palme", quantity: "2", unit: "cuillères à soupe" }
      ]
    },
    
    steps: {
      preparation: [
        { order: 1, description: "Peler et couper les tubercules" }
      ],
      mainCooking: [
        { order: 1, description: "Faire cuire les tubercules" }
      ],
      assembly: [
        { order: 1, description: "Dresser et servir" }
      ]
    }
  });

  console.log(mendimMezon);
}

export default new RecipeService();