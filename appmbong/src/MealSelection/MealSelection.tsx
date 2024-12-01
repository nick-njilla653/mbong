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
  nutrition,
  timeOutline,
  peopleOutline
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
  image: string;
  ingredients: Array<{ name: string, quantity: string }>;
  nutrition: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  instructions: string[];
  preparationTime: string;
  servings: number;
  mealType: string;
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

  // Base de données d'ingrédients
  const ingredients: Ingredient[] = [
    // Céréales et féculents
    { id: 1, name: 'Riz', image: 'public/images/riz.jpg', category: 'Céréales' },
    { id: 2, name: 'Pain complet', image: 'public/images/pain-complet.jpg', category: 'Céréales' },
    { id: 3, name: 'Avoine', image: 'public/images/avoine.jpg', category: 'Céréales' },
    { id: 4, name: 'Quinoa', image: 'public/images/quinoa.jpg', category: 'Céréales' },

    // Protéines
    { id: 5, name: 'Poulet', image: 'public/images/poulet.jpg', category: 'Protéines' },
    { id: 6, name: 'Œufs', image: 'public/images/oeufs.jpg', category: 'Protéines' },
    { id: 7, name: 'Saumon', image: 'public/images/saumon.jpg', category: 'Protéines' },
    { id: 8, name: 'Tofu', image: 'public/images/tofu.jpg', category: 'Protéines' },

    // Légumes
    { id: 9, name: 'Tomates', image: 'public/images/tomates.jpg', category: 'Légumes' },
    { id: 10, name: 'Épinards', image: 'public/images/epinards.jpg', category: 'Légumes' },
    { id: 11, name: 'Brocoli', image: 'public/images/brocoli.jpg', category: 'Légumes' },
    { id: 12, name: 'Carottes', image: 'public/images/carottes.jpg', category: 'Légumes' },

    // Fruits
    { id: 13, name: 'Banane', image: 'public/images/banane.jpg', category: 'Fruits' },
    { id: 14, name: 'Pomme', image: 'public/images/pomme.jpg', category: 'Fruits' },
    { id: 15, name: 'Fraises', image: 'public/images/fraises.jpg', category: 'Fruits' },

    // Produits laitiers
    { id: 16, name: 'Yaourt', image: 'public/images/yaourt.jpg', category: 'Produits laitiers' },
    { id: 17, name: 'Fromage', image: 'public/images/fromage.jpg', category: 'Produits laitiers' },
    { id: 18, name: 'Lait', image: 'public/images/lait.jpg', category: 'Produits laitiers' }
  ];

  // Base de données de recettes
  const recipesDatabase: Recipe[] = [
    // Petit déjeuner
    {
      id: 1,
      name: "Bol de porridge aux fruits",
      image: 'public/images/Bol-de-porridge-aux-fruits.jpg',
      mealType: "breakfast",
      ingredients: [
        { name: "Avoine", quantity: "50g" },
        { name: "Lait", quantity: "200ml" },
        { name: "Banane", quantity: "1" },
        { name: "Fraises", quantity: "5" }
      ],
      nutrition: {
        calories: 350,
        proteins: 12,
        carbs: 55,
        fats: 8
      },
      instructions: [
        "Faire chauffer le lait",
        "Ajouter l'avoine et cuire 3 minutes",
        "Garnir avec les fruits coupés"
      ],
      preparationTime: "10 min",
      servings: 1
    },
    {
      id: 2,
      name: "Toast aux œufs et avocat",
      image: 'public/images/Toast-aux-œufs-et-avocat.jpg',
      mealType: "breakfast",
      ingredients: [
        { name: "Pain complet", quantity: "2 tranches" },
        { name: "Œufs", quantity: "2" },
        { name: "Avocat", quantity: "1/2" },
        { name: "Tomates", quantity: "1" }
      ],
      nutrition: {
        calories: 400,
        proteins: 18,
        carbs: 35,
        fats: 22
      },
      instructions: [
        "Toaster le pain",
        "Faire cuire les œufs au plat",
        "Écraser l'avocat et l'étaler sur le pain",
        "Ajouter les œufs et les tomates en tranches"
      ],
      preparationTime: "15 min",
      servings: 1
    },

    // Déjeuner
    {
      id: 3,
      name: "Bowl de quinoa au poulet",
      image: 'public/images/Bowl-de-quinoa-au-poulet.jpg',
      mealType: "lunch",
      ingredients: [
        { name: "Quinoa", quantity: "100g" },
        { name: "Poulet", quantity: "150g" },
        { name: "Brocoli", quantity: "100g" },
        { name: "Carottes", quantity: "1" }
      ],
      nutrition: {
        calories: 550,
        proteins: 35,
        carbs: 65,
        fats: 15
      },
      instructions: [
        "Cuire le quinoa",
        "Griller le poulet assaisonné",
        "Cuire les légumes à la vapeur",
        "Assembler le bowl"
      ],
      preparationTime: "25 min",
      servings: 1
    },

    // Dîner
    {
      id: 4,
      name: "Saumon aux légumes verts",
      image: 'public/images/Saumon-aux-légumes-verts.jpg',
      mealType: "dinner",
      ingredients: [
        { name: "Saumon", quantity: "180g" },
        { name: "Épinards", quantity: "100g" },
        { name: "Brocoli", quantity: "100g" },
        { name: "Riz", quantity: "60g" }
      ],
      nutrition: {
        calories: 480,
        proteins: 32,
        carbs: 45,
        fats: 20
      },
      instructions: [
        "Cuire le riz",
        "Faire cuire le saumon au four",
        "Préparer les légumes à la vapeur",
        "Dresser l'assiette"
      ],
      preparationTime: "30 min",
      servings: 1
    }
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
    if (!mealType || selectedIngredients.length === 0) return;

    // Filtrer les recettes selon le type de repas
    let foundRecipes = recipesDatabase.filter(recipe =>
      recipe.mealType === mealType
    );

    // Filtrer les recettes qui contiennent au moins un des ingrédients sélectionnés
    foundRecipes = foundRecipes.filter(recipe =>
      selectedIngredients.some(selectedIng =>
        recipe.ingredients.some(recipeIng =>
          recipeIng.name.toLowerCase() === selectedIng.toLowerCase()
        )
      )
    );

    if (foundRecipes.length === 0) {
      setShowNoRecipesAlert(true);
    } else {
      setRecipes(foundRecipes);
      setShowRecipes(true);
    }
  };

  // Rendu de la recette dans le modal
  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <div className="recipe-modal">
        <img src={selectedRecipe.image} alt={selectedRecipe.name} className="recipe-image" />
        <h2>{selectedRecipe.name}</h2>

        <div className="recipe-info">
          <div className="info-item">
            <IonIcon icon={timeOutline} />
            <span>{selectedRecipe.preparationTime}</span>
          </div>
          <div className="info-item">
            <IonIcon icon={peopleOutline} />
            <span>{selectedRecipe.servings} portion(s)</span>
          </div>
        </div>

        <div className="nutrition-info">
          <h3>Valeurs nutritionnelles</h3>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <span className="value">{selectedRecipe.nutrition.calories}</span>
              <span className="label">Calories</span>
            </div>
            <div className="nutrition-item">
              <span className="value">{selectedRecipe.nutrition.proteins}g</span>
              <span className="label">Protéines</span>
            </div>
            <div className="nutrition-item">
              <span className="value">{selectedRecipe.nutrition.carbs}g</span>
              <span className="label">Glucides</span>
            </div>
            <div className="nutrition-item">
              <span className="value">{selectedRecipe.nutrition.fats}g</span>
              <span className="label">Lipides</span>
            </div>
          </div>
        </div>

        <div className="ingredients-section">
          <h3>Ingrédients</h3>
          <ul>
            {selectedRecipe.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.name}: {ing.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h3>Instructions</h3>
          <ol>
            {selectedRecipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
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
                              className={`ingredient-item ${selectedIngredients.includes(ingredient.name) ? 'selected' : ''
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
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                <IonCardHeader>
                  <IonCardTitle>{recipe.name}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="recipe-card-info">
                    <div className="info-item">
                      <IonIcon icon={timeOutline} />
                      <span>{recipe.preparationTime}</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={peopleOutline} />
                      <span>{recipe.servings} portion(s)</span>
                    </div>
                  </div>
                  <div className="recipe-card-nutrition">
                    <span>{recipe.nutrition.calories} kcal</span>
                  </div>
                </IonCardContent>
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
          {renderRecipeModal()}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MealSelection;