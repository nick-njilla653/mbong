// src/routes/user.routes.ts
import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();

// Routes de profil utilisateur
router.get('/profile', UserController.getUserProfile);
router.put('/profile', UserController.updateUserProfile);

// Routes de progression
router.get('/progress', UserController.getUserProgressStats);
router.post('/track-recipe', UserController.trackRecipeCompletion);

export default router;