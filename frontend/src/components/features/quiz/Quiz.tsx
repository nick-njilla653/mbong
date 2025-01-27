// src/components/quiz/Quiz.tsx
import React, { useState } from 'react';
import { IonCard, IonCardContent, useIonAlert } from '@ionic/react';

// src/components/quiz/Quiz.tsx
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions = [
  {
    id: 1,
    question: 'Quelle est la première étape de la préparation ?',
    options: ['Cuisson', 'Préparation des ingrédients', 'Mélange', 'Service'],
    correctAnswer: 1,
    explanation: 'La préparation des ingrédients est essentielle avant de commencer la cuisson.'
  }
];
interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [presentAlert] = useIonAlert();

  const handleAnswer = (selectedIndex: number) => {
    const correct = selectedIndex === questions[currentQuestion].correctAnswer;
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    presentAlert({
      header: correct ? 'Correct !' : 'Incorrect',
      message: questions[currentQuestion].explanation,
      buttons: ['Continuer'],
      onDidDismiss: () => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setShowResults(true);
          onComplete(score);
        }
      }
    });
  };

  if (showResults) {
    return (
      <IonCard className="text-center">
        <IonCardContent>
          <h2 className="text-2xl font-bold mb-4">Quiz terminé !</h2>
          <p className="text-xl">Score: {score}/{questions.length}</p>
        </IonCardContent>
      </IonCard>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="mb-4 text-sm text-gray-500">
          Question {currentQuestion + 1}/{questions.length}
        </div>
        <h3 className="text-lg font-bold mb-4">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="w-full p-4 text-left rounded-lg border border-gray-200 hover:bg-green-50 transition-colors"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;