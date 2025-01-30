//// src/routes/recipe.routes.ts
import express from 'express';
import RecipeController from '../controllers/recipe.controller';
import { checkRole } from '../middleware/auth-middleware';

const router = express.Router();

// Routes publiques de lecture
router.get('/', RecipeController.getAllRecipes);
router.get('/search', RecipeController.searchRecipes);
router.get('/:id', RecipeController.getRecipeById);
router.get('/region/:region', RecipeController.getRecipesByRegion);
router.get('/difficulty/:difficulty', RecipeController.getRecipesByDifficulty);

// Routes protégées
router.post('/', 
  checkRole(['ADMIN', 'CHEF']), 
  RecipeController.createRecipe
);

router.put('/:id', 
  checkRole(['ADMIN', 'CHEF']), 
  RecipeController.updateRecipe
);

router.delete('/:id', 
  checkRole(['ADMIN']), 
  RecipeController.deleteRecipe
);

// Routes de commentaires et recommandations
router.post('/:recipeId/comment', 
  RecipeController.addComment
);

router.get('/recommended', 
  RecipeController.getRecommendedRecipes
);

export default router;