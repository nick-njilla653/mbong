// src/routes/learning-path.routes.ts
import express from 'express';
import { LearningPathController } from '../controllers/learning-path.controller';
import { checkRole } from '../middleware/auth-middleware';

const router = express.Router();

// Routes pour tous les utilisateurs authentifiés
router.get('/', LearningPathController.getAllLearningPaths);

// Routes pour démarrer/terminer un parcours
router.post('/:id/start', LearningPathController.startLearningPath);
router.post('/:id/complete', LearningPathController.completeLearningPath);

// Routes protégées pour les administrateurs et chefs
router.post('/', 
  checkRole(['ADMIN', 'CHEF']), 
  LearningPathController.createLearningPath
);

export default router;