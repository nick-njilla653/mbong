// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour du profil
const ProfileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(500).optional(),
  region: z.string().optional(),
  dietaryPreferences: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    allergies: z.array(z.string()).optional()
  }).optional()
});

export class UserController {
  // Récupérer le profil complet de l'utilisateur
  static async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          stats: true,
          dietaryPreferences: true,
          userRecipes: {
            include: {
              recipe: true
            }
          },
          completedRecipes: {
            include: {
              recipe: true
            }
          },
          learningPaths: {
            include: {
              learningPath: {
                include: {
                  items: {
                    include: {
                      recipe: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Masquer les informations sensibles
      const { password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération du profil',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Mettre à jour le profil utilisateur
  static async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      // Valider les données de mise à jour
      const validatedData = ProfileUpdateSchema.parse(req.body);

      // Mise à jour du profil
      const updatedUser = await prisma.$transaction(async (tx) => {
        // Mise à jour du profil utilisateur
        const profile = await tx.userProfile.upsert({
          where: { userId },
          update: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            bio: validatedData.bio,
            region: validatedData.region
          },
          create: {
            userId,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            bio: validatedData.bio,
            region: validatedData.region
          }
        });

        // Mise à jour des préférences alimentaires
        if (validatedData.dietaryPreferences) {
          await tx.dietaryPreference.upsert({
            where: { userId },
            update: validatedData.dietaryPreferences,
            create: {
              userId,
              ...validatedData.dietaryPreferences
            }
          });
        }

        return profile;
      });

      res.json({
        message: 'Profil mis à jour avec succès',
        profile: updatedUser
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
        message: 'Erreur lors de la mise à jour du profil',
        error: error instanceof Error ? error.message : error
      });
    }
  }
// Récupérer les statistiques de progression
static async getUserProgressStats(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      // Récupérer les statistiques de l'utilisateur
      const userStats = await prisma.userStats.findUnique({
        where: { userId }
      });

      // Récupérer les parcours d'apprentissage
      const learningPaths = await prisma.userLearningPath.findMany({
        where: { userId },
        include: {
          learningPath: {
            include: {
              items: {
                include: {
                  recipe: true
                }
              }
            }
          }
        }
      });

      // Récupérer les recettes complétées
      const completedRecipes = await prisma.completedRecipe.findMany({
        where: { userId },
        include: {
          recipe: true
        }
      });

      // Calcul des statistiques
      const progressStats = {
        level: userStats?.level || 1,
        xp: userStats?.xp || 0,
        totalRecipesMade: userStats?.totalRecipesMade || 0,
        completedLearningPaths: learningPaths.filter(
          path => path.status === 'completed'
        ).length,
        inProgressLearningPaths: learningPaths.filter(
          path => path.status === 'in_progress'
        ).length,
        completedRecipes: completedRecipes.map(cr => cr.recipe),
        nextLevelXP: this.calculateNextLevelXP(userStats?.level || 1)
      };

      res.json(progressStats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des statistiques de progression',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Calculer les points XP requis pour le prochain niveau
  private static calculateNextLevelXP(currentLevel: number): number {
    // Formule de progression exponentielle
    return Math.floor(100 * Math.pow(1.5, currentLevel));
  }

  // Ajouter des points XP à l'utilisateur
  static async addXP(userId: string, xpToAdd: number) {
    const userStats = await prisma.userStats.findUnique({
      where: { userId }
    });

    if (!userStats) {
      throw new Error('Statistiques utilisateur non trouvées');
    }

    const newXP = userStats.xp + xpToAdd;
    const currentLevel = userStats.level;
    const nextLevelXP = this.calculateNextLevelXP(currentLevel);

    let newLevel = currentLevel;
    if (newXP >= nextLevelXP) {
      newLevel++;
    }

    return prisma.userStats.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel
      }
    });
  }

  // Suivre une recette
  static async trackRecipeCompletion(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { recipeId } = req.body;

      // Vérifier si la recette existe
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId }
      });

      if (!recipe) {
        return res.status(404).json({ message: 'Recette non trouvée' });
      }

      // Enregistrer la recette comme complétée
      const completedRecipe = await prisma.completedRecipe.create({
        data: {
          userId,
          recipeId
        }
      });

      // Mettre à jour les statistiques utilisateur
      await prisma.userStats.update({
        where: { userId },
        data: {
          totalRecipesMade: { increment: 1 }
        }
      });

      // Ajouter des points XP
      await this.addXP(userId, recipe.xpReward || 50);

      res.status(201).json({
        message: 'Recette complétée avec succès',
        completedRecipe
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors du suivi de la recette',
        error: error instanceof Error ? error.message : error
      });
    }
  }
}