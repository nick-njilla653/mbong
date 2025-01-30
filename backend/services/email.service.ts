// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';

interface EmailOptions extends SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Envoyer un email de bienvenue
  async sendWelcomeEmail(user: { 
    email: string, 
    firstName?: string 
  }) {
    const options: EmailOptions = {
      to: user.email,
      subject: 'Bienvenue dans la Cuisine Camerounaise !',
      html: `
        <h1>Bienvenue ${user.firstName || 'Chef'}!</h1>
        <p>Nous sommes ravis de vous accueillir dans notre communauté culinaire camerounaise.</p>
        <p>Commencez votre voyage gastronomique et découvrez les délicieuses traditions culinaires du Cameroun.</p>
        <a href="${process.env.FRONTEND_URL}/welcome">Commencer</a>
      `
    };

    return this.sendEmail(options);
  }

  // Envoyer un email de réinitialisation de mot de passe
  async sendPasswordResetEmail(user: { 
    email: string, 
    resetToken: string 
  }) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${user.resetToken}`;

    const options: EmailOptions = {
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetLink}">Réinitialiser le mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    };

    return this.sendEmail(options);
  }

  // Envoyer un email de progression de parcours
  async sendLearningPathCompletionEmail(user: { 
    email: string, 
    firstName?: string, 
    learningPathTitle: string 
  }) {
    const options: EmailOptions = {
      to: user.email,
      subject: 'Félicitations - Parcours terminé !',
      html: `
        <h1>Bravo ${user.firstName || 'Chef'}!</h1>
        <p>Vous avez terminé le parcours : ${user.learningPathTitle}</p>
        <p>Continuez à explorer les saveurs du Cameroun !</p>
        <a href="${process.env.FRONTEND_URL}/learning-paths">Voir mes parcours</a>
      `
    };

    return this.sendEmail(options);
  }

  // Méthode générique pour envoyer des emails
  private async sendEmail(options: EmailOptions) {
    try {
      const defaultFrom = `"Cuisine Camerounaise" <${process.env.SMTP_USER}>`;
      
      const emailOptions = {
        from: defaultFrom,
        ...options
      };

      const info = await this.transporter.sendMail(emailOptions);
      
      console.log('Email envoyé:', info.messageId);
      return info;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }
}

export default new EmailService();