import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonChip,
  IonLabel,
  IonBadge,
  IonModal,
  IonList,
  IonItem,
  IonFooter,
} from '@ionic/react';
import { 
  restaurantOutline, 
  nutritionOutline, 
  timeOutline,
  flameOutline,
  refreshOutline,
  starOutline,
  printOutline,
  shareOutline,
  bookmarkOutline,
  scaleOutline
} from 'ionicons/icons';
import './AIPage.css';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface GeneratedMeal {
  name: string;
  calories: number;
  prepTime: string;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionScore: number;
  macros: {
    proteins: number;
    carbs: number;
    fats: number;
  };
  allergensPresent: string[];
  servings: number;
}

const AIPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeal, setGeneratedMeal] = useState<GeneratedMeal | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateMeal = () => {
    setIsGenerating(true);
    // Simuler l'appel à l'IA
    setTimeout(() => {
      setGeneratedMeal({
        name: "Bowl de Quinoa aux Légumes",
        calories: 450,
        prepTime: "20 min",
        difficulty: "Facile",
        ingredients: [
          { name: "Quinoa", quantity: "100", unit: "g" },
          { name: "Pois chiches", quantity: "150", unit: "g" },
          { name: "Avocat", quantity: "1", unit: "pièce" },
          { name: "Tomates cerises", quantity: "150", unit: "g" },
          { name: "Épinards", quantity: "100", unit: "g" }
        ],
        instructions: [
          "Rincez le quinoa et faites-le cuire selon les instructions",
          "Égouttez et rincez les pois chiches",
          "Coupez l'avocat en dés",
          "Coupez les tomates cerises en deux",
          "Lavez les épinards",
          "Mélangez tous les ingrédients dans un bol",
          "Assaisonnez selon vos goûts"
        ],
        nutritionScore: 4.5,
        macros: {
          proteins: 15,
          carbs: 55,
          fats: 20
        },
        allergensPresent: [],
        servings: 2
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/MealSelection" />
          </IonButtons>
          <IonTitle>Assistant Culinaire IA</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ai-content">
        <div className="ai-container">
          {!generatedMeal ? (
            <IonCard className="meal-generator-card">
              <IonCardHeader>
                <IonCardTitle>Générer un Repas Équilibré</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="generator-content">
                  <div className="ai-icon-container">
                    {isGenerating ? (
                      <IonSpinner name="crescent" />
                    ) : (
                      <IonIcon icon={nutritionOutline} className="ai-icon" />
                    )}
                  </div>
                  <p className="generator-text">
                    Notre IA va créer un repas personnalisé en fonction de vos préférences et besoins nutritionnels
                  </p>
                  <IonButton
                    expand="block"
                    onClick={generateMeal}
                    disabled={isGenerating}
                    className="generate-button"
                  >
                    {isGenerating ? 'Génération en cours...' : 'Générer un repas'}
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ) : (
            <div className="recipe-container">
              <IonCard className="recipe-card">
                <IonCardHeader>
                  <IonCardTitle>{generatedMeal.name}</IonCardTitle>
                  <div className="recipe-meta">
                    <IonChip outline color="primary">
                      <IonIcon icon={timeOutline} />
                      <IonLabel>{generatedMeal.prepTime}</IonLabel>
                    </IonChip>
                    <IonChip outline color="primary">
                      <IonIcon icon={flameOutline} />
                      <IonLabel>{generatedMeal.calories} kcal</IonLabel>
                    </IonChip>
                    <IonChip outline color="primary">
                      <IonIcon icon={starOutline} />
                      <IonLabel>Score: {generatedMeal.nutritionScore}/5</IonLabel>
                    </IonChip>
                  </div>
                </IonCardHeader>

                <IonCardContent>
                  <div className="section-title">Ingrédients</div>
                  <div className="ingredients-list">
                    {generatedMeal.ingredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        <span className="ingredient-name">{ingredient.name}</span>
                        <span className="ingredient-quantity">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="button-group">
                    <IonButton 
                      fill="outline" 
                      onClick={() => setShowInstructions(true)}
                    >
                      Instructions
                    </IonButton>
                    <IonButton 
                      fill="outline" 
                      onClick={() => setShowNutrition(true)}
                    >
                      Nutrition
                    </IonButton>
                  </div>

                  <div className="action-buttons">
                    <IonButton 
                      fill="clear"
                      onClick={() => setSaved(!saved)}
                    >
                      <IonIcon 
                        icon={bookmarkOutline} 
                        color={saved ? 'primary' : 'medium'} 
                      />
                    </IonButton>
                    <IonButton fill="clear">
                      <IonIcon icon={shareOutline} />
                    </IonButton>
                    <IonButton fill="clear">
                      <IonIcon icon={printOutline} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonButton
                expand="block"
                onClick={generateMeal}
                className="regenerate-button"
              >
                <IonIcon icon={refreshOutline} slot="start" />
                Générer une autre recette
              </IonButton>
            </div>
          )}
        </div>

        {/* Modal des Instructions */}
        <IonModal 
          isOpen={showInstructions} 
          onDidDismiss={() => setShowInstructions(false)}
          className="instructions-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Instructions de Préparation</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowInstructions(false)}>
                  Fermer
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {generatedMeal && (
              <div className="instructions-content">
                {generatedMeal.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-text">{instruction}</div>
                  </div>
                ))}
              </div>
            )}
          </IonContent>
        </IonModal>

        {/* Modal des Informations Nutritionnelles */}
        <IonModal 
          isOpen={showNutrition} 
          onDidDismiss={() => setShowNutrition(false)}
          className="nutrition-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Information Nutritionnelle</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowNutrition(false)}>
                  Fermer
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {generatedMeal && (
              <div className="nutrition-content">
                <div className="calories-circle">
                  <div className="circle-content">
                    <div className="circle-value">{generatedMeal.calories}</div>
                    <div className="circle-label">Calories</div>
                  </div>
                </div>

                <div className="macros-grid">
                  <div className="macro-item">
                    <IonIcon icon={scaleOutline} />
                    <div className="macro-label">Protéines</div>
                    <div className="macro-value">{generatedMeal.macros.proteins}g</div>
                  </div>
                  <div className="macro-item">
                    <IonIcon icon={scaleOutline} />
                    <div className="macro-label">Glucides</div>
                    <div className="macro-value">{generatedMeal.macros.carbs}g</div>
                  </div>
                  <div className="macro-item">
                    <IonIcon icon={scaleOutline} />
                    <div className="macro-label">Lipides</div>
                    <div className="macro-value">{generatedMeal.macros.fats}g</div>
                  </div>
                </div>

                {generatedMeal.allergensPresent.length > 0 && (
                  <div className="allergens-section">
                    <h3>Allergènes présents</h3>
                    <div className="allergens-list">
                      {generatedMeal.allergensPresent.map((allergen, index) => (
                        <IonChip key={index} color="warning">
                          <IonLabel>{allergen}</IonLabel>
                        </IonChip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AIPage;