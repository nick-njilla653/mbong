import React from 'react';
import { IonCard } from '@ionic/react';
import { motion } from 'framer-motion';

export const LevelUpModal: React.FC<{
    level: number;
    newRecipes: string[];
    onClose: () => void;
  }> = ({ level, newRecipes, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <span className="text-4xl mb-4">🎉</span>
            <h2 className="text-2xl font-bold mb-4">Niveau {level} atteint !</h2>
            <p className="text-gray-600 mb-6">
              Vous avez débloqué de nouvelles recettes :
            </p>
            <div className="space-y-2">
              {newRecipes.map((recipe, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-50 rounded-lg text-green-800"
                >
                  {recipe}
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continuer
            </button>
          </div>
        </motion.div>
      </div>
    );
  };