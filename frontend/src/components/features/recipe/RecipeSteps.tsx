// src/components/recipe/RecipeSteps.tsx
import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, timerOutline } from 'ionicons/icons';
import { Step } from '../../../types/index';

interface RecipeStepsProps {
  steps: Step[];
  currentStep: number;  // Ajouté pour correspondre au parent
  onStepComplete: (stepIndex: number) => void;  // Changé pour utiliser l'index
}

export const RecipeSteps: React.FC<RecipeStepsProps> = ({ 
  steps, 
  currentStep,
  onStepComplete 
}) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]); // Changé en string[]

  const handleStepComplete = (stepId: string, index: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      onStepComplete(index);
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`p-4 rounded-lg transition-all ${
            index === currentStep
              ? 'bg-green-50 border-2 border-green-500'
              : completedSteps.includes(step.id)
              ? 'bg-gray-50'
              : 'bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-1">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                {completedSteps.includes(step.id) ? (
                  <IonIcon icon={checkmarkCircle} className="text-green-600 w-6 h-6" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{step.description}</p>
                {step.tips && (
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Astuce: {step.tips}
                  </p>
                )}
                {step.duration && (
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <IonIcon icon={timerOutline} className="w-4 h-4 mr-1" />
                    <span>{step.duration} min</span>
                  </div>
                )}
              </div>
            </div>
            {index === currentStep && !completedSteps.includes(step.id) && (
              <button
                onClick={() => handleStepComplete(step.id, index)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-4"
              >
                Terminer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeSteps;