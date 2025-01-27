// src/components/quiz/RecipeQuiz.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  useIonRouter,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { Recipe } from '../../../types/index';
import { useGamification } from '../../../contexts/GamificationContext';
import '../../../styles/quiz.css';


interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface RecipeQuizProps {
  recipe: Recipe;
  onComplete: (score: number) => void;
}

const generateQuizQuestions = (recipe: Recipe): QuizQuestion[] => {
  // Logique pour générer des questions basées sur la recette
  const questions: QuizQuestion[] = [
    {
      id: '1',
      question: 'Quel est le temps total de préparation de cette recette ?',
      options: [
        `${recipe.duration - 10} minutes`,
        `${recipe.duration} minutes`,
        `${recipe.duration + 10} minutes`,
        `${recipe.duration + 20} minutes`
      ],
      correctAnswer: 1,
      explanation: `Le temps total de préparation est de ${recipe.duration} minutes.`
    },
    {
      id: '2',
      question: 'Quel ingrédient n\'est PAS utilisé dans cette recette ?',
      options: [
        recipe.ingredients[0],
        'Ingrédient incorrect',
        recipe.ingredients[1],
        recipe.ingredients[2]
      ],
      correctAnswer: 1,
      explanation: 'Cet ingrédient n\'apparaît pas dans la liste des ingrédients.'
    },
    // Ajoutez d'autres questions pertinentes
  ];

  return questions;
};

const RecipeQuiz: React.FC<RecipeQuizProps> = ({ recipe, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useIonRouter();
  const { updateProgress } = useGamification();

  const questions = generateQuizQuestions(recipe);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      const finalScore = (score / questions.length) * 100;
      onComplete(finalScore);
    }
  };

  if (quizCompleted) {
    const scorePercentage = (score / questions.length) * 100;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Quiz terminé !</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {scorePercentage >= 70 ? 'Félicitations !' : 'Continuez à vous entraîner !'}
            </h2>
            <div className="text-4xl mb-6">
              {scorePercentage >= 70 ? '🎉' : '💪'}
            </div>
            <p className="text-xl mb-4">
              Votre score : {score}/{questions.length} ({scorePercentage}%)
            </p>
            <IonButton
              expand="block"
              onClick={() => router.push('/app/learning')}
            >
              Retour aux leçons
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/app/recipe/${recipe.id}`} />
          </IonButtons>
          <IonTitle>Quiz - {recipe.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <div className="mb-4 text-center">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1}/{questions.length}
            </span>
          </div>

          <IonCard>
            <IonCardContent>
              <h2 className="text-lg font-bold mb-4">{currentQ.question}</h2>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 text-left rounded-lg border ${
                      selectedAnswer === null
                        ? 'border-gray-200 hover:bg-gray-50'
                        : selectedAnswer === index
                        ? index === currentQ.correctAnswer
                          ? 'bg-green-50 border-green-500'
                          : 'bg-red-50 border-red-500'
                        : index === currentQ.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : 'border-gray-200'
                    } ${
                      selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      if (selectedAnswer === null) {
                        handleAnswerSelect(index);
                      }
                    }}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="flex items-center">
                      {selectedAnswer !== null && (
                        <IonIcon
                          icon={
                            index === currentQ.correctAnswer
                              ? checkmarkCircle
                              : selectedAnswer === index
                              ? closeCircle
                              : undefined
                          }
                          className={`w-5 h-5 mr-2 ${
                            index === currentQ.correctAnswer
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        />
                      )}
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">{currentQ.explanation}</p>
                </div>
              )}

              {selectedAnswer !== null && (
                <IonButton
                  expand="block"
                  className="mt-4"
                  onClick={handleNextQuestion}
                >
                  {currentQuestion < questions.length - 1
                    ? 'Question suivante'
                    : 'Terminer le quiz'}
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeQuiz;