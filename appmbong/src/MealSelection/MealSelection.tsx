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
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonChip,
  IonAlert,
  IonModal,
} from '@ionic/react';
import { 
  sunnyOutline, 
  restaurantOutline, 
  moonOutline,
  checkmarkCircle,
  closeCircle,
  searchOutline,
  nutrition
} from 'ionicons/icons';
import './MealSelection.css';

interface Ingredient {
  id: number;
  name: string;
  image: string;
  category: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Array<{name: string, quantity: string}>;
  nutrition: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  instructions: string[];
  preparationTime: string;
  servings: number;
}

const MealSelection: React.FC = () => {
  const [mealType, setMealType] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showNoRecipesAlert, setShowNoRecipesAlert] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Exemple d'ingrédients
  const ingredients: Ingredient[] = [
    { id: 1, name: 'Riz', image: '/api/placeholder/150/150', category: 'Céréales' },
    { id: 2, name: 'Poulet', image: '/api/placeholder/150/150', category: 'Protéines' },
    { id: 3, name: 'Tomates', image: '/api/placeholder/150/150', category: 'Légumes' },
    // Ajoutez plus d'ingrédients
  ];

  const filterIngredients = () => {
    return ingredients.filter(ing => 
      ing.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const toggleIngredient = (ingredientName: string) => {
    if (selectedIngredients.includes(ingredientName)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredientName));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredientName]);
    }
  };

  const searchRecipes = () => {
    // Simulation de recherche de recettes
    const foundRecipes: Recipe[] = []; // Ici viendrait votre logique de recherche
    
    if (foundRecipes.length === 0) {
      setShowNoRecipesAlert(true);
    } else {
      setRecipes(foundRecipes);
      setShowRecipes(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/PreferencesPage" />
          </IonButtons>
          <IonTitle>Création de votre repas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="meal-selection-ioncontent">
        {!showRecipes ? (
          <div className="meal-selection-container">
            <IonCard className="meal-type-card">
              <IonCardHeader>
                <IonCardTitle>Type de Repas</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonSegment value={mealType} onIonChange={e => setMealType(e.detail.value as string)}>
                  <IonSegmentButton value="breakfast">
                    <IonIcon icon={sunnyOutline} />
                    <IonLabel>Petit Déjeuner</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="lunch">
                    <IonIcon icon={restaurantOutline} />
                    <IonLabel>Déjeuner</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="dinner">
                    <IonIcon icon={moonOutline} />
                    <IonLabel>Dîner</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonCardContent>
            </IonCard>

            {mealType && (
              <>
                <IonCard className="ingredients-card">
                  <IonCardHeader>
                    <IonCardTitle>Sélectionnez vos ingrédients</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonSearchbar
                      value={searchText}
                      onIonChange={e => setSearchText(e.detail.value!)}
                      placeholder="Rechercher un ingrédient"
                    />

                    <div className="selected-ingredients">
                      {selectedIngredients.map(ing => (
                        <IonChip 
                          key={ing}
                          onClick={() => toggleIngredient(ing)}
                          className="selected-ingredient-chip"
                        >
                          <IonLabel>{ing}</IonLabel>
                          <IonIcon icon={closeCircle} />
                        </IonChip>
                      ))}
                    </div>

                    <IonGrid className="ingredients-grid">
                      <IonRow>
                        {filterIngredients().map(ingredient => (
                          <IonCol size="6" size-md="4" key={ingredient.id}>
                            <div 
                              className={`ingredient-item ${
                                selectedIngredients.includes(ingredient.name) ? 'selected' : ''
                              }`}
                              onClick={() => toggleIngredient(ingredient.name)}
                            >
                              <img src={ingredient.image} alt={ingredient.name} />
                              <div className="ingredient-name">{ingredient.name}</div>
                              {selectedIngredients.includes(ingredient.name) && (
                                <div className="selected-overlay">
                                  <IonIcon icon={checkmarkCircle} />
                                </div>
                              )}
                            </div>
                          </IonCol>
                        ))}
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>

                <IonButton
                  expand="block"
                  className="search-recipes-button"
                  disabled={selectedIngredients.length === 0}
                  onClick={searchRecipes}
                >
                  Rechercher des recettes
                </IonButton>
              </>
            )}
          </div>
        ) : (
          <div className="recipes-container">
            {recipes.map(recipe => (
              <IonCard 
                key={recipe.id}
                className="recipe-card"
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setShowRecipeModal(true);
                }}
              >
                {/* Contenu de la carte de recette */}
              </IonCard>
            ))}
          </div>
        )}

        <IonAlert
          isOpen={showNoRecipesAlert}
          onDidDismiss={() => setShowNoRecipesAlert(false)}
          header="Aucune recette trouvée"
          message="Nous n'avons pas trouvé de recettes correspondant à vos critères. Voulez-vous que notre IA génère une recette personnalisée ?"
          buttons={[
            {
              text: 'Non',
              role: 'cancel'
            },
            {
              text: 'Oui',
              handler: () => {
                // Redirection vers la page IA
                window.location.href = '/AIPage';
              }
            }
          ]}
        />

        <IonModal
          isOpen={showRecipeModal}
          onDidDismiss={() => setShowRecipeModal(false)}
        >
          {/* Contenu détaillé de la recette */}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MealSelection;