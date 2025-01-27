// src/hooks/useLearning.ts
import { useState, useEffect } from 'react';
import { LearningService } from '../services/learning.service';
import { Level } from '../types/index';

export const useLearning = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const levelsData = await LearningService.getLevels();
      setLevels(levelsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (lessonId: number) => {
    try {
      await LearningService.completeLesson(lessonId);
      await loadLevels(); // Recharger les niveaux pour mettre à jour l'UI
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de validation');
    }
  };

  return { levels, loading, error, completeLesson };
};