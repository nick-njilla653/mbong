// src/controllers/learning-path.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la création d'un parcours d'apprentissage
const LearningPathCreateSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  category: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  requiredXP: z.number().int().positive(),
  recipes: z.array(z.string()), // IDs des recettes
});

export class LearningPathController {
  // Créer un nouveau parcours d'apprentissage
  static async createLearningPath(req: Request, res: Response) {
    try {
      // Validation des données
      const validatedData = LearningPathCreateSchema.parse(req.body);

      // Vérifier que les recettes existent
      const recipeChecks = await Promise.all(
        validatedData.recipes.map(recipeId => 
          prisma.recipe.findUnique({ where: { id: recipeId } })
        )
      );

      if (recipeChecks.some(recipe => recipe === null)) {
        return res.status(400).json({ 
          message: 'Un ou plusieurs IDs de recettes sont invalides' 
        });
      }

      // Création du parcours d'apprentissage
      const learningPath = await prisma.learningPath.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
          requiredXP: validatedData.requiredXP,
          items: {
            create: validatedData.recipes.map((recipeId, index) => ({
              recipeId,
              order: index + 1
            }))
          }
        },
        include: {
          items: {
            include: {
              recipe: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Parcours d\'apprentissage créé avec succès',
        learningPath
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
        message: 'Erreur lors de la création du parcours d\'apprentissage',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Récupérer tous les parcours d'apprentissage
  static async getAllLearningPaths(req: Request, res: Response) {
    try {
      const { 
        category, 
        page = 1, 
        limit = 10 
      } = req.query;

      const where: any = {};

      if (category) {
        where.category = category;
      }

      const learningPaths = await prisma.learningPath.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          items: {
            include: {
              recipe: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.learningPath.count({ where });

      res.json({
        learningPaths,
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
        message: 'Erreur lors de la récupération des parcours d\'apprentissage',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Commencer un parcours d'apprentissage
  static async startLearningPath(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Vérifier si l'utilisateur a déjà commencé ce parcours
      const existingPath = await prisma.userLearningPath.findUnique({
        where: {
          userId_learningPathId: {
            userId,
            learningPathId: id
          }
        }
      });

      if (existingPath) {
        return res.status(400).json({ 
          message: 'Vous avez déjà commencé ce parcours d\'apprentissage' 
        });
      }

      // Vérifier les prérequis du parcours
      const learningPath = await prisma.learningPath.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              recipe: true
            }
          }
        }
      });

      if (!learningPath) {
        return res.status(404).json({ 
          message: 'Parcours d\'apprentissage non trouvé' 
        });
      }

      // Vérifier les points XP
      const userStats = await prisma.userStats.findUnique({
        where: { userId }
      });

      if (!userStats || userStats.xp < learningPath.requiredXP) {
        return res.status(403).json({ 
          message: 'Vous n\'avez pas assez de points d\'expérience pour ce parcours' 
        });
      }

      // Démarrer le parcours
      const userLearningPath = await prisma.userLearningPath.create({
        data: {
          userId,
          learningPathId: id,
          status: 'in_progress'
        }
      });

      res.status(201).json({
        message: 'Parcours d\'apprentissage démarré avec succès',
        userLearningPath
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors du démarrage du parcours d\'apprentissage',
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Terminer un parcours d'apprentissage
  static async completeLearningPath(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Mettre à jour le statut du parcours
      const updatedUserLearningPath = await prisma.userLearningPath.update({
        where: {
          userId_learningPathId: {
            userId,
            learningPathId: id
          }
        },
        data: {
          status: 'completed',
          completedAt: new Date()
        },
        include: {
          learningPath: true
        }
      });

      // Mettre à jour les statistiques de l'utilisateur
      await prisma.userStats.update({
        where: { userId },
        data: {
          xp: { increment: updatedUserLearningPath.learningPath.requiredXP }
        }
      });

      res.json({
        message: 'Parcours d\'apprentissage terminé avec succès',
        userLearningPath: updatedUserLearningPath
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Erreur lors de la complétion du parcours d\'apprentissage',
        error: error instanceof Error ? error.message : error
      });
    }
  }
}