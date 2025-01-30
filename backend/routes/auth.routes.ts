// src/routes/auth.routes.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { 
  generateToken, 
  authenticateToken, 
  refreshToken 
} from '../middleware/auth-middleware';

import EmailService from '../services/email.service';

const router = express.Router();
const prisma = new PrismaClient();
const emailService = new EmailService();

// Schémas de validation Zod
const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const PasswordResetRequestSchema = z.object({
  email: z.string().email()
});

const PasswordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6).max(100)
});

// Inscription
router.post('/register', async (req, res) => {
  try {
    // Validation des données
    const validatedData = RegisterSchema.parse(req.body);

    // Vérification de l'existence de l'utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un utilisateur existe déjà avec cet email ou ce nom d\'utilisateur' 
      });
    }

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName
          }
        },
        stats: {
          create: {
            level: 1,
            xp: 0
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true
      }
    });

    // Génération du token
    const token = generateToken(user);

    // Envoi de l'email de bienvenue
    try {
      await emailService.sendWelcomeEmail({
        email: user.email,
        firstName: validatedData.firstName
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
    }

    res.status(201).json({ 
      message: 'Inscription réussie', 
      user, 
      token 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    // Validation des données
    const validatedData = LoginSchema.parse(req.body);

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(
      validatedData.password, 
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Génération du token
    const token = generateToken(user);

    res.json({ 
      message: 'Connexion réussie', 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }, 
      token 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Demande de réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = PasswordResetRequestSchema.parse(req.body);

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'Aucun compte trouvé avec cet email' });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Enregistrer le token dans la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Envoyer l'email de réinitialisation
    await emailService.sendPasswordResetEmail({
      email: user.email,
      resetToken
    });

    res.json({ 
      message: 'Un email de réinitialisation a été envoyé si le compte existe' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
  }
});

// Réinitialisation de mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = PasswordResetSchema.parse(req.body);

    // Trouver l'utilisateur avec le token valide
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token still valid
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe et invalider le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
});

// Rafraîchissement du token
router.post('/refresh-token', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  const newToken = refreshToken(req.user);
  res.json({ token: newToken });
});

// Profil utilisateur
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        profile: true,
        stats: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      stats: user.stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
});

export default router;