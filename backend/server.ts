// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.routes';
import recipeRoutes from './routes/recipe.routes';
import userRoutes from './routes/user.routes';
import learningPathRoutes from './routes/learning-path.routes';

// Middleware
import { errorHandler } from './middleware/error-handler';
import { authenticateToken } from './middleware/auth-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de base
app.use(helmet()); // Sécurisation des en-têtes HTTP
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/recipes', authenticateToken, recipeRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/learning-paths', authenticateToken, learningPathRoutes);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Démarrage du serveur
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
};

export { app, startServer };