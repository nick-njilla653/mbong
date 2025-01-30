// src/middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

// Interface pour les erreurs personnalisées
interface CustomError extends Error {
    statusCode?: number;
    code?: string;
    errors?: any[];
  }

export const errorHandler = (
  err: CustomError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err);

  // Gestion des erreurs Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Violation de contrainte unique
        return res.status(409).json({
          message: 'Une ressource avec ces informations existe déjà',
          error: 'Conflict'
        });
      
      case 'P2025': // Enregistrement non trouvé
        return res.status(404).json({
          message: 'Ressource non trouvée',
          error: 'Not Found'
        });
      
      default:
        return res.status(500).json({
          message: 'Erreur de base de données',
          error: err.message
        });
    }
  }

  // Gestion des erreurs Zod (validation)
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Erreurs d'authentification
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Non autorisé',
      error: 'Unauthorized'
    });
  }

  // Erreurs génériques
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Une erreur interne est survenue',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};