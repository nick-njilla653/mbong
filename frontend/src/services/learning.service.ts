// src/services/learning.service.ts
import { Level, Lesson, LearningProgress } from '../types/index';

export class LearningService {
  private static PROGRESS_KEY = 'mbong_learning_progress';

  static async getLevels(): Promise<Level[]> {
    try {
      const response = await fetch('/api/levels');
      if (!response.ok) throw new Error('Échec de récupération des niveaux');
      return await response.json();
    } catch (error) {
      throw new Error('Erreur de chargement des niveaux');
    }
  }

  static async completeLesson(lessonId: number): Promise<void> {
    try {
      await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mbong_token')}`,
        },
      });
      
      // Mise à jour du progrès local
      const progress = this.getProgress();
      const lessonProgress: LearningProgress = {
        lessonId,
        completedStages: ['complete'],
        quiz: { score: 100, completedAt: new Date() },
        lastAccessed: new Date()
      };
      
      await this.saveProgress(lessonProgress);
    } catch (error) {
      throw new Error('Erreur lors de la validation de la leçon');
    }
  }

  static calculateXPProgress(currentXP: number): {
    level: number;
    progress: number;
  } {
    const XP_PER_LEVEL = 100;
    const level = Math.floor(currentXP / XP_PER_LEVEL);
    const progress = (currentXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
    return { level, progress };
  }

  static async saveProgress(progress: LearningProgress): Promise<void> {
    const currentProgress = this.getProgress();
    const updatedProgress = {
      ...currentProgress,
      [progress.lessonId]: progress
    };
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(updatedProgress));
  }

  static getProgress(): Record<number, LearningProgress> {
    const progress = localStorage.getItem(this.PROGRESS_KEY);
    return progress ? JSON.parse(progress) : {};
  }

  static async getLessonProgress(lessonId: number): Promise<LearningProgress | null> {
    const progress = this.getProgress();
    return progress[lessonId] || null;
  }

  static async updateStageProgress(
    lessonId: number,
    stage: string,
    data: any = {}
  ): Promise<void> {
    const progress = await this.getLessonProgress(lessonId) || {
      lessonId,
      completedStages: [],
      quiz: { score: 0, completedAt: new Date() },
      lastAccessed: new Date()
    };

    progress.completedStages.push(stage);
    progress.lastAccessed = new Date();

    if (stage === 'quiz' && data.score) {
      progress.quiz = {
        score: data.score,
        completedAt: new Date()
      };
    }

    await this.saveProgress(progress);
  }

  static calculateXP(progress: LearningProgress): number {
    const baseXP = 10;
    const stageXP = progress.completedStages.length * 5;
    const quizXP = progress.quiz?.score || 0;
    
    return baseXP + stageXP + quizXP;
  }
}