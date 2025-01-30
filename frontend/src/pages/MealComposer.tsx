/* // // src/pages/MealComposer.tsx
import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
  useIonToast,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  useIonRouter,
  IonList,
} from '@ionic/react';
import {
  nutrition,
  lockClosed,
  checkmarkCircle,
  timeOutline,
  informationCircleOutline,
  leafOutline,
  flameOutline,
  scaleOutline,
} from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { Recipe, Ingredient, RecipeIngredient } from '../types';
import '../styles/meal-composer.css';



type MealTimeType = 'breakfast' | 'lunch' | 'dinner';
type StepType = 'type' | 'ingredients' | 'suggestions';

interface DetailedRecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  showDetails: boolean;
}

const DetailedRecipeCard: React.FC<DetailedRecipeCardProps> = ({ recipe, onSelect, showDetails }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'cultural' | 'nutrition'>('ingredients');

  const renderIngredientsList = (ingredients: RecipeIngredient[]) => {
    return ingredients.map((ingredient: RecipeIngredient, index: number) => (
      <IonItem key={index}>
        <IonLabel>
          <h2>{ingredient.name}</h2>
          <p className="text-sm text-gray-500">
            {ingredient.quantity} {ingredient.unit}
            {ingredient.isOptional && ' (facultatif)'}
          </p>
        </IonLabel>
      </IonItem>
    ));
  };

  return (
    <IonCard className="recipe-card">
      <img
        src={recipe.imageUrl || '/api/placeholder/400/200'}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <IonCardHeader>
        <div className="flex justify-between items-start mb-2">
          <div>
            <IonCardTitle>{recipe.title}</IonCardTitle>
            {recipe.alternateName && (
              <p className="text-sm text-gray-500">
                Aussi connu sous : {recipe.alternateName.join(', ')}
              </p>
            )}
          </div>
          {recipe.unlocked ? (
            <IonIcon icon={checkmarkCircle} className="text-green-600 w-6 h-6" />
          ) : (
            <IonIcon icon={lockClosed} className="text-gray-400 w-6 h-6" />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <IonChip color="primary">
            <IonIcon icon={timeOutline} />
            <IonLabel>{recipe.totalTime} min</IonLabel>
          </IonChip>
          <IonChip color={
            recipe.difficulty === 'easy' ? 'success' :
              recipe.difficulty === 'medium' ? 'warning' : 'danger'
          }>
            <IonIcon icon={flameOutline} />
            <IonLabel>{recipe.difficulty}</IonLabel>
          </IonChip>
          <IonChip color="tertiary">
            <IonIcon icon={leafOutline} />
            <IonLabel>{recipe.region}</IonLabel>
          </IonChip>
        </div>
      </IonCardHeader>

      <IonCardContent>
        {recipe.unlocked ? (
          <>
            <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as any)}>
              <IonSegmentButton value="ingredients">
                <IonLabel>Ingrédients</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="cultural">
                <IonLabel>Culture</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="nutrition">
                <IonLabel>Nutrition</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <div className="mt-4">
              {activeTab === 'ingredients' && (
                <div>
                  <h4 className="font-bold mb-2">Ingrédients principaux</h4>
                  <IonList>
                    {renderIngredientsList(recipe.ingredients.main)}
                  </IonList>
                  {recipe.ingredients.sauce && (
                    <>
                      <h4 className="font-bold mb-2 mt-4">Pour la sauce</h4>
                      <IonList>
                        {renderIngredientsList(recipe.ingredients.sauce)}
                      </IonList>
                    </>
                  )}
                  {recipe.ingredients.accompaniment && (
                    <>
                      <h4 className="font-bold mb-2 mt-4">Accompagnements</h4>
                      <IonList>
                        {renderIngredientsList(recipe.ingredients.accompaniment)}
                      </IonList>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'cultural' && (
                <div>
                  <h4 className="font-bold mb-2">Contexte culturel</h4>
                  <p className="text-gray-600 mb-3">{recipe.culturalInfo.culturalSignificance}</p>
                  {recipe.culturalInfo.occasions.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-semibold mb-1">Occasions</h5>
                      <div className="flex flex-wrap gap-2">
                        {recipe.culturalInfo.occasions.map((occasion: string, index: number) => (
                          <IonChip key={index}>
                            <IonLabel>{occasion}</IonLabel>
                          </IonChip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  <h4 className="font-bold mb-2">Valeurs nutritionnelles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-bold text-xl">
                        {recipe.nutritionFacts.perServing.calories}
                      </div>
                      <div className="text-sm text-gray-600">Calories/portion</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-bold text-xl">
                        {recipe.nutritionFacts.perServing.proteins}g
                      </div>
                      <div className="text-sm text-gray-600">Protéines</div>
                    </div>
                  </div>

                  {recipe.healthInfo.benefits.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold mb-2">Bénéfices santé</h5>
                      <ul className="list-disc pl-4">
                        {recipe.healthInfo.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <IonButton
              expand="block"
              className="mt-4"
              onClick={() => onSelect(recipe)}
            >
              Voir la recette complète
            </IonButton>
          </>
        ) : (
          <div className="text-center text-gray-600 p-4">
            <IonIcon
              icon={lockClosed}
              className="w-12 h-12 mx-auto mb-2 text-gray-400"
            />
            <p>Atteignez le niveau {recipe.requiredLevel} pour débloquer cette recette</p>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

const MealComposer: React.FC = () => {
  const [mealType, setMealType] = useState<MealTimeType>('breakfast');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [step, setStep] = useState<StepType>('type');
  const { user } = useAuth();
  const [present] = useIonToast();
  const router = useIonRouter();

  useEffect(() => {
    // Charger les ingrédients disponibles en fonction du type de repas
    loadIngredients(mealType);
  }, [mealType]);
  const loadIngredients = async (type: MealTimeType) => {
    // Appel API pour obtenir les ingrédients par type de repas
    // et filtrer selon les préférences/restrictions de l'utilisateur
  };

  const handleIngredientSelect = (ingredientId: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const findRecipes = async () => {
    // Appel API pour obtenir les recettes suggérées
    // basées sur les ingrédients sélectionnés
    setStep('suggestions');
  };

  const renderMealTypeSelection = () => (
    <div className="p-4">
      <IonSegment value={mealType} onIonChange={e => setMealType(e.detail.value as MealTimeType)}>
        <IonSegmentButton value="breakfast">
          <IonLabel>Petit déjeuner</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="lunch">
          <IonLabel>Déjeuner</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="dinner">
          <IonLabel>Dîner</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonButton expand="block" className="mt-4" onClick={() => setStep('ingredients')}>
        Continuer
      </IonButton>
    </div>
  );

  const renderIngredientSelection = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sélectionnez vos ingrédients</h2>
      <IonGrid>
        <IonRow>
          {availableIngredients.map(ingredient => (
            <IonCol size="6" sizeMd="4" key={ingredient.id}>
              <IonCard
                className={`ingredient-card ${selectedIngredients.includes(ingredient.id) ? 'selected' : ''
                  }`}
                onClick={() => handleIngredientSelect(ingredient.id)}
              >
                <img src={ingredient.imageUrl} alt={ingredient.name} />
                <IonCardContent>
                  <h3 className="font-bold">{ingredient.name}</h3>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <IonButton
        expand="block"
        disabled={selectedIngredients.length === 0}
        onClick={findRecipes}
      >
        Trouver des recettes
      </IonButton>
    </div>
  );

  const renderRecipeSuggestions = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recettes suggérées</h2>
      {suggestedRecipes.map(recipe => (
        <IonCard key={recipe.id}>
          <img src={recipe.imageUrl} alt={recipe.title} />
          <IonCardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{recipe.title}</h3>
                <p className="text-sm text-gray-600">{recipe.description}</p>
              </div>
              {recipe.unlocked ? (
                <IonIcon icon={checkmarkCircle} className="text-green-600 w-6 h-6" />
              ) : (
                <IonIcon icon={lockClosed} className="text-gray-400 w-6 h-6" />
              )}
            </div>

            {recipe.unlocked ? (
              <>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Valeurs nutritionnelles</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Afficher les informations nutritionnelles *//*}
                   </div>
                </div>
                {Object.entries(recipe.ingredients).map(([category, ingredientsList]) => (
                  <div key={category}>
                    <h4 className="font-bold mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <ul className="space-y-2">
                      {ingredientsList.map((ingredient: RecipeIngredient, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span>{ingredient.name}</span>
                          <span className="text-gray-600">{ingredient.quantity} {ingredient.unit || ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            ) : (
              <div className="mt-4 text-center text-gray-600">
                <p>Débloquez cette recette en atteignant le niveau {recipe.requiredLevel}</p>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Composer un repas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {step === 'type' && renderMealTypeSelection()}
        {step === 'ingredients' && renderIngredientSelection()}
        {step === 'suggestions' && renderRecipeSuggestions()}
      </IonContent>
    </IonPage>
  );
};

export default MealComposer; */


// src/pages/MealComposerMock.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
  IonCardHeader,
  IonItem,
  IonList,
} from '@ionic/react';
import {
  lockClosed,
  checkmarkCircle,
  timeOutline,
  leafOutline,
  flameOutline,
} from 'ionicons/icons';

// Types pour le mock
type MealTimeType = 'breakfast' | 'lunch' | 'dinner';
type StepType = 'type' | 'ingredients' | 'suggestions';

interface Ingredient {
  id: string;
  name: string;
  imageUrl: string;
  mealTypes: MealTimeType[];
}

interface RecipeIngredient {
  name: string;
  quantity: string;
  unit?: string;
  isOptional?: boolean;
}

interface Recipe {
  id: string;
  title: string;
  alternateName?: string[];
  description: string;
  imageUrl: string;
  totalTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  region: string;
  unlocked: boolean;
  requiredLevel?: number;
  ingredients: {
    main: RecipeIngredient[];
    sauce?: RecipeIngredient[];
    accompaniment?: RecipeIngredient[];
  };
  culturalInfo: {
    culturalSignificance: string;
    occasions: string[];
  };
  nutritionFacts: {
    perServing: {
      calories: number;
      proteins: number;
    };
  };
  healthInfo: {
    benefits: string[];
  };
}

const MealComposer: React.FC = () => {
  // Données mockées
  const ingredients: Ingredient[] = [
    {
      id: 'ing1',
      name: 'Plantain',
      imageUrl: '/api/placeholder/200/200?text=Plantain',
      mealTypes: ['breakfast', 'lunch', 'dinner']
    },
    {
      id: 'ing2',
      name: 'Macabo',
      imageUrl: '/api/placeholder/200/200?text=Macabo',
      mealTypes: ['lunch', 'dinner']
    },
    {
      id: 'ing3',
      name: 'Ndolé',
      imageUrl: '/api/placeholder/200/200?text=Ndolé',
      mealTypes: ['lunch', 'dinner']
    },
    {
      id: 'ing4',
      name: 'Piment',
      imageUrl: '/api/placeholder/200/200?text=Piment',
      mealTypes: ['lunch', 'dinner']
    },
    {
      id: 'ing5',
      name: 'Banane Plantain',
      imageUrl: '/api/placeholder/200/200?text=Banane%20Plantain',
      mealTypes: ['breakfast', 'lunch']
    }
  ];

  const recipes: Recipe[] = [
    {
      id: 'recipe1',
      title: 'Poulet DG',
      description: 'Un plat de prestige camerounais avec du poulet et des légumes',
      imageUrl: '/api/placeholder/400/300?text=Poulet%20DG',
      totalTime: 60,
      difficulty: 'medium',
      region: 'Yaoundé',
      unlocked: true,
      requiredLevel: 2,
      ingredients: {
        main: [
          { name: 'Poulet', quantity: '1', unit: 'kg' },
          { name: 'Oignons', quantity: '200', unit: 'g' },
          { name: 'Poivrons', quantity: '2', unit: 'pièces' }
        ],
        sauce: [
          { name: 'Huile de palme', quantity: '50', unit: 'ml' },
          { name: 'Épices', quantity: '1', unit: 'cuillère' }
        ]
      },
      culturalInfo: {
        culturalSignificance: 'Plat emblématique servi lors d\'événements importants à Yaoundé',
        occasions: ['Célébrations', 'Mariages', 'Fêtes']
      },
      nutritionFacts: {
        perServing: {
          calories: 450,
          proteins: 35
        }
      },
      healthInfo: {
        benefits: [
          'Riche en protéines',
          'Source de vitamines B',
          'Bon apport énergétique'
        ]
      }
    },
    {
      id: 'recipe2',
      title: 'Ndolé aux Crevettes',
      description: 'Plat national à base de légumes amers et de crevettes',
      imageUrl: '/api/placeholder/400/300?text=Ndolé%20aux%20Crevettes',
      totalTime: 75,
      difficulty: 'hard',
      region: 'Littoral',
      unlocked: false,
      requiredLevel: 3,
      ingredients: {
        main: [
          { name: 'Ndolé', quantity: '500', unit: 'g' },
          { name: 'Crevettes', quantity: '300', unit: 'g' }
        ],
        sauce: [
          { name: 'Huile de palme', quantity: '100', unit: 'ml' },
          { name: 'Oignons', quantity: '2', unit: 'pièces' }
        ]
      },
      culturalInfo: {
        culturalSignificance: 'Plat traditionnel de la région du Littoral, symbole de la cuisine camerounaise',
        occasions: ['Fêtes traditionnelles', 'Réunions familiales']
      },
      nutritionFacts: {
        perServing: {
          calories: 350,
          proteins: 25
        }
      },
      healthInfo: {
        benefits: [
          'Riche en antioxydants',
          'Bon apport en protéines de mer',
          'Source de minéraux'
        ]
      }
    }
  ];

  const [mealType, setMealType] = useState<MealTimeType>('breakfast');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [step, setStep] = useState<StepType>('type');

  const handleIngredientSelect = (ingredientId: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const renderMealTypeSelection = () => (
    <div className="p-4">
      <IonSegment value={mealType} onIonChange={e => setMealType(e.detail.value as MealTimeType)}>
        <IonSegmentButton value="breakfast">
          <IonLabel>Petit déjeuner</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="lunch">
          <IonLabel>Déjeuner</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="dinner">
          <IonLabel>Dîner</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonButton expand="block" className="mt-4" onClick={() => setStep('ingredients')}>
        Continuer
      </IonButton>
    </div>
  );

  const renderIngredientSelection = () => {
    const filteredIngredients = ingredients.filter(ing => 
      ing.mealTypes.includes(mealType)
    );

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Sélectionnez vos ingrédients</h2>
        <IonGrid>
          <IonRow>
            {filteredIngredients.map(ingredient => (
              <IonCol size="6" sizeMd="4" key={ingredient.id}>
                <IonCard
                  className={`ingredient-card ${selectedIngredients.includes(ingredient.id) ? 'selected' : ''}`}
                  onClick={() => handleIngredientSelect(ingredient.id)}
                >
                  <img src={ingredient.imageUrl} alt={ingredient.name} />
                  <IonCardContent>
                    <h3 className="font-bold">{ingredient.name}</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonButton
          expand="block"
          disabled={selectedIngredients.length === 0}
          onClick={() => setStep('suggestions')}
        >
          Trouver des recettes
        </IonButton>
      </div>
    );
  };

  const renderRecipeSuggestions = () => {
    // Pour ce mock, on retourne toutes les recettes
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Recettes suggérées</h2>
        {recipes.map(recipe => (
          <IonCard key={recipe.id} className="mb-4">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-48 object-cover"
            />
            <IonCardContent>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{recipe.title}</h3>
                  <p className="text-sm text-gray-600">{recipe.description}</p>
                </div>
                {recipe.unlocked ? (
                  <IonIcon icon={checkmarkCircle} className="text-green-600 w-6 h-6" />
                ) : (
                  <IonIcon icon={lockClosed} className="text-gray-400 w-6 h-6" />
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <IonChip color="primary">
                  <IonIcon icon={timeOutline} />
                  <IonLabel>{recipe.totalTime} min</IonLabel>
                </IonChip>
                <IonChip color={
                  recipe.difficulty === 'easy' ? 'success' :
                  recipe.difficulty === 'medium' ? 'warning' : 'danger'
                }>
                  <IonIcon icon={flameOutline} />
                  <IonLabel>{recipe.difficulty}</IonLabel>
                </IonChip>
                <IonChip color="tertiary">
                  <IonIcon icon={leafOutline} />
                  <IonLabel>{recipe.region}</IonLabel>
                </IonChip>
              </div>

              {recipe.unlocked ? (
                <>
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Ingrédients</h4>
                    {Object.entries(recipe.ingredients).map(([category, ingredientsList]) => (
                      <div key={category} className="mb-3">
                        <h5 className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                        <IonList>
                          {ingredientsList.map((ingredient, index) => (
                            <IonItem key={index}>
                              <div className="flex justify-between w-full">
                                <span>{ingredient.name}</span>
                                <span className="text-gray-600">
                                  {ingredient.quantity} {ingredient.unit || ''}
                                </span>
                              </div>
                            </IonItem>
                          ))}
                        </IonList>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-600">
                  <p>Débloquez cette recette en atteignant le niveau {recipe.requiredLevel}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        ))}
        <IonButton 
          expand="block" 
          className="mt-4"
          onClick={() => setStep('ingredients')}
        >
          Retour à la sélection d'ingrédients
        </IonButton>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Composer un repas camerounais</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {step === 'type' && renderMealTypeSelection()}
        {step === 'ingredients' && renderIngredientSelection()}
        {step === 'suggestions' && renderRecipeSuggestions()}
      </IonContent>
    </IonPage>
  );
};

export default MealComposer;