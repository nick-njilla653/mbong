// src/controllers/recipe.controller.ts
import { Request, Response } from 'express';
import { PrismaClient, Prisma, Difficulty } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Tipos manuels pour remplacer les types Prisma non résolus
type JsonObject = { [key: string]: any };
type RecipeWhereInput = {
    region?: string;
    difficulty?: Difficulty;
    tags?: { hasSome?: string[] };
    // Adicione outros campos conforme necessário
  };
type EnumDifficultyFilter = 'EASY' | 'MEDIUM' | 'HARD';

// Schéma de validation pour l'ajout/mise à jour de recette
const RecipeSchema = z.object({
    title: z.string().min(2, "Le titre est trop court").max(100, "Le titre est trop long"),
    description: z.string().min(10, "La description est trop courte").max(500, "La description est trop longue"),
    region: z.string(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
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
      })).optional(),
      accompaniment: z.array(z.object({
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
    }),
    culturalInfo: z.object({
      origin: z.string().optional(),
      significance: z.string().optional(),
      occasions: z.array(z.string()).optional()
    }).optional(),
    nutritionFacts: z.object({
      calories: z.number().positive(),
      proteins: z.number().nonnegative(),
      carbs: z.number().nonnegative(),
      fats: z.number().nonnegative()
    }).optional(),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional()
  });
  
  // Schéma pour l'ajout de commentaire
  const CommentSchema = z.object({
    content: z.string().min(1, "Le commentaire ne peut pas être vide").max(500, "Le commentaire est trop long"),
    rating: z.number().int().min(1, "La note minimale est 1").max(5, "La note maximale est 5")
  });

  export class RecipeController {
    // Récupérer toutes les recettes
    static async getAllRecipes(req: Request, res: Response) {
      try {
        const { page = 1, limit = 10 } = req.query;
  
        const recipes = await prisma.recipe.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        });
  
        const total = await prisma.recipe.count();
  
        res.json({
          recipes,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          message: 'Erreur lors de la récupération des recettes',
          error: error instanceof Error ? error.message : error
        });
      }
    }
  
    // Récupérer une recette par ID
    static async getRecipeById(req: Request, res: Response) {
      try {
        const { id } = req.params;
  
        const recipe = await prisma.recipe.findUnique({
          where: { id },
          include: {
            comments: true
          }
        });
  
        if (!recipe) {
          return res.status(404).json({ message: 'Recette non trouvée' });
        }
  
        res.json(recipe);
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          message: 'Erreur lors de la récupération de la recette',
          error: error instanceof Error ? error.message : error
        });
      }
    }
  
    // Récupérer les recettes par région
    static async getRecipesByRegion(req: Request, res: Response) {
      try {
        const { region } = req.params;
  
        const recipes = await prisma.recipe.findMany({
          where: { region }
        });
  
        res.json(recipes);
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          message: 'Erreur lors de la récupération des recettes par région',
          error: error instanceof Error ? error.message : error
        });
      }
    }
  
    // Récupérer les recettes par difficulté
    static async getRecipesByDifficulty(req: Request, res: Response) {
      try {
        const { difficulty } = req.params;
  
        const recipes = await prisma.recipe.findMany({
          where: { difficulty: difficulty as EnumDifficultyFilter }
        });
  
        res.json(recipes);
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          message: 'Erreur lors de la récupération des recettes par difficulté',
          error: error instanceof Error ? error.message : error
        });
      }
    }
  
    // Mise à jour d'une recette
    static async updateRecipe(req: Request, res: Response) {
      try {
        const { id } = req.params;
        
        // Validation partielle des données
        const validatedData = RecipeSchema.partial().parse(req.body);
  
        const recipe = await prisma.recipe.update({
          where: { id },
          data: {
            ...validatedData,
            // Conversion des champs complexes
            ...(validatedData.ingredients && { 
              ingredients: validatedData.ingredients as JsonObject 
            }),
            ...(validatedData.steps && { 
              steps: validatedData.steps as JsonObject 
            }),
            ...(validatedData.culturalInfo && { 
              culturalInfo: validatedData.culturalInfo as JsonObject 
            }),
            ...(validatedData.nutritionFacts && { 
              nutritionFacts: validatedData.nutritionFacts as JsonObject 
            })
          }
        });
  
        res.json({
          message: 'Recette mise à jour avec succès',
          recipe
        });
      } catch (error) {
        console.error(error);
        
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: 'Erreur de validation',
            errors: error.errors
          });
        }
  
        res.status(500).json({ 
          message: 'Erreur lors de la mise à jour de la recette',
          error: error instanceof Error ? error.message : error
        });
      }
    }
  
    // Suppression d'une recette
    static async deleteRecipe(req: Request, res: Response) {
      try {
        const { id } = req.params;
  
        await prisma.recipe.delete({
          where: { id }
        });
  
        res.json({ message: 'Recette supprimée avec succès' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          message: 'Erreur lors de la suppression de la recette',
          error: error instanceof Error ? error.message : error
        });
      }
    }

  // Recherche de recettes avec filtres avancés
  static async searchRecipes(req: Request, res: Response) {
    try {
      const { 
        region, 
        difficulty, 
        minCalories, 
        maxCalories, 
        tags, 
        page = 1, 
        limit = 10 
      } = req.query;

      const where: Prisma.RecipeWhereInput = {};

      // Filtres
      if (region) where.region = region as string;
      if (difficulty) where.difficulty = difficulty as Prisma.EnumDifficultyFilter;
      
      // Filtres nutritionnels
      if (minCalories || maxCalories) {
        where.nutritionFacts = {
          path: ['calories'],
          gte: minCalories ? Number(minCalories) : undefined,
          lte: maxCalories ? Number(maxCalories) : undefined
        };
      }

      // Filtres de tags
      if (tags) {
        where.tags = {
          hasSome: (tags as string).split(',')
        };
      }

      // Récupération des recettes
      const recipes = await prisma.recipe.findMany({
        where,
        include: {
          _count: {
            select: { comments: true }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      });

      // Comptage total
      const total = await prisma.recipe.count({ where });

      res.json({
        recipes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors de la recherche de recettes',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Ajout de commentaire et notation
  static async addComment(req: Request, res: Response) {
    try {
      const { recipeId } = req.params;
      const userId = req.user!.id;

      // Validation des données
      const validatedData = CommentSchema.parse(req.body);

      // Vérifier si la recette existe
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId }
      });

      if (!recipe) {
        return res.status(404).json({ message: 'Recette non trouvée' });
      }

      // Ajout du commentaire
      const comment = await prisma.recipeComment.create({
        data: {
          recipeId,
          userId,
          content: validatedData.content,
          rating: validatedData.rating
        },
        include: {
          user: {
            select: {
              username: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      // Calcul de la note moyenne
      const recipeRatings = await prisma.recipeComment.aggregate({
        where: { recipeId },
        _avg: { rating: true }
      });

      // Mise à jour de la note moyenne de la recette
      await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          averageRating: recipeRatings._avg.rating || 0
        }
      });

      res.status(201).json({
        message: 'Commentaire ajouté avec succès',
        comment
      });
    } catch (error) {
      console.error(error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Erreur de validation',
          errors: error.errors
        });
      }

      res.status(500).json({ 
        message: 'Erreur lors de l\'ajout du commentaire',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Système de recommandation de base
  static async getRecommendedRecipes(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      // Récupérer les tags des recettes précédemment aimées
      const likedRecipes = await prisma.completedRecipe.findMany({
        where: { userId },
        include: {
          recipe: {
            select: { tags: true, region: true, difficulty: true }
          }
        }
      });

      // Extraire les tags et régions fréquents
      const tagFrequency: { [key: string]: number } = {};
      const regionFrequency: { [key: string]: number } = {};
      let preferredDifficulty = 'MEDIUM';

      likedRecipes.forEach(lr => {
        lr.recipe.tags?.forEach(tag => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
        regionFrequency[lr.recipe.region] = (regionFrequency[lr.recipe.region] || 0) + 1;
        
        // Déterminer la difficulté préférée
        if (lr.recipe.difficulty) preferredDifficulty = lr.recipe.difficulty;
      });

      // Trouver les tags et régions les plus fréquents
      const topTags = Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

      const topRegion = Object.entries(regionFrequency)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      // Rechercher des recettes recommandées
      const recommendedRecipes = await prisma.recipe.findMany({
        where: {
          OR: [
            { tags: { hasSome: topTags } },
            { region: topRegion || undefined },
            { difficulty: preferredDifficulty }
          ],
          NOT: {
            completedRecipes: {
              some: { userId }
            }
          }
        },
        take: 5
      });

      res.json({
        message: 'Recettes recommandées',
        recipes: recommendedRecipes,
        recommendationBasis: {
          topTags,
          topRegion,
          preferredDifficulty
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors de la recommandation de recettes',
        error: error instanceof Error ? error.message : error
      });
    }
  }
}

export default RecipeController;