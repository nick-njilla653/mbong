// src/components/learning/RecipeLesson.tsx
import React, { useState } from 'react';
import { IonCard, IonContent, useIonAlert } from '@ionic/react';
import { ProgressBar } from '../ui/ProgressBar';
import { RecipeSteps } from '../features/recipe/RecipeSteps';
import { Quiz } from '../features/quiz/Quiz';
import { useGamification } from '../../contexts/GamificationContext';

interface RecipeLessonProps {
  recipeId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const RecipeLesson: React.FC<RecipeLessonProps> = ({ recipeId, difficulty }) => {
  const [stage, setStage] = useState<'intro' | 'steps' | 'quiz' | 'complete'>('intro');
  const [presentAlert] = useIonAlert();
  const { updateProgress } = useGamification();

  const steps = [
    { id: 1, description: 'Préparer les ingrédients', duration: 5 },
    { id: 2, description: 'Mélanger les épices', duration: 3 },
    // Ajoutez plus d'étapes selon la recette
  ];

  const quizQuestions = [
    {
      id: 1,
      question: 'Quelle est la première étape de la préparation ?',
      options: ['Cuisson', 'Préparation des ingrédients', 'Mélange', 'Service'],
      correctAnswer: 1,
      explanation: 'La préparation des ingrédients est la première étape essentielle pour réussir la recette.'
    }
   ];

  const handleStageComplete = (stageType: string) => {
    let nextStage: 'intro' | 'steps' | 'quiz' | 'complete';
    switch (stage) {
      case 'intro':
        nextStage = 'steps';
        break;
      case 'steps':
        nextStage = 'quiz';
        break;
      case 'quiz':
        nextStage = 'complete';
        break;
      default:
        nextStage = 'complete';
    }
    setStage(nextStage);
    updateProgress(recipeId, stageType);
  };

  return (
    <IonContent>
      <div className="p-4">
        <ProgressBar 
          progress={
            stage === 'intro' ? 0 :
            stage === 'steps' ? 33 :
            stage === 'quiz' ? 66 : 100
          } 
          className="mb-6"
        />

        {stage === 'intro' && (
          <IonCard className="p-4">
            <h2 className="text-xl font-bold mb-4">Introduction à la recette</h2>
            <p className="mb-4">Découvrez les secrets de cette recette traditionnelle.</p>
            <button 
              onClick={() => handleStageComplete('intro')}
              className="w-full py-2 bg-green-600 text-white rounded-lg"
            >
              Commencer
            </button>
          </IonCard>
        )}

        {stage === 'steps' && (
          <RecipeSteps
            steps={steps}
            onStepComplete={(stepId) => console.log('Step completed:', stepId)}
            onComplete={() => handleStageComplete('steps')}
          />
        )}

        {stage === 'quiz' && (
          <Quiz
            questions={quizQuestions}
            onComplete={(score) => handleStageComplete('quiz')}
          />
        )}

        {stage === 'complete' && (
          <div className="text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Félicitations !</h2>
            <p>Vous avez terminé cette leçon avec succès.</p>
          </div>
        )}
      </div>
    </IonContent>
  );
};

export default RecipeLesson;